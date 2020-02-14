import * as vscode from 'vscode';
import { BaseView } from './BaseView';
import { WebCommand } from '../common/constant/WebCommand';

export class EditorWebview extends BaseView{
    public show(args: any) {
        let path = './web/editor.html';
        let title = 'React Code';
        this.createWebview(path, title, vscode.ViewColumn.Beside, true);
        this.onDidReceiveMessage((e) => {

        });
        if (args && args.code) {
            this.postMessage(WebCommand.OPEN_EDITOR, { ok: true, code: args.code });
        }
    }
}