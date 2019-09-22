import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';


export class FileUtils {
  /**
     * 获取当前所在工程根目录，有3种使用方法：<br>
     * getProjectPath(uri) uri 表示工程内某个文件的路径<br>
     * getProjectPath(document) document 表示当前被打开的文件document对象<br>
     * getProjectPath() 会自动从 activeTextEditor 拿document对象，如果没有拿到则报错
     * @param {*} document 
     */
  static getProjectPath(document: vscode.TextDocument | undefined): string {
    if (!document && vscode.window.activeTextEditor) {
      document = vscode.window.activeTextEditor.document;
    }
    if (!document) {
      vscode.window.showErrorMessage('当前激活的编辑器不是文件或者没有文件被打开！');
      return '';
    }
    const currentFile = document.uri.fsPath;
    let projectPath = null;

    let workspaceFolders = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.map(item => item.uri.path) : [];
    // 由于存在Multi-root工作区，暂时没有特别好的判断方法，先这样粗暴判断
    // 如果发现只有一个根文件夹，读取其子文件夹作为 workspaceFolders
    if (workspaceFolders.length === 1 && workspaceFolders[0] === vscode.workspace.rootPath) {
      projectPath = vscode.workspace.rootPath;
    } else {
      workspaceFolders.forEach(folder => {
        if (currentFile.indexOf(folder) === 0) {
          projectPath = path.dirname(folder);
        }
      });
      if (!projectPath) {
        vscode.window.showErrorMessage('当前编辑页面不属于workspace中文件，请打开workspace中文件，然后重启vscode');
      }
    }
    if (!projectPath) {
      vscode.window.showErrorMessage('获取工程根路径异常！');
      return '';
    }
    return projectPath;
  }
  /**
    * 获取当前工程名
    */
  static getProjectName(projectPath: string): string {
    return path.basename(projectPath);
  }
  /**
     * 将一个单词首字母大写并返回
     * @param {*} word 某个字符串
     */
  static upperFirstLetter(word: string): string {
    return (word || '').replace(/^\w/, m => m.toUpperCase());
  }
  /**
   * 将一个单词首字母转小写并返回
   * @param {*} word 某个字符串
   */
  static lowerFirstLeter(word: string): string {
    return (word || '').replace(/^\w/, m => m.toLowerCase());
  }

  /**
   * 递归创建目录 同步方法  
   * @param dirname  
   */
  static mkDirsSync(dirname: string) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (FileUtils.mkDirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }
  /**
     * 列出项目所有文件
     * @param rootPath 
     * @param fileList 
     */
  public static listFiles(rootPath: string): Array<string> {
    let fileList: Array<string> = [];
    this.getFiles(rootPath, fileList);
    return fileList;
  }

  private static getFiles(parentPath: string, fileList: Array<string>) {
    let files = fs.readdirSync(parentPath);
    if (parentPath.indexOf('/.') > -1 || parentPath.indexOf('node_modules') > -1) {
      return;
    }

    files.forEach((item) => {
      item = path.join(parentPath, item);
      let stat = fs.statSync(item);
      try {
        if (stat.isDirectory()) {
          this.getFiles(item, fileList);
        }
        else if (stat.isFile()) {
          fileList.push(item);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
}