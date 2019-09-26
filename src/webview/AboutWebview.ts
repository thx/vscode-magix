import * as vscode from 'vscode';
import { BaseView } from './BaseView';


export class AboutWebview extends BaseView {
    public show() {
        let path = './web/about.html';
        let title = '关于 Magix VSCode 插件';
        this.createWebview(path, title, vscode.ViewColumn.Active);
        this.onDidReceiveMessage((e) => {
           
        });

    }
  

}