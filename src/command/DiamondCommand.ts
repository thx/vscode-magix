import * as vscode from 'vscode';
import { Command } from '../common/constant/Command';
const opn = require('opn');
import { ConfigManager } from '../utils/ConfigManager';


export class DiamondCommand {

  private readonly dailyUrl: string = 'http://diamond.alibaba.net/diamond-ops/static/pages/config/index.html';
  private readonly preUrl: string = 'http://diamond.alibaba-inc.com/diamond-ops/static/pages/config/index.html';

  registerCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_DIAMOND_OPEN_DAILY, (args) => {
      let config: any = ConfigManager.read();
      let daily = config.diamond.daily;
      this.openUrl(daily, this.dailyUrl, context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_DIAMOND_OPEN_PRE, (args) => {
      let config: any = ConfigManager.read();
      let pre = config.diamond.pre;
      this.openUrl(pre, this.preUrl, context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_DIAMOND_CONFIG,(args)=>{
      ConfigManager.openConfigPanel(context);
    }));
  }
  openUrl(diamondConfig: any, url: string, context: vscode.ExtensionContext) {
    //anuary 2019 (version 1.31) 打开浏览器可以使用vs自带方法了
    //await vscode.env.openExternal(vscode.Uri.parse("https://github.com/Microsoft/vscode/issues/66741"));
    if (diamondConfig.serverId && diamondConfig.appName) {
      opn(url + '?serverId=' + diamondConfig.serverId +
        '&dataId=' + diamondConfig.dataId +
        '&group=' + diamondConfig.group +
        '&appName=' + diamondConfig.appName
      );
    } else {
      vscode.window.showWarningMessage('没有配置diamond信息').then((value: any) => {
        ConfigManager.openConfigPanel(context);
      });
    }
  }
}
