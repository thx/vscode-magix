import * as vscode from 'vscode';
import { BaseView } from './BaseView';
import { WebCommand } from '../common/constant/WebCommand';

export class RapScanWebview extends BaseView {
    public show() {
        let path = './web/rap-scan.html';
        let title = '无效Rap引用扫描';
        this.createWebview(path, title, vscode.ViewColumn.Active);
        this.onDidReceiveMessage((e) => {
           
        });

    }
   

}