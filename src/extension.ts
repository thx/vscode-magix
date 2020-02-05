'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Initializer } from './initializer';
import { Command } from './common/constant/Command';
import { ToDefinitionCommand } from './command/ToDefinitionCommand';
import { MXDefinitionProvider, MXInnerDefinitionProvider, HtmlDefinitionProvider } from './provider/VSDefinitionProvider';
import { MXEventCompletionItemProvider } from './provider/VSCompletionItemProvider';
import { VSFoldingRangeProvider } from './provider/VSFoldingRangeProvider';
import { IconfontHoverProvider } from './provider/IconfontHoverProvider';
import {RapHoverProvider} from './provider/RapHoverProvider';
import { MenuTreeViewProvider } from './provider/MenuTreeViewProvider';
import { Logger } from './common/utils/Logger';
import { WebViewCommand } from './command/WebViewCommand';
import { WebViewCommandArgument, WebviewType } from './command/CommandArgument';
import { ConfigurationUtils } from './common/utils/ConfigurationUtils';
import { Fether } from './net/Fether';

import { ProjectInfoUtils, Info } from './common/utils/ProjectInfoUtils';
import { IconfontCompletionItemProvider } from './provider/IconfontCompletionItemProvider';
import { StatusBarManager } from './common/utils/StatusBarManager';


export function activate(context: vscode.ExtensionContext) {

    let startTime: number = new Date().getTime();
    //初始化期，初始化基本数据
    new Initializer().init().then(() => {
        //注册command
        new ToDefinitionCommand().registerCommand(context);
        new WebViewCommand().registerCommand(context);

        const JTS_MODE = [{ language: 'javascript', scheme: 'file' }, { language: 'typescript', scheme: 'file' }];
        const HTML_MODE = [{ language: 'html', scheme: 'file' }, { language: 'handlebars', scheme: 'file' }];
        const JTS_HTML_MODE = JTS_MODE.concat(HTML_MODE);
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(JTS_MODE, new MXDefinitionProvider()));
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(JTS_MODE, new MXInnerDefinitionProvider()));
        //注册html代码跳转
       
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(HTML_MODE, new HtmlDefinitionProvider()));
        //注册代码提示
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider(HTML_MODE, new MXEventCompletionItemProvider(), '=', '\'', '"'));
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider(HTML_MODE,new IconfontCompletionItemProvider(), '&'));
        context.subscriptions.push(vscode.languages.registerFoldingRangeProvider(HTML_MODE, new VSFoldingRangeProvider()));
        //注册悬浮提示Provider
        context.subscriptions.push(vscode.languages.registerHoverProvider(JTS_HTML_MODE, new IconfontHoverProvider()));
        context.subscriptions.push(vscode.languages.registerHoverProvider(JTS_MODE, new RapHoverProvider()));

        initViews(context);

        Logger.logActivate(new Date().getTime() - startTime, '');
        Logger.log('插件启动成功');
    }).catch((info) => {
        Logger.logActivate(new Date().getTime() - startTime, info);
        Logger.error(info);
    });
}

export function deactivate() {
    //销毁 StatusBarManager
    StatusBarManager.dispose();
    console.info('插件不活动啦。。。。deactivate');
    Logger.logDeactivate();
}

function initViews(context: vscode.ExtensionContext) {
    let nickname = ConfigurationUtils.getNickname();
    //没有设置nickname，显示欢迎页面

    if (nickname) {
        initStatusBar(nickname, context);
    } else {
        let arg: WebViewCommandArgument = new WebViewCommandArgument();
        arg.webviewType = WebviewType.Welcome;
        vscode.commands.executeCommand(Command.COMMAND_WEBVIEW_SHOW, arg);
    }

    //初始化Menu View
    let menuTreeViewProvider: MenuTreeViewProvider = new MenuTreeViewProvider(context);
    vscode.window.registerTreeDataProvider('magix-menu-view', menuTreeViewProvider);

}
function initStatusBar(nickname: string, context: vscode.ExtensionContext) {
    let info: Info = ProjectInfoUtils.getInfo();
    let projectName = info ? info.name : '';
    StatusBarManager.init(context);
    Fether.getShortcut(nickname,projectName).then((arr) => {
        let data = arr.length === 0 ? { nickname, list: [] } : arr[0];
        if (data && data.list) {
            data.list.forEach((item: any) => {
                StatusBarManager.createOpenBrowserStatusBar(item.name, item.url);
            });
        }
    }).catch((msg) => {
        console.error(msg);
    });
}

