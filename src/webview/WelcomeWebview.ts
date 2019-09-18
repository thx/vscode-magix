import * as vscode from 'vscode';
import { BaseView } from './BaseView';
import { WebCommand } from '../common/constant/WebCommand';

export class WelcomeWebview extends BaseView {
    public show() {
        let path = './web/welcome.html';
        let title = 'Magix VSCode 插件';
        this.createWebview(path, title, vscode.ViewColumn.Active);
        this.onDidReceiveMessage((e) => {
            if (e.type === WebCommand.SAVE_NIKE_NAME) {
                this.saveNickName(e.data.nickName);
                this.dispose();
            } else if (e.type === WebCommand.GET_NIKE_NAME) {
                let nikeName = this.getNickName();
                this.postMessage(WebCommand.GET_NIKE_NAME, { nikeName });
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