
import * as vscode from 'vscode';
import { Initializer } from './initializer';
import { Command } from './common/constant/Command';
import { ToDefinitionCommand } from './command/ToDefinitionCommand';
import { MxTableConvertCommand } from './command/MxTableConvertCommand';
import { MXDefinitionProvider, MXInnerDefinitionProvider, HtmlDefinitionProvider } from './provider/VSDefinitionProvider';
import { MXEventCompletionItemProvider } from './provider/VSCompletionItemProvider';
import { VSFoldingRangeProvider } from './provider/VSFoldingRangeProvider';
import { IconfontHoverProvider } from './provider/IconfontHoverProvider';
import { RapHoverProvider } from './provider/RapHoverProvider';
import { MenuTreeViewProvider } from './provider/MenuTreeViewProvider';
import { Logger } from './common/utils/Logger';
import { WebViewCommand } from './command/WebViewCommand';
import { WebViewCommandArgument, WebviewType } from './command/CommandArgument';
import { ConfigurationUtils } from './common/utils/ConfigurationUtils';
import { Fether } from './net/Fether';
import { ProjectInfoUtils, Info } from './common/utils/ProjectInfoUtils';
import { IconfontCompletionItemProvider } from './provider/IconfontCompletionItemProvider';
import { StatusBarManager } from './common/utils/StatusBarManager';
import { GalleryHoverProvider } from './provider/GalleryHoverProvider';
import { ImageHoverProvider } from './provider/ImageHoverProvider';
import { GogoCodeCommand } from './command/GogoCodeCommand';
import { PathCopyCommand } from './command/PathCopyCommand';
import { TSConvertCommand } from './command/TSConvertCommand';
import {ToGitCommand} from './command/ToGitCommand';

const { languages: { registerHoverProvider, registerDefinitionProvider, registerCompletionItemProvider, registerFoldingRangeProvider } } = vscode;

const JTS_MODE = [{ language: 'javascript', scheme: 'file' }, { language: 'typescript', scheme: 'file' }];
const HTML_MODE = [{ language: 'html', scheme: 'file' }, { language: 'handlebars', scheme: 'file' }];
//const CSS_MODE = [{ language: 'css', scheme: 'file' }, { language: 'less', scheme: 'file' }];
const JTS_HTML_MODE = JTS_MODE.concat(HTML_MODE);
//const JTS_HTML_CSS_MODE = JTS_HTML_MODE.concat(CSS_MODE);

export function activate(context: vscode.ExtensionContext) {
    
    let startTime: number = new Date().getTime();
    const subscriptions = context.subscriptions;
    // 不需要判断是不是magix项目，只要是项目就能用这个功能
    subscriptions.push(registerHoverProvider('*', new ImageHoverProvider()));
    
    new Initializer().init().then(result => {
        
        if (!result) {
            Logger.logActivate(new Date().getTime() - startTime, 'simple use');
            Logger.log('magix 插件启动成功,只支持部分功能！');
            return;
        }
        try {

            new ToDefinitionCommand().registerCommand(context);
            new WebViewCommand().registerCommand(context);
            new GogoCodeCommand().registerCommand(context);
            new PathCopyCommand().registerCommand(context);
            new MxTableConvertCommand().registerCommand(context);
            //new TSConvertCommand().registerCommand(context);
            new ToGitCommand().registerCommand(context);

            subscriptions.push(registerDefinitionProvider(JTS_MODE, new MXDefinitionProvider()));
            subscriptions.push(registerDefinitionProvider(JTS_MODE, new MXInnerDefinitionProvider()));

            //注册html代码跳转
            subscriptions.push(registerDefinitionProvider(HTML_MODE, new HtmlDefinitionProvider()));

            //注册代码提示
            subscriptions.push(registerCompletionItemProvider(HTML_MODE, new MXEventCompletionItemProvider(), '=', '\'', '"'));
            subscriptions.push(registerCompletionItemProvider(HTML_MODE, new IconfontCompletionItemProvider(), '&'));
            subscriptions.push(registerFoldingRangeProvider(HTML_MODE, new VSFoldingRangeProvider()));

            //注册悬浮提示Provider
            subscriptions.push(registerHoverProvider(JTS_HTML_MODE, new IconfontHoverProvider()));
            subscriptions.push(registerHoverProvider(JTS_MODE, new RapHoverProvider()));
            subscriptions.push(registerHoverProvider(HTML_MODE, new GalleryHoverProvider()));

            initViews(context);

            Logger.logActivate(new Date().getTime() - startTime, '');
            Logger.log('magix 插件启动成功');
            
        } catch (error) {
            Logger.logActivate(new Date().getTime() - startTime, error.message);
            Logger.error(error.message);
        }
    }).catch((msg) => {
        Logger.logActivate(new Date().getTime() - startTime, msg);
    })
   
}

export function deactivate() {
    //销毁 StatusBarManager
    StatusBarManager.dispose();
    recoverBesideEditor()
    Logger.logDeactivate();
}
function recoverBesideEditor() {
    // 回收打开的侧边 编辑器
    const editors = vscode.window.visibleTextEditors;
    editors.forEach((item: vscode.TextEditor) => {
        let vc: vscode.ViewColumn | undefined = item.viewColumn
        if (vc && vc === vscode.ViewColumn.Beside) {
            item.hide()
        }
    })
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
    Fether.getShortcut(nickname, projectName).then((arr) => {
        let data = arr.length === 0 ? { nickname, list: [] } : arr[0];
        if (data && data.list) {
            data.list.forEach((item: any) => {
                StatusBarManager.createOpenBrowserStatusBar(item.name, item.url);
            });
        }
    }).catch((msg) => {
        //console.error(msg);
    });
}


