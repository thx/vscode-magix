import * as vscode from 'vscode';
import { MXWebView } from '../utils/WebViewUtils';
import {Command} from '../command';


export class ShowWelcomeCommand{
    /**
     * 注册command
     * @param context 
     */
  public registerCommand(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_WEB_SHOW_WELCOME, (args) => {
        let panel: vscode.WebviewPanel = MXWebView.openConfigPanel(context, './web/welcome/index.html', 'mx-plugin系统配置');
    }));

  }
}