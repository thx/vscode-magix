import * as vscode from 'vscode';
import { execSync } from 'child_process';
import { FileUtils } from '../common/utils/FileUtils';
import { Command } from '../common/constant/Command';
import * as fs from 'fs';

const opn = require('opn');
const reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;

export class ToGitCommand {
  
  /**
     * 注册command
     * @param context 
     */
  public registerCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_CODE_TO_GIT, (args) => {
      const filePath = args.fsPath;
      if (!filePath) {
        return;
      }
      const isDir = fs.statSync(filePath).isDirectory();
      const rootPath = FileUtils.getProjectPath();
      try {
        const repository = this.getRepository(rootPath);
        const branch = this.getBranch(rootPath);
        const relativePath = filePath.replace(rootPath, '');
        const url = `${repository}/${isDir ? 'tree' : 'blob'}/${branch}${relativePath}`;
        console.log(url);
        opn(url);
      } catch (error: any) {
        vscode.window.showErrorMessage(error.message);
      }
    }));
  }
  private getBranch(rootPath: string): string {
    const out = execSync(`git branch`, { cwd: rootPath }).toString();
    const list = out.split('\n');
    if (list.length === 0) {
      throw new Error('没有找到git branch 相关信息');
    }
    const currentBranch = list.find(item => item.indexOf('*') > -1);
    if (!currentBranch) {
      throw new Error('没有找到当前git 分支信息');
    }
    return currentBranch.replace('*', '').trim();
  }
  private getRepository(rootPath: string) : string{
    const out = execSync(`git remote -v`, { cwd: rootPath }).toString();
    const list = out.split('\n');
    if (list.length === 0) {
      throw new Error('没有找到git remote 相关信息');
    }
    let info = list.find(item => item.indexOf('(fetch)') > -1);
    if (!info) {
      info = list[0];
    }
    let start = info.indexOf('@') + 1;
    let end = info.lastIndexOf('.git');
    if (end > start) {
      const url = info.substring(start, end);
      //gitlab 地址有冒号，replace掉
      return `https://${url.replace(':', '/')}`;
    } else {
      throw new Error('获取git remote 信息失败');
    }
  }
}
