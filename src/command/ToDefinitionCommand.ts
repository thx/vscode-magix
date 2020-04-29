import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { HtmlESMappingCache } from '../common/utils/CacheUtils';
import { Command } from '../common/constant/Command';
import { RapModelUtils, Model, ModelItem } from '../common/utils/RapModelUtils';
import { ConfigurationUtils } from '../common/utils/ConfigurationUtils';
const opn = require('opn');

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

    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_JUMP_TO_RAP, () => {
      try {
        let rapType = ConfigurationUtils.getRapType();
        if (rapType === '0' || rapType === '2') {
          this.jumpToRap();
        }
      } catch (error) {
        //console.error(error);
      }
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_JUMP_BACK_AND_FORTH, (args) => {
      try {
        let filePath: string = '';
        if (args && args.path) {
          filePath = args.path;
        } else {
          let editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
          if (editor) {
            filePath = editor.document.fileName;
          }
        }
        if (filePath !== '') {
          this.jumpBackAndForth(filePath);
        }
      } catch (error) {
        //console.error(error);
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

  private jumpToRap() {
    let editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    let quotationReg = /[\'\"]+([^\'\"]*)[\'\"]+/g;
    let document = editor.document;

    let rapKey = document.getText(document.getWordRangeAtPosition(editor.selection.active, quotationReg));
    let key = rapKey.replace(/\'|\"+/g, '');

    if (key && key.indexOf("_") > -1) {
      let model: Model = RapModelUtils.getModel();
      if (!model) {
        return;
      }
      let find: ModelItem | undefined = model.list.find((m: ModelItem) => {
        return key === m.key;
      });
      if (!find) {
        return;
      }
      let url: string = 'https://rap2.alibaba-inc.com/repository/editor?id=' +
        model.projectId +
        '&mod=' + find.moduleId +
        '&itf=' + find.id;
      opn(url);
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
