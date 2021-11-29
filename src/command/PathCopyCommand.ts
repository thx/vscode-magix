import * as vscode from 'vscode';
import * as path from 'path';
import { env } from 'vscode';
import { Command } from '../common/constant/Command';

/**
 * 复制命令
 */
export class PathCopyCommand {
    public registerCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_COPY_MAGIX_PATH, (args) => {
            const filePath = args.fsPath;
            if (!filePath) {
                return;
            }
            try {
                let startIndex, endIndex;
                startIndex = filePath.indexOf(`${path.sep}src${path.sep}`);
                endIndex = filePath.lastIndexOf('.');
                let txtToCopy = filePath;
                if (startIndex !== -1 && endIndex !== -1) {
                    txtToCopy = filePath.substring(startIndex + 5, endIndex);
                }
                //@ts-ignore
                env.clipboard.writeText(txtToCopy);
            } catch (err) {
                console.error(err);
            }

        }));
    }


}
