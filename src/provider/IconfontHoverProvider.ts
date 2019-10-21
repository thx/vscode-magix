import * as vscode from 'vscode';
import { Iconfont, IconfontData } from '../common/utils/Iconfont';

const Datauri = require('datauri');

export class IconfontHoverProvider implements vscode.HoverProvider {

  provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
    const datauri = new Datauri();

    const line = document.lineAt(position.line).text;

    //鼠标悬浮位置左右个8个字符。保证能圈到<i> innerHTML 内容
    let start: number = position.character < 8 ? 0 : position.character - 8;
    let end: number = position.character > line.length - 8 ? line.length - 1 : position.character + 8;

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
      let svg: string = this.toSvg(data);
      datauri.format('.svg', svg);
      text = text + `![](${datauri.content}) `;
    });
    if (text) {
      hover = new vscode.Hover(text);
    }

    return hover;

  }
  toSvg(data: IconfontData) {
    return `<svg viewBox='0 0 1500 1500' width='80' height='120' style='margin:10px;' xmlns='http://www.w3.org/2000/svg' >
    <path style='transform:rotateX(180deg);transform-origin:center;scale(.8);' fill='#EA3C3C' d='${data.data}'></path>
    <foreignObject width="1500" height="240">
    <body xmlns="http://www.w3.org/1999/xhtml">
      <div style="font-size:240px;margin:0;color:#1F94ED;">${data.className}</div>
    </body>
  </foreignObject>
    </svg>`;
  }
}