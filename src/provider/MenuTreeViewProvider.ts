
import * as vscode from 'vscode';
import { Command } from '../common/constant/Command';
import * as path from 'path';
import { WebViewCommandArgument, WebviewType } from '../command/CommandArgument';

export class MenuTreeViewProvider implements vscode.TreeDataProvider<number> {
  constructor(content: vscode.ExtensionContext) {
    this.context = content;
  }
  private context: vscode.ExtensionContext;
  private treeItems: Array<any> = [
    {
      label: '插件基本信息设置',
      webviewType: WebviewType.Setting,
      icon: 'setting'
    },
    {
      label: 'StatusBar快捷方式设置',
      webviewType: WebviewType.StatusBarShortcut,
      icon: 'status-bar'
    },
    // {
    //   label: '快速插入Gallery组件',
    //   webviewType: WebviewType.Gallery,
    //   icon: 'status-bar'
    // },
    {
      label: '无效Rap引用扫描',
      webviewType: WebviewType.RapScan,
      icon: 'rap-scan'
    }
  ];


  getTreeItem(offset: number): vscode.TreeItem {
    let item = this.treeItems[offset - 1];
    let treeItem: vscode.TreeItem = new vscode.TreeItem(item.label);
    treeItem.iconPath = this.getIcon(item.icon);

    let arg: WebViewCommandArgument = new WebViewCommandArgument();
 
    arg.webviewType = item.webviewType;

    treeItem.command = {
      command: Command.COMMAND_WEBVIEW_SHOW,
      title: '',
      arguments: [arg]
    };
    return treeItem;
  }
  getChildren(offset?: number): Thenable<number[]> {
    return Promise.resolve([1, 2, 3]);
  }

  getIcon(type: string): any {
    return {
      light: this.context.asAbsolutePath(path.join('resources', 'light', type + '.svg')),
      dark: this.context.asAbsolutePath(path.join('resources', 'dark', type + '.svg'))
    };
  }
}