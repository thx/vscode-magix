
import * as $ from 'gogocode';
import { Command } from '../common/constant/Command';
import { TextEditor, window, ExtensionContext, commands, TextEditorEdit, Range, Position } from 'vscode';
import { Logger, LogType } from '../common/utils/Logger';
export class MxTableConvertCommand {
    public registerCommand(context: ExtensionContext) {
        context.subscriptions.push(commands.registerCommand(Command.COMMAND_CODE_CONVERT_MX_TABLE, (args) => {

            try {
                let editor: TextEditor | undefined = window.activeTextEditor;
                if (!editor || !editor.document) {
                    return;
                }
                Logger.aplusLog(LogType.MxTable, { path: editor.document.fileName });
                const content = editor.document.getText();
                if (content.length === 0) {
                    return;
                }

                const lines = this.getLines(content);
                const tables: any[] = [];

                const AST = $(content, { parseOptions: { html: true } });
                //全部替换
                let replaceAll = false;
                AST.find('<mx-table>$_$</mx-table>').each((ast) => {
                    ast.attr('content.name', 'mx-stickytable');
                    this.resetTableAttr(ast);
                    this.resetTable(ast);
                    const range = this.buildTableRange(lines, ast.node);
                    if (range) {
                        tables.push({ code: ast.generate(), range });
                    } else {
                        //找不到 table 的range 需要全部替换
                        replaceAll = true;
                    }
                });
                // 修改editor中的内容
                editor.edit((editorBuilder: TextEditorEdit) => {
                    if (replaceAll) {
                        const code = AST.generate();
                        const lines = content.split('\n');
                        const lastWord = lines[lines.length - 1].length - 1;
                        const allWordsRang = new Range(new Position(0, 0), new Position(lines.length, lastWord));
                        editorBuilder.replace(allWordsRang, code);
                    } else {
                        tables.forEach((t: any) => {
                            editorBuilder.replace(t.range, t.code);
                        });
                    }
                });

            } catch (error) {
                window.showWarningMessage(error.message);
            }
        }));
    }
    private getLines(content: string) {
        let lines = content.split('\n');
        let step = content.indexOf('\r\n') > -1 ? 2 : 1;
        let newLines: any[] = [];
        lines.forEach((line: string, index: number) => {
            if (index === 0) {
                newLines.push({ code: line, start: 0, end: line.length - 1 })
            } else if (index === lines.length - 1) {
                const perLine = newLines[index - 1];
                const start = perLine.end + step + 1;
                newLines.push({ code: line, start, end: content.length - 1 });
            } else {
                const perLine = newLines[index - 1];
                const start = perLine.end + step + 1;
                newLines.push({ code: line, start, end: start + line.length - 1 });
            }
        });
        return newLines;
    }
    private resetTableAttr(ast: any) {
        const attrs: any = ast.attr('content.attributes');
        if (attrs) {
            attrs.forEach((attr: any) => {
                const keyName = attr.key.content;
                if (keyName === 'sticky') {
                    attr.key.content = 'head-sticky';
                } else if (keyName === 'scroll-wrapper') {
                    const val = attr.value.content;
                    if (val) {
                        attr.value.content = `#${val}`;
                    }
                }
            });
            this.removeAttr(ast, ['list', 'sticky-interval']);
        }
        // left-col-sticky
        const leftTable = ast.find('<table left="true">');
        if (leftTable.length > 0) {
            const ths = ast.find('<thead>').find('<tr>').find('<th>');
            if (ths.length > 0) {
                this.addAttr(ast.attr('content'), 'left-col-sticky', ths.length);
            }
        }
    }
    private resetTable(ast: any) {
        const leftTable = ast.find('<table left="true">');
        const centerTable = ast.find('<table center="true">');

        const hasLeftTable = leftTable.length > 0;
        const hasCenterTable = centerTable.length > 0;

        if (hasLeftTable && hasCenterTable) {

            this.mergeTrs(leftTable, centerTable, 'thead');
            this.mergeTrs(leftTable, centerTable, 'tbody');
            
            // 转移属性
            centerTable.attr('content.attributes',leftTable.attr('content.attributes'));
            this.removeAttr(centerTable, ['left']);

            ast.remove('<table left="true">');
        } else if (hasLeftTable) {
            this.removeAttr(hasLeftTable, ['left']);
        } else if (hasCenterTable) {
            this.removeAttr(centerTable, ['center']);
        } else {
            const table = ast.find('<table>');
        }
        ast.remove('<!-- 固定列，在table上配置left="true" -->');
        ast.remove('<!--  滚动列，在table上直接配置center="true"  -->');
        this.resetThSort(ast);
    }
    private resetThSort(ast: any) {
        ast.find('<thead>').find('<th>').each((th: any) => {
            const sortAST = th.find('<span sort-trigger=$_$>');
            if (!sortAST.length) {
                return;
            }

            // 生成mx-stickytable.sort标签
            sortAST.each((s: any) => {
                s.attr('content.name', 'mx-stickytable.sort');
                const attrs = s.attr('content.attributes');
                attrs.forEach((attr: any) => {
                    const keyName = attr.key.content;
                    if (keyName === 'sort-trigger') {
                        attr.key.content = 'value';
                    } else if (keyName === 'order-field-key') {
                        attr.key.content = 'order-field';
                    } else if (keyName === 'order-by-key') {
                        attr.key.content = 'order-by';
                    }
                })
                this.addAttr(s.attr('content'), 'order', '！！！自行处理！！！');

                //排除排序标签<span sort-trigger="xxx">
                const children = th.attr('content.children');
                const innerChildren = children.filter((c: any) => {
                    return c.content.name !== 'mx-stickytable.sort';
                }).map((item: any) => ({ ...item }));
                //将th元素塞入到mx-stickytable.sort标签中
                s.attr('content.children', innerChildren);
            });
            const thChildren = th.attr('content.children');
            th.attr('content.children', thChildren.filter((c: any) => (c.content.name === 'mx-stickytable.sort')));
        });
    }

