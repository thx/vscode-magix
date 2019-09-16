import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { HtmlESMappingCache } from '../utils/CacheUtils';
import {Command} from '../common/constant/Command';

export class ToDefinitionCommand {
  
  /**
     * 注册command
     * @param context 
     */
  public registerCommand(context: vscode.ExtensionContext) {


    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_JUMP_TO_HTML, (args) => {
      this.jumpBackAndForth(args.path);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_JUMP_TO_JTS, (args) => {
      this.jumpBackAndForth(args.path);
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_JUMP_BACK_AND_FORTH, (args) => {
      try {
        let filePath: string = '';
        if (args && args.path) {
          filePath = args.path;
        } else {
          let editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor
          if (editor) {
            filePath = editor.document.fileName;
          }
        }
        if (filePath !== '') {
          this.jumpBackAndForth(filePath);
        }

      } catch (error) {
        console.error(error);
      }

    }));
  }

  private jumpBackAndForth(filePath: string) {
    let extName: string = path.extname(filePath);

    if (extName === '.ts' || extName === '.js' || extName === '.es') {
      let htmlFilePath: any = HtmlESMappingCache.getHtmlFilePath(filePath);
      if (htmlFilePath) {
        this.tryShowEditor(htmlFilePath);
      }
    } else if (extName === '.html') {
      let esFilePath: any = HtmlESMappingCache.getEsFilePath(filePath);
      if (esFilePath) {
        this.tryShowEditor(esFilePath);
      }
    }
  }

  private tryShowEditor(filePath: string): boolean {
    if (fs.existsSync(filePath)) {
      vscode.window.showTextDocument(vscode.Uri.file(filePath));
      return true;
    }
    return false;
  }
}
