
import * as vscode from 'vscode';
export class Command {
 
  public static COMMAND_JUMP_TO_HTML: string = "mx.jumper.toHtml";
  public static COMMAND_JUMP_TO_JTS: string = "mx.jumper.toES";
  public static COMMAND_JUMP_TO_RAP: string = "mx.jumper.toRap";
  public static COMMAND_JUMP_BACK_AND_FORTH: string = "mx.jumper.backAndForth";
  public static COMMAND_CODE_TO_REACT: string = "mx.code.toReact";
  public static COMMAND_DIAMOND_OPEN_DAILY: string = "mx.diamond.open.daily";
  public static COMMAND_DIAMOND_OPEN_PRE: string = "mx.diamond.open.pre";
  public static COMMAND_DIAMOND_CONFIG: string = "mx.diamond.config";
  public static COMMAND_WEBVIEW_SHOW:string="mx.webview.show";
  public static COMMAND_TEST:string = "mx.test";
  public static COMMAND_DYNAMIC:string = 'mx.dynamic.';
  public static COMMAND_GOGOCODE:string = 'mx.gogocode';
  public static COMMAND_COPY_MAGIX_PATH:string = 'mx.copy.magix.path';
}

export enum BuiltInCommand {
	CloseActiveEditor = 'workbench.action.closeActiveEditor',
	CloseAllEditors = 'workbench.action.closeAllEditors',
	CursorMove = 'cursorMove',
	Diff = 'vscode.diff',
	EditorScroll = 'editorScroll',
	ExecuteDocumentSymbolProvider = 'vscode.executeDocumentSymbolProvider',
	ExecuteCodeLensProvider = 'vscode.executeCodeLensProvider',
	FocusFilesExplorer = 'workbench.files.action.focusFilesExplorer',
	Open = 'vscode.open',
	OpenFolder = 'vscode.openFolder',
	OpenInTerminal = 'openInTerminal',
	NextEditor = 'workbench.action.nextEditor',
	PreviewHtml = 'vscode.previewHtml',
	RevealLine = 'revealLine',
	SetContext = 'setContext',
	ShowExplorerActivity = 'workbench.view.explorer',
	ShowReferences = 'editor.action.showReferences',
}

export enum ContextKeys {
  IsMagix = 'vs-magix:isMagix',
  ShowGogoCode = 'vs-magix:showGogoCode',
  // 暂时不展示
  ShowToReact = 'vs-magix:showToReact',
}

export function setContext(key: ContextKeys | string, value: any) {
	return vscode.commands.executeCommand(BuiltInCommand.SetContext, key, value);
}




