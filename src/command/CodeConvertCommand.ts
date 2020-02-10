import * as vscode from 'vscode';
import { Command } from '../common/constant/Command';
import { BaseView } from '../webview/BaseView';
import { WelcomeWebview } from '../webview/WelcomeWebview';

export class CodeConvertCommand{
    public registerCommand(context: vscode.ExtensionContext) {

        context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_CODE_TO_REACT, (args) => {
            let webview: BaseView  = new WelcomeWebview(context);
            webview.show();
        }));
    }
}
