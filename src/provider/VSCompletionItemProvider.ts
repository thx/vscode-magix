import * as vscode from 'vscode';
import {ESFileProvider} from './ESFileProvider';
import { ESFileInfo } from '../model/ESFileInfo';
import {HtmlESMappingCache} from '../common/utils/CacheUtils';
import { FnInfo } from '../model/FnInfo';

export class MXEventCompletionItemProvider implements vscode.CompletionItemProvider {
  arr: Array<string> = ['click', 'change', 'mouseenter', 'mouseleave', 'keyup', 'keydown', 'keypress','mouseover','mouseout'];
  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const line = document.lineAt(position);
    // 只截取到光标位置为止，防止一些特殊情况
    const lineText = line.text.substring(0, position.character);
    let list: vscode.CompletionList = new vscode.CompletionList();
   
    if (/.?(mx-)$/.test(lineText)) {
      this.arr.forEach((item) => {
        list.items.push(new vscode.CompletionItem('mx-' + item, vscode.CompletionItemKind.Field));
      });
      return list;
    } else if (/.?mx-[a-z]+\s*=(\"|\')$/.test(lineText)) {
      let esFilePath: any = HtmlESMappingCache.getEsFilePath(document.fileName);
      if (!esFilePath) {
        return list;
      }
      let esFileInfo: ESFileInfo = ESFileProvider.provideFileInfo(esFilePath, '');
      if (!esFileInfo) {
        return list;
      }
      esFileInfo.functions.forEach((fnInfo:FnInfo)=>{
       let name = fnInfo.fnName.replace(/<[a-z]+>/,'');
       list.items.push(new vscode.CompletionItem(name, vscode.CompletionItemKind.Function));
      });
    }
    return list;
  }
  /**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item 
 * @param {*} token 
 */
  resolveCompletionItem?(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
    return null;
  }
}

export class MXEventNameCompletionItemProvider implements vscode.CompletionItemProvider {
  
  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const line = document.lineAt(position);
    // 只截取到光标位置为止，防止一些特殊情况
    const lineText = line.text.substring(0, position.character);
    let list: vscode.CompletionList = new vscode.CompletionList();
    
   if(/.?mx-[a-z]+\s*=(\'|\")$/.test(lineText)){
    
    }
    
    return list;
  }
  /**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item 
 * @param {*} token 
 */
  resolveCompletionItem?(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
    return null;
  }
}