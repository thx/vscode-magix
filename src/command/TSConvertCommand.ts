import * as vscode from 'vscode';
import { Command } from '../common/constant/Command';
import * as fs from 'fs';
import * as path from 'path';
import * as $ from 'gogocode';
import * as glob from 'glob';

export class TSConvertCommand {
    public registerCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_CODE_TO_TS, (args) => {
            const filePath = args.path;
            if (!filePath) {
                return;
            }
            const isDir = fs.statSync(filePath).isDirectory();
            try {
                if (isDir) {
                    const files = glob.sync(`${filePath}/**/*.{t,j}s`);
                    files.forEach(file => {
                        this.convert(file);
                    });
                } else {
                    const ext = path.extname(filePath);
                    if (ext !== '.js' && ext !== '.ts') {
                        vscode.window.showErrorMessage('请选择js或者ts文件');
                        return;
                    }
                    this.convert(filePath);
                }
                vscode.window.showInformationMessage('转化成功');
            } catch (err) {
                vscode.window.showErrorMessage(filePath, err.message);
            }
        }));
    }
    private convert(filePath: string) {
        let content = fs.readFileSync(filePath).toString();
        content = content.replace(/import\s+(\w+)\s+=/g, 'const $1 =');
        const outPut = $(content)
            .replace('let $_$1 = require($_$2);', 'import $_$1 from $_$2;')
            .replace('const $_$1 = require($_$2);', 'import $_$1 from $_$2;')
            .replace('module.exports = $_$', 'export default $_$')
            .replace('export = $_$', 'export default $_$')
            .generate();
        fs.writeFileSync(filePath, outPut);

    }
}
