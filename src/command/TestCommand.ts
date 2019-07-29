import * as vscode from 'vscode';
import { Command } from '../command';



export class TestCommand {
  registerCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_TEST, (args) => {
     vscode.window.showInformationMessage('test');
    }));
   
  }

}