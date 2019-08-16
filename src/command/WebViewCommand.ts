import * as vscode from 'vscode';
import { MXWebView } from '../utils/WebViewUtils';
import {Command} from '../command';


export class WebViewCommand{
    /**
     * 注册command
     * @param context 
     */
  public registerCommand(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_WEBVIEW_SHOW, (args) => {
        let panel: vscode.WebviewPanel = MXWebView.openWebView(context, './web/status-bar.html', 'StatusBar快捷方式配置');
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