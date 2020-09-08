import * as vscode from 'vscode';
import { Command } from '../common/constant/Command';


const exec = require('child_process').exec;

/**
 * 通过执行 gogocode 项目js文件进行文件转换
 */
export class GogoCodeCommand {
    public registerCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_GOGOCODE, (args) => {

            try {
                exec(`node /Users/fuyingjun/MyWork/web/gogocode/test/test.js ${args.path}`, function (error, stdout, stderr) {
                    if (error) {
                        console.error(error);
                    }
                    else {
                        console.log("success");
                    }
                });


            } catch (error) {

                vscode.window.showWarningMessage(error);
            }
        }));
    }

}
