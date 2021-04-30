
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
                const AST = $(content, { parseOptions: { html: true } });
                AST.find('<mx-table>').each((node) => {
                    node.attr('content.name', 'mx-stickytable');
                    this.resetTableAttr(node);
                    this.resetTable(node);
                });
                const code = AST.generate();
                editor.edit((editorBuilder: TextEditorEdit) => {
                    const lines = content.split('\n');
                    const lastWord = lines[lines.length - 1].length - 1;
                    const allWords = new Range(new Position(0, 0), new Position(lines.length, lastWord));
                    editorBuilder.replace(allWords, code);
                });
                
            } catch (error) {

                window.showWarningMessage(error);
            }
        }));
    }
    private resetTableAttr(node: any) {
        const attrs: any = node.attr('content.attributes');
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
            this.removeAttr(node, ['list', 'sticky-interval']);
        }
        // left-col-sticky
        const leftTable = node.find('<table left="true">');
        if (leftTable.length > 0) {
            const ths = node.find('<thead>').find('<tr>').find('<th>');
            if (ths.length > 0) {
                this.addAttr(node.attr('content.attributes'), 'left-col-sticky', ths.length);
            }
        }
    }
    private resetTable(node: any) {
        const leftTable = node.find('<table left="true">');
        const centerTable = node.find('<table center="true">');

        const hasLeftTable = leftTable.length > 0;
        const hasCenterTable = centerTable.length > 0;

        if (hasLeftTable && hasCenterTable) {

            this.mergeTrs(leftTable, centerTable, 'thead');
            this.mergeTrs(leftTable, centerTable, 'tbody');

            this.removeAttr(centerTable, ['center','class']);
            this.removeTableClassName(centerTable);
            node.remove('<table left="true">');
        } else if (hasLeftTable) {
            this.removeAttr(hasLeftTable, ['left']);
            this.removeTableClassName(hasLeftTable);
        } else if (hasCenterTable) {
            this.removeAttr(centerTable, ['center']);
            this.removeTableClassName(centerTable);
        } else {
            const table = node.find('<table>');
            if(table.length > 0){
                this.removeTableClassName(table);
            }
        }
        node.remove('<!-- 固定列，在table上配置left="true" -->');
        node.remove('<!--  滚动列，在table上直接配置center="true"  -->');
        this.resetThSort(node);
    }
    private resetThSort(node: any) {
        node.find('<thead>').find('<th>').each((th: any)=>{
            const sortAST = th.find('<span sort-trigger=$_$>');
            if (!sortAST.length) {
                return;
            }
            
            // 生成mx-stickytable.sort标签
            sortAST.each((s: any)=>{
                s.attr('content.name','mx-stickytable.sort');
                const attrs = s.attr('content.attributes');
                attrs.forEach((attr:any)=>{
                    const keyName = attr.key.content;
                    if(keyName==='sort-trigger'){
                        attr.key.content = 'value';
                    }else if(keyName==='order-field-key'){
                        attr.key.content = 'order-field';
                    }else if(keyName==='order-by-key'){
                        attr.key.content = 'order-by';
                    }
                })
                this.addAttr(attrs,'order','！！！自行处理！！！');

                //排除排序标签<span sort-trigger="xxx">
                const children = th.attr('content.children');
                const innerChildren = children.filter((c:any)=>{
                    return c.content.name !== 'mx-stickytable.sort';
                }).map((item:any)=>({...item}));
                //将th元素塞入到mx-stickytable.sort标签中
                s.attr('content.children',innerChildren);
            });
            const thChildren = th.attr('content.children');
            th.attr('content.children', thChildren.filter((c: any) => (c.content.name === 'mx-stickytable.sort')));
        });
    }
  
    /**
     * 删除class table
     * @param node 
     */
    private removeTableClassName(node: any) {
       this.removeClassName(node,'table');
    }
    /**
     * 删除某个class
     * @param node 
     * @param name 
     */
    private removeClassName(node: any, name: string) {
        const attrs = node.attr('content.attributes');
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
            }).join('');
            attr.value.content = value;
            if (value.length === 0) {
                removeIndex = index;
            }
        });
        if (removeIndex > -1) {
            attrs.splice(removeIndex, 1);
        }
    }
    private getTrs(node: any, parentNodeName: string) {
        let trs = node.find(parentNodeName).attr('content.children') || [];
        trs = trs.filter((item: any) => {
            return item.nodeType === 'tag' && item.content.name === 'tr';
        });
        return trs;
    }
    private mergeTrs(leftTable: any, centerTable: any, parentNode: 'thead' | 'tbody') {
        const nodeName = `<${parentNode}>`

        let leftTrs = this.getTrs(leftTable,nodeName);
        let centerTrs = this.getTrs(centerTable,nodeName);

        //处理子表头
        if(leftTrs.length != centerTrs.length){
            const rowspan = centerTrs.length - leftTrs.length + 1;
            if(rowspan < 2){
                //center表格thead里面的tr数量少于 left表格的
                return;
            }
            leftTrs.forEach((tr:any)=>{
               if(tr && tr.content && tr.content.children){
                   tr.content.children.forEach((c:any)=>{
                    if(c.nodeType === 'tag' && (c.content.name === 'th' || c.content.name === 'td')){
                        this.addAttr(c.content.attributes,'rowspan', rowspan);
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
            if(!tr.content || !tr.content.attributes){
                return;
            }
            const attrs = tr.content.attributes;
            let isOperationTr = false;
            attrs.forEach((attr: any, index: number) => {
                const keyName = attr.key.content;
                const cNames = attr.value.content.split(' ');
  
                isOperationTr = keyName === 'class' && !!cNames.find((clazz: string) => {
                    return clazz === 'operation-tr';
                });
            })
            if (isOperationTr) {
                this.addAttr(attrs, 'mx-stickytable-operation', 'line');
                this.removeClassName4Attrs(attrs, 'operation-tr');
            }
        })
       
    }
    private addAttr(attrs: any, key: string, value: string|number) {
        attrs.push({
            key: { content: key, type: 'token:attribute-key' },
            value: { content: value, type: 'token:attribute-value' }
        });
    }
    private removeAttr(node: any, names: string[]) {
        const attrs = node.attr('content.attributes');
        const newAttrs = attrs.filter((attr: any) => {
            const keyName = attr.key.content;
            return !names.includes(keyName);
        });
        node.attr('content.attributes', newAttrs);
    }


}
