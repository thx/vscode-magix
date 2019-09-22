import * as vscode from 'vscode';
import { BaseView } from './BaseView';
import { WebCommand } from '../common/constant/WebCommand';
import { ConfigurationUtils } from '../common/utils/ConfigurationUtils';

export class SettingWebview extends BaseView {
    public show() {
        let path = './web/setting.html';
        let title = 'Magix VSCode 插件设置';
        this.createWebview(path, title, vscode.ViewColumn.Active);
        this.onDidReceiveMessage((e) => {
            if (e.type === WebCommand.SAVE_NICKNAME) {
                ConfigurationUtils.saveNickname(e.data.nickname);
                this.postMessage(WebCommand.SAVE_NICKNAME,{});
            } else if (e.type === WebCommand.GET_NICKNAME) {
                let nickname = ConfigurationUtils.getNickname();
                this.postMessage(WebCommand.GET_NICKNAME, { nickname });
            } else if (e.type === WebCommand.CLOSE) {
                this.dispose();
            }
        });
       
    }
   

}