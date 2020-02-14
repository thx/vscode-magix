import * as vscode from 'vscode';
import { Command } from '../common/constant/Command';
import { Rule } from '../model/CodeConverRule';
import {EditorWebview} from '../webview/EditorWebview';

import * as fs from 'fs';
import { isString } from 'util';

const parser = require('posthtml-parser');

export class CodeConvertCommand {
    public registerCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_CODE_TO_REACT, (args) => {
            try {
                const html = fs.readFileSync(args.path, 'utf-8');
                const content = parser(html);
                const components: any[] = [];
                this.convert(content, components);
                const code = this.componentsToCode(components);
                let webview:EditorWebview = new EditorWebview(context);
                webview.show({code});
                console.log(components);
            } catch (error) {
                console.error(error);
                vscode.window.showWarningMessage(error);
            }
        }));
    }
    private convert(content: any, out: any[]) {
        if (!Array.isArray(content)) {
            return;
        }
        content.forEach(item => {
            if (typeof (item) === 'object' && item.tag) {
                Rule.RULES.forEach(rule => {
                    let isMatch: boolean = true;
                    rule.match.forEach(m => {
                        if (m.target === 'tag' && item.tag) {
                            if (m.type === 1) {
                                isMatch = isMatch && (item.tag === m.value);
                            } else if (m.type === 2) {
                                isMatch = isMatch && (item.tag.indexOf(m.value) > -1);
                            }
                        } else if (m.target === 'attr' && item.attrs) {
                            let find = false;
                            for (const attrKey in item.attrs) {
                                const attrVal = item.attrs[attrKey];
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
                        const attrs:any[] = [];
                        convert.attrMap.forEach(am=>{
                            if (item.attrs[am.form]) {
                                attrs.push({ key: am.to, value: item.attrs[am.form] });
                            }
                        });
                        const component = {
                            importInfo: convert.importInfo,
                            tag: convert.tag,
                            attrs,
                            content: convert.hasContent && item.content && item.content.length > 0? item.content[0] : '',
                            item
                        }
                        out.push(component);
                    }
                });
                if (item.content) {
                    this.convert(item.content, out);
                }
            }
        })
    }
    componentsToCode(components:any[]){
        let code = '';
        let importCode = '';
        components.forEach(item => {
            if(importCode.indexOf(item.importInfo) < 0){
                importCode += item.importInfo + '\r';
            }
            code += '<' + item.tag + '\r';
            item.attrs.forEach((am: any) => {
                code += '\t' + am.key + '="' + am.value + '"\r';
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
