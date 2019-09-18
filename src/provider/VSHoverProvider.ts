import * as vscode from 'vscode';
import { Iconfont, IconfontData } from '../common/utils/Iconfont';

const Datauri = require('datauri');
const SVG_TEMPLATE_START: string = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg  class="icon" style="-webkit-transform: rotateX(180deg);" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="120"><path d="`;
const SVG_TEMPLATE_END: string = `" fill="#EA3C3C" ></path></svg>`;

export class VSHoverProvider implements vscode.HoverProvider {

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

    let iArr = line.match(/<i\s+[^>.]*>\&\#x\w+;<\/i>/g);
    if (!iArr) {
      return hover;
    }

    let iNode = iArr.find((item: string) => { return item.indexOf(code) > -1; });
    if (!iNode) {
      return hover;
    }

    iNode.match(/class\s*=\s*('[^']*'|"[^"]*")/g);
    let classNames = RegExp.$1;
    if (!classNames) {
      return hover;
    }
    
    let classArr = classNames.split(' ');
    classArr.forEach((className: string) => {
      className = className.replace(/[\'\"]/gi, '');
      if (className) {
        
        let dataArr: Array<IconfontData> | undefined = Iconfont.getDataByClass(className);
        if (dataArr) {
          
          let iconfontData: IconfontData | undefined = dataArr.find((iconfont: IconfontData) => { return iconfont.code === code; });
          if (iconfontData) {
            let svg: string = SVG_TEMPLATE_START + iconfontData.data + SVG_TEMPLATE_END;
            
            datauri.format('.svg', svg);
            hover = new vscode.Hover(`![](${datauri.content})`);
            
          }

        }
      }
    });

    return hover;

  }
}