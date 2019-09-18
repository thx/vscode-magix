import * as vscode from 'vscode';
import { BaseView } from './BaseView';
import { WebCommand } from '../common/constant/WebCommand';

export class SettingWebview extends BaseView {
    public show() {
        let path = './web/setting.html';
        let title = 'Magix VSCode 插件设置';
        this.createWebview(path, title, vscode.ViewColumn.Active);
        this.onDidReceiveMessage((e) => {
            if (e.type === WebCommand.SAVE_NICKNAME) {
                this.saveNickName(e.data.nickName);
                this.dispose();
            } else if (e.type === WebCommand.GET_NICKNAME) {
                let nickName = this.getNickName();
                this.postMessage(WebCommand.GET_NICKNAME, { nickName });
            }
        });
       
    }
    private saveNickName(nickName: string): void {
        vscode.workspace.getConfiguration().update('magix.conf.user.nikeName', nickName, true);
    }
    private getNickName(): string | null | undefined {
        return vscode.workspace.getConfiguration().get('magix.conf.user.nikeName');
    }

}