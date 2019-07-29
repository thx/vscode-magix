import * as vscode from 'vscode';
import * as fs from 'fs';

export class MXWebView {
  static panelMap: Map<string, vscode.WebviewPanel> = new Map();

  private static openWebView(htmlPath: string, title: string): vscode.WebviewPanel {
    let panel: vscode.WebviewPanel | undefined = this.panelMap.get(title);
    
    if (panel) {
      const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
      panel.reveal(column);
      return panel;
    }

    panel = vscode.window.createWebviewPanel(
      'mxWebView', // viewType
      title, // 视图标题
      vscode.ViewColumn.Active, // 显示在编辑器的哪个部位
      {
        enableScripts: true, // 启用JS，默认禁用
        retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
      }
    );
    //指定html内容
    let html: string = fs.readFileSync(htmlPath, 'utf-8');
    panel.webview.html = html;
    panel.onDidDispose((e:any)=>{
      this.panelMap.delete(title);
    });
    this.panelMap.set(title, panel);
    return panel;
  }
  public static openConfigPanel(htmlPath: string, title: string): vscode.WebviewPanel {
    return this.openWebView(htmlPath, title);
  }

}
