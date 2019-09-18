import * as vscode from 'vscode';
import { BaseView } from './BaseView';
import { WebCommand } from '../common/constant/WebCommand';

export class StatusBarShortcutWebview extends BaseView {
    public show() {
        let path = './web/status-bar-shortcut.html';
        let title = 'StatusBar快捷方式设置';
        this.createWebview(path, title, vscode.ViewColumn.Active);
        this.onDidReceiveMessage((e) => {
           
        });

    }
   

}