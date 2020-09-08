import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class BaseView {
    private context: vscode.ExtensionContext;
    constructor(context: vscode.ExtensionContext, ) {
        this.context = context;
    }
    protected panel: vscode.WebviewPanel | undefined;
    public show(args?: any) { }
    /**
    * 从某个HTML文件读取能被Webview加载的HTML内容
    * @param {*} templatePath 相对于插件根目录的html文件相对路径
    */
    protected getWebViewContent(templatePath: string): string {
        const resourcePath = path.join(this.context.extensionPath, templatePath);
        const dirPath = path.dirname(resourcePath);
        let html = fs.readFileSync(resourcePath, 'UTF-8');
        // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
        html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
            return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
        });
        return html;
    }
    /**
     * 
     * @param htmlPath 
     * @param title 
     * @param showOptions 
     * @param newPanel 是否打开新的窗口
     */
    protected createWebview(
        htmlPath: string,
        title: string,
        showOptions: vscode.ViewColumn | { viewColumn: vscode.ViewColumn, preserveFocus?: boolean },
        newPanel?: boolean
        ): void {
        const has: boolean = WebviewContainer.has(htmlPath)
        if (has) {
            const column = vscode.window.activeTextEditor
                ? vscode.window.activeTextEditor.viewColumn
                : undefined;
            const panel = WebviewContainer.get(htmlPath)
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
            if (!newPanel) {
                WebviewContainer.set(htmlPath, this.panel)
            }
        }

        if (this.panel) {
            this.panel.onDidDispose(() => {
                WebviewContainer.delete(htmlPath);
            });
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
            WebviewContainer.delete(htmlPath);
        }
    }
}
class WebviewContainer {
    private static webviewMap: Map<string, vscode.WebviewPanel> = new Map();
    public static has(key: string) {
        return this.webviewMap.has(key);
    }
    public static set(key: string, panel: vscode.WebviewPanel) {
        this.webviewMap.set(key, panel);
    }
    public static get(key: string): vscode.WebviewPanel | undefined {
        return this.webviewMap.get(key);
    }
    public static delete(key: string) {
        this.webviewMap.delete(key);
    }
}