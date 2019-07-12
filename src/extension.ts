'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Initializer } from './initializer';
import { Command } from './command';
import { ToDefinitionCommand } from './command/ToDefinitionCommand';
import { DiamondCommand } from './command/DiamondCommand';
import { TestCommand } from './command/TestCommand';
import { MXDefinitionProvider, MXInnerDefinitionProvider, HtmlDefinitionProvider } from './provider/VSDefinitionProvider';
import { MXEventCompletionItemProvider } from './provider/VSCompletionItemProvider';
import { VSFoldingRangeProvider } from './provider/VSFoldingRangeProvider';
import { VSHoverProvider } from './provider/VSHoverProvider';

import { ConfigManager } from './utils/ConfigManager';
import { Logger } from './utils/Logger';



export function activate(context: vscode.ExtensionContext) {
    

    let startTime: number = new Date().getTime();
    //初始化期，初始化基本数据
    new Initializer().init().then(() => {
        //注册跳转到定义command
        let command: ToDefinitionCommand = new ToDefinitionCommand();
        command.registerCommand(context);

        let diamondCommand: DiamondCommand = new DiamondCommand();
        diamondCommand.registerCommand(context);

        let testCommand: TestCommand = new TestCommand();
        testCommand.registerCommand(context);

        //注册es代码跳转command
        const JTS_MODE = [{ language: 'javascript', scheme: 'file' }, { language: 'typescript', scheme: 'file' }];
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(JTS_MODE, new MXDefinitionProvider()));
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(JTS_MODE, new MXInnerDefinitionProvider()));
        //注册html代码跳转
        const HTML_MODE = [{ language: 'html', scheme: 'file' }, { language: 'handlebars', scheme: 'file' }];
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(HTML_MODE, new HtmlDefinitionProvider()));
        //注册代码提示
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider(HTML_MODE, new MXEventCompletionItemProvider(), '=', '\'', '"'));

        context.subscriptions.push(vscode.languages.registerFoldingRangeProvider(HTML_MODE,new VSFoldingRangeProvider()));
        //注册悬浮提示Provider
        context.subscriptions.push(vscode.languages.registerHoverProvider(HTML_MODE,new VSHoverProvider()));

        initViews();

        Logger.logActivate(new Date().getTime() - startTime, '');
        Logger.log('插件启动成功');
    }).catch((info) => {
        Logger.logActivate(new Date().getTime() - startTime, info);
        Logger.error(info);
    });



}

export function deactivate() {
    console.info('插件不活动啦。。。。deactivate');
    Logger.logDeactivate();
}

function initViews() {

    let config: any = ConfigManager.read();

    createStatusBar('日常',config.diamond.daily.appName,Command.COMMAND_DIAMOND_OPEN_DAILY);

    createStatusBar('预发',config.diamond.pre.appName,Command.COMMAND_DIAMOND_OPEN_PRE);

    createStatusBar('Diamond配置','Diamond配置',Command.COMMAND_DIAMOND_CONFIG);

}

function createStatusBar(text:string,tooltip:string,command:string){
    let status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    status.text = text;
    status.tooltip = '';
    status.show();
    status.command = command;
}
