import * as vscode from 'vscode';
import { BaseView } from './BaseView';
import { WebCommand } from '../common/constant/WebCommand';

export class RapScanWebview extends BaseView {
    public show() {
        let path = './web/rap-scan.html';
        let title = '无效Rap引用扫描';
        this.createWebview(path, title, vscode.ViewColumn.Active);
        this.onDidReceiveMessage((e) => {
            if (e.type === WebCommand.SAVE_NICKNAME) {
                this.saveNickname(e.nickName);
               this.dispose();
            } else if (e.type === WebCommand.GET_NICKNAME) {
                let nickname = this.getNickname();
                this.postMessage(WebCommand.GET_NICKNAME, { nickname });
            }
        });

    }
    private saveNickname(nickName: string): void {
        vscode.workspace.getConfiguration().update('magix.conf.user.nickname', nickName, true);
    }
    private getNickname(): string | null | undefined {
        return vscode.workspace.getConfiguration().get('magix.conf.user.nickname');
    }

}