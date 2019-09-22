import * as vscode from 'vscode';
import { Command } from '../common/constant/Command';
const opn = require('opn');

export class DynamicCommand {
    /**
     * 动态注册command
     * @param context 
     * @param url 
     */
    public static registerOpenBrowserCommand(url: string, context: vscode.ExtensionContext): string {
        let command = Command.COMMAND_DYNAMIC + new Date().getTime() + '.' + this.getRandomInt(999999999);
        context.subscriptions.push(vscode.commands.registerCommand(command, (args) => {
            try {
                //anuary 2019 (version 1.31) 打开浏览器可以使用vs自带方法了
                //await vscode.env.openExternal(vscode.Uri.parse("https://github.com/Microsoft/vscode/issues/66741"));
                opn(url);
            } catch (e) {
                console.error(e);
            }
        }));
        return command;
    }
    private static getRandomInt(max:number) {
        return Math.floor(Math.random() * Math.floor(max));
    }

}