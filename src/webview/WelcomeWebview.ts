import * as vscode from 'vscode';
import { BaseView } from './BaseView';
import { WebCommand } from '../common/constant/WebCommand';
import { ConfigurationUtils } from '../common/utils/ConfigurationUtils';

export class WelcomeWebview extends BaseView {
    public show() {
        let path = './web/welcome.html';
        let title = 'Magix VSCode 插件';
        this.createWebview(path, title, vscode.ViewColumn.Active);
        this.onDidReceiveMessage((e) => {
            if (e.type === WebCommand.SAVE_NICKNAME) {
                ConfigurationUtils.saveNickname(e.data.nickname);
                this.dispose();
            } 
        });

    }
  

}