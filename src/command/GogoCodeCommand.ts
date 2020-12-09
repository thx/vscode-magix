import * as vscode from 'vscode';
import { Command } from '../common/constant/Command';
import { ConfigurationUtils } from '../common/utils/ConfigurationUtils';
import { WebViewCommandArgument, WebviewType } from './CommandArgument';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

/**
 * 通过执行 gogocode 项目js文件进行文件转换
 */
export class GogoCodeCommand {
    public registerCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_GOGOCODE, (args) => {
            const gogoCodePath = ConfigurationUtils.getGogoCodePath();
            if (!gogoCodePath) {
                vscode.window.showErrorMessage('请设置gogocode路径');
                this.openSettingWebView();
                return;
            }
            const jsPath = path.join(gogoCodePath, 'test/vscode.js');
            if (!fs.existsSync(jsPath)) {
                this.openSettingWebView();
                vscode.window.showErrorMessage(`gogocode执行文件不存在:${jsPath}`);
                return;
            }
            const codePath = args.path;
            if (!codePath.includes('/src/app')) {
                vscode.window.showErrorMessage(`不是src/app路径中文件`);
                return;
            }
            const srcIndex = codePath.lastIndexOf('/src/app');
            const dotIndex = codePath.lastIndexOf('.');
            const arg = codePath.substring(srcIndex + 5, dotIndex);
            const type = codePath.includes('subway/src') ? 'subway' : 'xiapin';
            try {
                exec(`node ./test/vscode.js ${type} ${arg}`, { cwd: gogoCodePath }, function (error: any, stdout: string, stderr: string) {
                    if (error) {
                        vscode.window.showErrorMessage(error.toString());
                    }
                    if (stderr) {
                        vscode.window.showErrorMessage(stderr);
                    }
                    if (stdout) {
                        const opts: vscode.TextDocumentShowOptions = {
                            viewColumn: vscode.ViewColumn.Active
                        };
                        const oPath = codePath.substring(0, dotIndex);
                        const ext = path.extname(codePath);

                        if (ext === '.html' || ext === '.tpl') {
                            let jtePath = oPath + '.ts';
                            if (!fs.existsSync(jtePath)) {
                                jtePath = oPath + '.js'
                                if (!fs.existsSync(jtePath)) {
                                    jtePath = oPath + '.es'
                                    if (!fs.existsSync(jtePath)) {
                                        {
                                            jtePath = ''
                                        }
                                    }
                                }
                            }
                            if (!jtePath) {
                                vscode.window.showErrorMessage('对应的.ts/.es/.js文件不存在')
                            } else {
                                const tsOutPath = jtePath.substring(0, jtePath.lastIndexOf('.')) + '-output.ts';
                                vscode.commands.executeCommand('vscode.diff',
                                    vscode.Uri.parse(jtePath),
                                    vscode.Uri.parse(tsOutPath),
                                    jtePath.substring(srcIndex, jtePath.length) + ' VS ' +
                                    tsOutPath.substring(srcIndex, tsOutPath.length),
                                    opts
                                );
                            }
                            const htmlOutPath = oPath + '-output.html';
                            vscode.commands.executeCommand('vscode.diff',
                                vscode.Uri.parse(codePath),
                                vscode.Uri.parse(htmlOutPath),
                                codePath.substring(srcIndex, codePath.length) + ' VS ' +
                                htmlOutPath.substring(srcIndex, htmlOutPath.length),
                                opts
                            );

                        }
                        else if (['.ts', '.js', '.es'].indexOf(ext) > -1) {
                            let htPath = oPath + '.html';
                            if (!fs.existsSync(htPath)) {
                                htPath = oPath + '.tpl';
                                if (!fs.existsSync(htPath)) {
                                    htPath = '';
                                }
                            }
                            if (!htPath) {
                                vscode.window.showErrorMessage('对应的.html/.tpl 文件不存在')
                            } else {
                                const htmlOutPath = oPath + '-output.html';
                                vscode.commands.executeCommand('vscode.diff',
                                    vscode.Uri.parse(htPath),
                                    vscode.Uri.parse(htmlOutPath),
                                    htPath.substring(srcIndex, htPath.length) + ' VS ' +
                                    htmlOutPath.substring(srcIndex, htmlOutPath.length),
                                    opts
                                );
                            }
                            const tsPath = oPath + '-output.ts';
                            vscode.commands.executeCommand('vscode.diff',
                                vscode.Uri.parse(codePath),
                                vscode.Uri.parse(tsPath),
                                codePath.substring(srcIndex, codePath.length) + ' VS ' +
                                tsPath.substring(srcIndex, tsPath.length),
                                opts
                            );
                        }
                    }
                });
            } catch (error) {
                vscode.window.showWarningMessage(error);
            }
        }));
    }
    private openSettingWebView() {
        let arg: WebViewCommandArgument = new WebViewCommandArgument();
        arg.webviewType = WebviewType.Setting;
        vscode.commands.executeCommand(Command.COMMAND_WEBVIEW_SHOW, arg);
    }

}
