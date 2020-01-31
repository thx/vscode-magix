import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class BaseView {
    private context: vscode.ExtensionContext;
    constructor(context: vscode.ExtensionContext, ) {
        this.context = context;
    }
    protected panel: vscode.WebviewPanel | undefined;
    public show() { }
    /**
    * 从某个HTML文件读取能被Webview加载的HTML内容
    * @param {*} templatePath 相对于插件根目录的html文件相对路径
    */
    protected getWebViewContent(templatePath: string): string {
        const resourcePath = path.join(this.context.extensionPath, templatePath);
        const dirPath = path.dirname(resourcePath);
        let html = fs.readFileSync(resourcePath, 'utf-8');
        // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
        html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
            return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
        });
        return html;
    }
    protected createWebview(
        htmlPath: string,
        title: string,
        showOptions: vscode.ViewColumn | { viewColumn: vscode.ViewColumn, preserveFocus?: boolean }): void {
        const has: boolean = WebviewContainer.webviewMap.has(htmlPath)
        if (has) {
            const column = vscode.window.activeTextEditor
                ? vscode.window.activeTextEditor.viewColumn
                : undefined;
            const panel = WebviewContainer.webviewMap.get(htmlPath)
            if (panel) {
                panel.reveal(column);
            }
        } else {
            this.panel = vscode.window.createWebviewPanel(
                'mxWebView', // viewType
                title, // 视图标题
                showOptions, // 显示在编辑器的哪个部位
                {
                    enableScripts: true, // 启用JS，默认禁用
                    retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
                }
            );

            this.panel.webview.html = this.getWebViewContent(htmlPath);
            WebviewContainer.webviewMap.set(htmlPath, this.panel)
        }


    }
    protected onDidDispose(listener: (e: void) => any): void {
        if (this.panel) {
            this.panel.onDidDispose(listener);
        }
    }
    protected onDidReceiveMessage(listener: (e: any) => any): void {
        if (this.panel) {
            this.panel.webview.onDidReceiveMessage(listener);
        }
    }
    protected postMessage(type: string, data: any): void {
        if (this.panel) {
            this.panel.webview.postMessage({ type, data });
        }
    }
    protected dispose(htmlPath:string) {
        if (this.panel) {
            this.panel.dispose();
            WebviewContainer.webviewMap.delete(htmlPath)
        }
    }
}
class WebviewContainer {
    public static webviewMap: Map<string, vscode.WebviewPanel> = new Map();

}