import * as vscode from 'vscode';
import { Iconfont, IconfontData } from '../common/utils/Iconfont';


export class IconfontCompletionItemProvider implements vscode.CompletionItemProvider {
  
  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    
    let list: vscode.CompletionList = new vscode.CompletionList();
    let arr:Array<IconfontData> = Iconfont.getDataByCode('');
    arr.forEach(item=>{
      let label:string = `&#x${item.code};`;
      let completionItem:vscode.CompletionItem = new vscode.CompletionItem(label,vscode.CompletionItemKind.Field);
      let ms:vscode.MarkdownString = new vscode.MarkdownString(Iconfont.dataToMarkdown(item,false));
      ms.isTrusted = true;
      completionItem.documentation = ms;
      completionItem.detail=`iconfon图标: class:${item.className} code:${item.code}`;
      completionItem.insertText = `#x${item.code};`;
      list.items.push(completionItem);
    });
   
    return list;
  }
  /**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item 
 * @param {*} token 
 */
  resolveCompletionItem?(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
    return item;
  }
}