
import * as vscode from 'vscode';
import { DynamicCommand } from '../../command/DynamicCommand';
import { ShortcutItem } from '../../model/ShortcutInfo';
export class StatusBarManager {
    private static context: vscode.ExtensionContext;
    private static container: Map<string, vscode.StatusBarItem> = new Map();
    public static init(context: vscode.ExtensionContext){
        this.context = context;
    }
    public static dispose(){
        this.container.clear();
    }
    public static createOpenBrowserStatusBar(text: string, url: string) {
        let status: vscode.StatusBarItem | undefined;
        
        if (this.container.has(url)) {
            status = this.container.get(url);
        } else {
            if (!this.context) {
                throw new Error('使用 StatusBarManager 请先调用init 方法');
            }
            status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
            let command = DynamicCommand.registerOpenBrowserCommand(url, this.context);
            status.command = command;
            this.container.set(url, status);
        }
        if (status) {
            status.text = text;
            status.show();
        }
    }
    public static refreshStatusBars(items: Array<ShortcutItem>) {
        //  先把所有的StatusBar隐藏
        this.container.forEach((item: vscode.StatusBarItem) => {
            if (item) {
                item.hide();
            }
        });
        items.forEach((item:ShortcutItem)=>{
            if (this.container.has(item.url)) {
                const status = this.container.get(item.url);
                if (status) {
                    status.text = item.name;
                    status.show();
                }
            } else {
                const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
                let command = DynamicCommand.registerOpenBrowserCommand(item.url, this.context);
                status.command = command;
                status.text = item.name;
                status.show();
                this.container.set(item.url, status);
            }
        });
    }
}