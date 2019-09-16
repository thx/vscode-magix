import * as vscode from 'vscode';
import { Command } from '../common/constant/Command';



export class TestCommand {
  registerCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_TEST, (args) => {
     vscode.window.showInformationMessage('test');
    }));
   
  }

}