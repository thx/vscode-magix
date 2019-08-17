import * as vscode from 'vscode';
import { MXWebView } from '../utils/WebViewUtils';
import { Command } from '../command';


export class WebViewCommand {
  /**
   * 注册command
   * @param context 
   */
  public registerCommand(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_WEBVIEW_SHOW, (args: WebViewCommandArgument) => {

      let panel: vscode.WebviewPanel = MXWebView.showWebView(context, args.webPath, args.title, args.viewColumn);

      panel.webview.onDidReceiveMessage((e) => {
        if (e.type === 'nike_name_save') {
          this.saveNickName(e.nickName);
          panel.dispose();
        }
      });

      if(args.webPath === WebPath.Setting){
        panel.webview.postMessage({type:'',data:''});
      }

    }));
  }
  private saveNickName(nickName: string): void {
    vscode.workspace.getConfiguration().update('magix.conf.user.nikeName', nickName, true);
  }
}
export class WebViewCommandArgument {
  public webPath: WebPath;
  public title: string;
  public viewColumn: vscode.ViewColumn;
  constructor() {
    this.webPath = WebPath.None;
    this.title = '';
    this.viewColumn = vscode.ViewColumn.Active;
  }
}
export enum WebPath {
  None = '',
  Setting='./web/setting',
  Welcome = './web/welcome.html',
  StatusBarShortcut = './web/status-bar-shortcut.html',
  Gallery = './web/gallery.html',
  RapScan = './web/rap-scan.html'
}