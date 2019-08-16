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
        let panel: vscode.WebviewPanel = MXWebView.openWebView(context, './web/welcome.html', 'Magix插件配置');
        panel.webview.onDidReceiveMessage((e) => {
          if(e.type === 'save'){
            this.saveNickName(e.nickName);
            panel.dispose();
          }
        });
        
    }));
  }
  private saveNickName(nickName:string):void{
    vscode.workspace.getConfiguration().update('magix.conf.user.nikeName', nickName, true);
  }
}