    /**
     * 删除class table
     * @param ast 
     */
    private removeTableClassName(ast: any) {
        this.removeClassName(ast, 'table');
    }
    /**
     * 删除某个class
     * @param ast 
     * @param name 
     */
    private removeClassName(ast: any, name: string) {
        const attrs = ast.attr('content.attributes');
        this.removeClassName4Attrs(attrs, name);
    }
    private removeClassName4Attrs(attrs: any, name: string) {
        let removeIndex = -1;
        attrs.forEach((attr: any, index: number) => {
            const keyName = attr.key.content;
            if (keyName !== 'class') {
                return;
            }
            const cNames = attr.value.content.split(' ');
            const value = cNames.filter((clazz: string) => {
                const c = clazz.trim();
                return c.length != 0 && c !== name;
            }).join(' ');
            attr.value.content = value;
            if (value.length === 0) {
                removeIndex = index;
            }
        });
        if (removeIndex > -1) {
            attrs.splice(removeIndex, 1);
        }
    }
    private getTrs(ast: any, parentNodeName: string) {
        let trs = ast.find(parentNodeName).attr('content.children') || [];
        trs = trs.filter((item: any) => {
            return item.nodeType === 'tag' && item.content.name === 'tr';
        });
        return trs;
    }
    private mergeTrs(leftTable: any, centerTable: any, parentNode: 'thead' | 'tbody') {
        const nodeName = `<${parentNode}>`

        let leftTrs = this.getTrs(leftTable, nodeName);
        let centerTrs = this.getTrs(centerTable, nodeName);

        //处理子表头
        if (leftTrs.length != centerTrs.length) {
            const rowspan = centerTrs.length - leftTrs.length + 1;
           
            leftTrs.forEach((tr: any) => {
                if (tr && tr.content && tr.content.children) {
                    tr.content.children.forEach((c: any) => {
                        if (c.nodeType === 'tag' && (c.content.name === 'th' || c.content.name === 'td')) {
                            this.addAttr(c.content, 'rowspan', rowspan);
                        }
                    })
                }
            })
        }
        //合并
        centerTrs.forEach((tr: any, index: number) => {
            if (index >= leftTrs.length) {
                return;
            }
            const leftTr = leftTrs[index];
            if (leftTr && tr.content.children && leftTr.content.children) {
                tr.content.children = [...leftTr.content.children, ...tr.content.children];
            }
        })
        // 处理 operation-tr
        centerTrs.forEach((tr: any) => {
            if (!tr.content || !tr.content.attributes) {
                return;
            }
            const attrs = tr.content.attributes;
            let isOperationTr = false;

            for (let i = 0; i < attrs.length; i++) {
                const attr = attrs[i];
                const keyName = attr.key.content;
                const cNames = attr.value.content.split(' ');

                isOperationTr = keyName === 'class' && !!cNames.find((clazz: string) => {
                    return clazz === 'operation-tr';
                });

                if (isOperationTr) {
                    break;
                }
            }
           
            if (isOperationTr) {
                this.addAttr(tr.content, 'mx-stickytable-operation', 'line');
                this.removeClassName4Attrs(attrs, 'operation-tr');
            }
        })

    }
    private addAttr(content: any, key: string, value: string | number) {
        if(!content){
            return;
        }
        const attr = {
            key: { content: key, type: 'token:attribute-key' },
            value: { content: value, type: 'token:attribute-value' }
        }
        if (content.attributes) {
            content.attributes.push(attr);
        } else {
            content.attributes = [attr];
        }
    }
    private removeAttr(ast: any, names: string[]) {
        const attrs = ast.attr('content.attributes');
        const newAttrs = attrs.filter((attr: any) => {
            const keyName = attr.key.content;
            return !names.includes(keyName);
        });
        ast.attr('content.attributes', newAttrs);
    }
    /**
     * 找到需要替换的table的位置
     * @param lines 
     * @param node 
     * @returns 
     */
    private buildTableRange(lines: any[], node: any) {
        const { content: { openStart, close, openEnd } } = node;
        const start = openStart.startPosition;
        const end = (close || openEnd).endPosition;
        let starPosition, endPosition;
        lines.forEach((line: any, index: number) => {
            if (start >= line.start && start <= line.end) {
                const p = line.code.indexOf('<mx-table');
                if (p > -1) {
                    starPosition = new Position(index, p);
                }
            }
            if (end >= line.start && end <= line.end) {
                const p = line.code.lastIndexOf('</mx-table>');
                if (p > -1) {
                    endPosition = new Position(index, p + 11);
                }
            }
        })
        if (starPosition && endPosition) {
            return new Range(starPosition, endPosition);
        }
        return null;
    }


}
