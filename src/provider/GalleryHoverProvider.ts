import * as vscode from 'vscode';
import { GalleryInfo } from '../model/GalleryInfo';


export class GalleryHoverProvider implements vscode.HoverProvider {

  provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
    const word: string = document.getText(document.getWordRangeAtPosition(position));
    // 长度大于20的就没有提示
    if (!word || word.length > 20) {
      return null;
    }

    const info: any = GalleryInfo.get(word);
  
    let hover: vscode.Hover | null = null;
    if (!info) {
      return hover;
    }
    const data = info.data;
    hover = new vscode.Hover(data.title);
    let url = `https://mo.m.taobao.com/page_201912120119435#!${data.url}`;
    hover.contents = [new vscode.MarkdownString(`#### Magix Gallery - ${data.title} [链接](${url})`),
      new vscode.MarkdownString(`#### ${data.subTitle} `)];
    return hover;

  }
}