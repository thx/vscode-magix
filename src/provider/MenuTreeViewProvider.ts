
import * as vscode from 'vscode';
import { Command } from '../command';
import * as path from 'path';
import { WebPath,WebViewCommandArgument } from '../command/WebViewCommand';

export class MenuTreeViewProvider implements vscode.TreeDataProvider<number> {
  constructor(content: vscode.ExtensionContext) {
    this.context = content;
  }
  private context: vscode.ExtensionContext;
  private treeItems: Array<any> = [
    {
      label: '插件基本信息设置',
      viewColumn: vscode.ViewColumn.Active,
      webPath: WebPath.Welcome,
      icon: 'setting'
    },
    {
      label: 'StatusBar快捷方式设置',
      viewColumn: vscode.ViewColumn.Active,
      webPath: WebPath.StatusBarShortcut,
      icon: 'status-bar'
    },
    {
      label: '快速插入Gallery组件',
      viewColumn: vscode.ViewColumn.Active,
      webPath: WebPath.Gallery,
      icon: 'status-bar'
    },
    {
      label: '失效Rap引用扫描',
      viewColumn: vscode.ViewColumn.Active,
      webPath: WebPath.RapScan,
      icon: 'status-bar'
    }
  ];


  getTreeItem(offset: number): vscode.TreeItem {
    let item = this.treeItems[offset - 1];
    let treeItem: vscode.TreeItem = new vscode.TreeItem(item.label);
    treeItem.iconPath = this.getIcon(item.icon);

    let arg: WebViewCommandArgument = new WebViewCommandArgument();
    arg.title = item.label;
    arg.webPath = item.webPath;
    arg.viewColumn = item.viewColumn;

    treeItem.command = {
      command: Command.COMMAND_WEBVIEW_SHOW,
      title: '',
      arguments: [arg]
    };
    return treeItem;
  }
  getChildren(offset?: number): Thenable<number[]> {
    return Promise.resolve([1, 2, 3, 4]);
  }
  getIcon(type: string): any {
    return {
      light: this.context.asAbsolutePath(path.join('resources', 'light', type + '.svg')),
      dark: this.context.asAbsolutePath(path.join('resources', 'dark', type + '.svg'))
    };
  }
}