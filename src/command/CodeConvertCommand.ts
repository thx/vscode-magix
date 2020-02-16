import * as vscode from 'vscode';
import { Command } from '../common/constant/Command';
import { Rule } from '../model/CodeConvertRule';
import { EditorWebview } from '../webview/EditorWebview';
import { TableConverter } from '../common/code/ComplexConverter';
import * as fs from 'fs';
import { isString } from 'util';
import { ComponentInfo, Type } from '../model/componentInfo';

const parser = require('posthtml-parser');

export class CodeConvertCommand {
    public registerCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_CODE_TO_REACT, (args) => {
            try {
                const html = fs.readFileSync(args.path, 'utf-8');
                const content = parser(html);
                const components: Array<ComponentInfo> = [];
                this.convert(content, components);
                const code = this.componentsToCode(components);
                let webview: EditorWebview = new EditorWebview(context);
                webview.show({ code });
                console.log(components);
            } catch (error) {
                console.error(error);
                vscode.window.showWarningMessage(error);
            }
        }));
    }
    private convert(content: any, out: Array<ComponentInfo>) {
        if (!Array.isArray(content)) {
            return;
        }
        content.forEach((item: any) => {
            if (typeof (item) === 'object' && item.tag) {
                //复杂组件自己处理逻辑
                if (item.tag === 'table') {
                    let table: ComponentInfo | null = TableConverter.convert(item);
                    if (table) {
                        out.push(table);
                    }
                } else {
                    this.matchRule(item, out);
                }
                this.convert(item.content, out);
            }
        })
    }
    private matchRule(element: any, out: Array<ComponentInfo>) {
        Rule.RULES.forEach(rule => {
            let isMatch: boolean = true;
            rule.match.forEach(m => {
                if (m.target === 'tag' && element.tag) {
                    if (m.type === 1) {
                        isMatch = isMatch && (element.tag === m.value);
                    } else if (m.type === 2) {
                        isMatch = isMatch && (element.tag.indexOf(m.value) > -1);
                    }
                } else if (m.target === 'attr' && element.attrs) {
                    let find = false;
                    for (const attrKey in element.attrs) {
                        const attrVal = element.attrs[attrKey];
                        if (attrKey === m.key) {
                            if (m.type === 1) {
                                if (attrVal === m.value) {
                                    find = true;
                                    break;
                                }
                            } else if (m.type === 2) {
                                if (attrVal.indexOf(m.value) > -1) {
                                    find = true;
                                    break;
                                }
                            }
                        }

                    }
                    isMatch = isMatch && find;
                } else {
                    isMatch = false;
                }
            });
            if (isMatch) {
                const convert = rule.convert;
                let attrs: any[] = [];
                convert.attrMap.forEach(am => {
                    if (element.attrs[am.form]) {
                        attrs.push({ key: am.to, value: element.attrs[am.form] });
                    }
                });
                attrs = attrs.concat(this.defaultAttrs(element.attrs));

                const component: ComponentInfo = new ComponentInfo();
                component.type = Type.Common;
                component.importInfo = convert.importInfo;
                component.tag = convert.tag;
                component.attrs = attrs;
                component.content = convert.hasContent && element.content && element.content.length > 0 ? element.content[0] : '';
                component.element = element;

                out.push(component);
            }
        });
    }
    /**
     * map style and class
     */
    private defaultAttrs(sourceAttrs: any) {
        const attrs: any[] = [];
        let style = sourceAttrs['style'];
        if (style) {
            let outArr: string[] = [];
            let arr = style.split(';');
            if (arr.length > 0) {
                arr.forEach((s: string) => {
                    if (!s) {
                        return;
                    }
                    let kv = s.split(':');
                    if (kv.length > 1) {
                        let styleKey = kv[0];
                        //去掉 !important
                        let styleValue = kv[1].replace('!important', '');
                        let keyNameArr = styleKey.split('-');

                        if (keyNameArr.length > 1) {
                            keyNameArr.forEach((n, index) => {
                                if (index > 0 && n) {
                                    keyNameArr[index] = n.replace(n[0], n[0].toUpperCase());
                                }
                            });
                            styleKey = keyNameArr.join('');
                        }
                        outArr.push(`${styleKey}:'${styleValue}'`);
                    }

                })
            }
            if (outArr.length > 0) {
                attrs.push({ key: 'style', value: '{{' + outArr.join(';') + '}}' });
            }

        }
        if (sourceAttrs['class']) {
            attrs.push({ key: 'className', value: sourceAttrs['class'] });
        }
        return attrs;
    }
    private componentsToCode(components: Array<ComponentInfo>) {
        let code = '';
        let importCode = '';
        components.forEach((item: ComponentInfo) => {
            //处理复杂的组件
            if (item.type === Type.Complex) {
                importCode += item.importInfo + '\r';
                code += item.content + '\r';
                return;
            }
            // 开始处理rule定义的简单组件
            if (item.importInfo && importCode.indexOf(item.importInfo) < 0) {
                importCode += item.importInfo + '\r';
            }
            code += '<' + item.tag + '\r';
            item.attrs && item.attrs.forEach((am: any) => {
                //去掉无效的class
                if (am.key === 'className') {
                    am.value = am.value.replace('resource-field', '')
                        .replace('form-control', '')
                        .replace('btn', '')
                        .replace('btn-brand', '');
                }
                if (am.key === 'style') {
                    code += '\t' + am.key + '=' + am.value + '\r';
                } else {
                    code += '\t' + am.key + '="' + am.value + '"\r';
                }
            });
            if (item.content && isString(item.content)) {
                code += '>' + item.content + '</' + item.tag + '>\r';
            } else {
                code += '/>\r';
            }
        });
        return importCode + '\r\r' + code;
    }
}
