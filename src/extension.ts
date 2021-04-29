
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


export function activate(context: vscode.ExtensionContext) {
	let startTime: number = new Date().getTime();
    const subscriptions = context.subscriptions;
    
    //初始化期，初始化基本数据
    new Initializer().init().then(() => {
        //注册command
        new ToDefinitionCommand().registerCommand(context);
        new WebViewCommand().registerCommand(context);
        new GogoCodeCommand().registerCommand(context);
        new PathCopyCommand().registerCommand(context);
        new MxTableConvertCommand().registerCommand(context);
        // 
        const JTS_MODE = [{ language: 'javascript', scheme: 'file' }, { language: 'typescript', scheme: 'file' }];
        const HTML_MODE = [{ language: 'html', scheme: 'file' }, { language: 'handlebars', scheme: 'file' }];
        const CSS_MODE = [{ language: 'css', scheme: 'file' }, { language: 'less', scheme: 'file' }];
        const JTS_HTML_MODE = JTS_MODE.concat(HTML_MODE);
        const JTS_HTML_CSS_MODE = JTS_HTML_MODE.concat(CSS_MODE);
       

        subscriptions.push(vscode.languages.registerDefinitionProvider(JTS_MODE, new MXDefinitionProvider()));
        subscriptions.push(vscode.languages.registerDefinitionProvider(JTS_MODE, new MXInnerDefinitionProvider()));
        
        //注册html代码跳转
        subscriptions.push(vscode.languages.registerDefinitionProvider(HTML_MODE, new HtmlDefinitionProvider()));
        
        //注册代码提示
        subscriptions.push(vscode.languages.registerCompletionItemProvider(HTML_MODE, new MXEventCompletionItemProvider(), '=', '\'', '"'));
        subscriptions.push(vscode.languages.registerCompletionItemProvider(HTML_MODE, new IconfontCompletionItemProvider(), '&'));
        subscriptions.push(vscode.languages.registerFoldingRangeProvider(HTML_MODE, new VSFoldingRangeProvider()));
        
        //注册悬浮提示Provider
        subscriptions.push(vscode.languages.registerHoverProvider(JTS_HTML_MODE, new IconfontHoverProvider()));
        subscriptions.push(vscode.languages.registerHoverProvider(JTS_MODE, new RapHoverProvider()));
        subscriptions.push(vscode.languages.registerHoverProvider(HTML_MODE, new GalleryHoverProvider()));
        subscriptions.push(vscode.languages.registerHoverProvider(JTS_HTML_CSS_MODE, new ImageHoverProvider()));

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
    recoverBesideEditor()
    Logger.logDeactivate();
}
function recoverBesideEditor(){
    // 回收打开的侧边 编辑器
   const editors = vscode.window.visibleTextEditors;
   editors.forEach((item:vscode.TextEditor)=>{
      let vc:vscode.ViewColumn | undefined = item.viewColumn 
      if(vc && vc === vscode.ViewColumn.Beside){
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


