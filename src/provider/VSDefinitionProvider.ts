import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ESFileProvider } from '../provider/ESFileProvider';
import { HtmlESMappingCache } from '../common/utils/CacheUtils';
import { RapModelUtils, Model, ModelItem } from '../common/utils/RapModelUtils';
import { ConfigurationUtils } from '../common/utils/ConfigurationUtils';
import { FileUtils } from '../common/utils/FileUtils';
const opn = require('opn');
/**
 * 跳段到定义
 */
export class MXDefinitionProvider implements vscode.DefinitionProvider {
  
  // 最后一次出发跳转，避免多次调用
  private lastTriggerTime: number = new Date().getTime();

  provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {

    const fileName = document.fileName;
    const workDir = path.dirname(fileName);
    let word = document.getText(document.getWordRangeAtPosition(position, new RegExp('\'(.*?)\'|\"(.*?)\"')));
    const line = document.lineAt(position);
    if (word === '') {
      word = document.getText(document.getWordRangeAtPosition(position, new RegExp('\.(.*?)\(')));
    }

    let text = line.text.replace(/\s+/g, '');
    if (text.indexOf('tmpl:') > -1) {
      let path = workDir + '/' + word.replace(/(^\'*)|(\'*$)/g, '').replace(/(^\"*)|(\"*$)/g, '').replace('@', '');
      return new vscode.Location(vscode.Uri.file(path), new vscode.Position(0, 0));
    }
    // less 或 css 样式 跳转
    if (word.indexOf('.less') > -1 || word.indexOf('.css') > -1) {
      let stylePath = word.replace('@', '').replace(/\'|\"+/g, '').replace('css!','');
      let currentPath = path.dirname(fileName);
      stylePath = path.join(currentPath, stylePath);
      return new vscode.Location(vscode.Uri.file(stylePath), new vscode.Position(0, 0));
    }

    let rapType = ConfigurationUtils.getRapType();
    //false 去掉跳转逻辑
    if (false || rapType === '0' || rapType === '1') {
      this.jumpToRap(word, position);
    }
  }

  private jumpToRap(rapKey: string, position: vscode.Position) {
   
    let key = rapKey.replace(/\'|\"+/g, '');
    if (key && key.indexOf("_") > -1) {
      let model: Model = RapModelUtils.getModel();
      if (model) {
        let find: ModelItem | undefined = model.list.find((m: ModelItem) => {
          return key === m.key;
        });
        if (find) {
          let time = new Date().getTime();
          //一秒之内只能触发一次
          if (time - this.lastTriggerTime > 1000) {
            this.lastTriggerTime = time;
            let url: string = 'https://rap2.alibaba-inc.com/repository/editor?id=' +
              model.projectId +
              '&mod=' + find.moduleId +
              '&itf=' + find.id;
            opn(url);
          }

        }
      }
    }
  }
}

/**
 * magix 内部函数跳转
 */
export class MXInnerDefinitionProvider implements vscode.DefinitionProvider {

  provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {

    const fileName = document.fileName;
    //const workDir = path.dirname(fileName);
    // const  word = document.getText(document.getWordRangeAtPosition(position, new RegExp('\.(\w*?)\(')));
    const line = document.lineAt(position);
    let beforeStr: string = line.text.substring(0, position.character);
    let afterStr: string = line.text.substring(position.character, line.text.length - 1);
    let startIndex: number = beforeStr.lastIndexOf('.');
    let endIndex: number = afterStr.indexOf('(');

    if (startIndex > -1 && endIndex > -1) {
      let fnName: string = beforeStr.substring(startIndex + 1, beforeStr.length) + afterStr.substring(0, endIndex);
      let position: vscode.Position = ESFileProvider.provideFnPosition(fnName, fileName, document.getText());
      if (position.line === 0 && position.character === 0) {
        return null;
      }
      return new vscode.Location(document.uri, position);
    }
  }
}
/**
 * html 页面跳转到定义功能
 */
export class HtmlDefinitionProvider implements vscode.DefinitionProvider {

  private mxReg = /mx-[a-z]+\s*=\s*\'(.*?)\'|mx-[a-z]+\s*=\s*\"(.*?)\"/;
  provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {

    const fileName = document.fileName;
    let word = document.getText(document.getWordRangeAtPosition(position, this.mxReg));

    let p: Promise<vscode.Location> = new Promise((resolve, reject) => {
      if (word.indexOf('mx-view') > -1) {
        const location: vscode.Location | undefined = this.jumpToMxView(word, fileName, document);
        location && resolve(location);
      } else {
        let mx = word.match(/mx-[a-z]+/);
        if (mx && mx.length > 0) {
          let mxMethod = mx[0].replace('mx-', '');
          let userMethod = word.replace(/mx-[a-z]+\s*=\s*\'|mx-[a-z]+\s*=\s*\"/, '');
          userMethod = userMethod.replace(/(\(.*?\)|\s*)(\'|\")/, '');
          let fnName: Array<string> = [userMethod, userMethod + '<' + mxMethod + '>', mxMethod + '.' + userMethod];
          //获取 html 对应的 es 文件地址
          let esFilePath: any = HtmlESMappingCache.getEsFilePath(fileName);
          if (esFilePath) {
            let position: vscode.Position = ESFileProvider.provideFnPosition(fnName, esFilePath, '');
            resolve(new vscode.Location(vscode.Uri.file(esFilePath), position));
          }else{
            reject();
          }
        }else{
          reject();
        }
      }
    });
    return p;

  }
  jumpToMxView(word: string, fileName: string, document: vscode.TextDocument) {
    let group = word.match(/[\'\"]+([^\'\"]*)[\'\"]+/g);
    if (group && group.length > 0) {
      let viewPath = group[0].replace('@', '').replace(/\'|\"+/g, '');
      let index = viewPath.indexOf('?');
      viewPath = index > -1 ? viewPath.substring(0, index) : viewPath;
      let currentPath = path.dirname(fileName);
      let filePath = path.join(currentPath, viewPath + '.html');
      // 相对路径
      if (fs.existsSync(filePath)) {
        return new vscode.Location(vscode.Uri.file(filePath), new vscode.Position(1, 1));
      } else {
        // 项目绝对路径
        let rootPath: string = FileUtils.getProjectPath(document);
        filePath = path.join(rootPath, 'src', viewPath + '.html');
        if (fs.existsSync(filePath)) {
          return new vscode.Location(vscode.Uri.file(filePath), new vscode.Position(1, 1));
        }
        return undefined;
      }
    } else {
      return undefined;
    }
  }
}
