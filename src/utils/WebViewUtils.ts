import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class MXWebView {
  static panelMap: Map<string, vscode.WebviewPanel> = new Map();

  public static openWebView(context: vscode.ExtensionContext, htmlPath: string, title: string): vscode.WebviewPanel {
    let panel: vscode.WebviewPanel | undefined = this.panelMap.get(htmlPath);

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

    panel.webview.html = this.getWebViewContent(context, htmlPath);
    panel.onDidDispose((e: any) => {
      this.panelMap.delete(htmlPath);
    });
    this.panelMap.set(htmlPath, panel);
    return panel;
  }
  /**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 */
  private static getWebViewContent(context: vscode.ExtensionContext, templatePath: string): string {
    const resourcePath = path.join(context.extensionPath, templatePath);
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
      return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    return html;
  }
  public static openConfigPanel(context: vscode.ExtensionContext, htmlPath: string, title: string): vscode.WebviewPanel {
    return this.openWebView(context, htmlPath, title);
  }

}
