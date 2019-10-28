import * as vscode from 'vscode';
import { Iconfont, IconfontData } from '../common/utils/Iconfont';


export class IconfontHoverProvider implements vscode.HoverProvider {

  provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

    const line = document.lineAt(position.line).text;

    //鼠标悬浮位置左右个8个字符。
    let start: number = position.character < 8 ? 0 : position.character - 8;
    let end: number = position.character > line.length - 8 ? line.length : position.character + 8;

    let rangTxt = line.substring(start, end);
 
    rangTxt.match(/\&\#x(\w+);/);
    let code: string = RegExp.$1;

    let hover: vscode.Hover | null = null;
    if (!code) {
      return hover;
    }

    let dataArr: Array<IconfontData> = Iconfont.getDataByCode(code);
    let text = '';
    dataArr.forEach(data => {
      text = text + `${Iconfont.dataToMarkdown(data,true)} `;
    });
    if (text) {
      hover = new vscode.Hover(text);
    }

    return hover;

  }
 
}