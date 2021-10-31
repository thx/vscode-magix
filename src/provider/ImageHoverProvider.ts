import * as vscode from 'vscode';


export class ImageHoverProvider implements vscode.HoverProvider {
  private quotationReg = /[\'\"()]+([^\'\"()]*)[\'\")]+/g;
  provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
    
    let word = document.getText(document.getWordRangeAtPosition(position, this.quotationReg));
    word = word.replace(/[\'\"()]/gi,'').trim();
    let hover: vscode.Hover | null = null;
    if (!word) {
      return hover;
    }
    if(!/\.(png|jpg|gif|jpeg|webp)\?*.*$/.test(word)){
      return hover;
    }
    if (/^\/\/.+/.test(word)) {
      word = 'https:' + word;
    }
    hover = new vscode.Hover(word);
    hover.contents = [new vscode.MarkdownString(`![](${word})`)];
    return hover;

  }
 
}