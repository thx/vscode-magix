import * as vscode from 'vscode';
import { Cache } from '../common/utils/CacheUtils';
import { ESFileInfo } from '../model/ESFileInfo';
import { ESFileAnalyzer } from '../common/analyzer/ESFileAnalyzer';
import * as fs from 'fs';
import { FnInfo } from '../model/FnInfo';

export class ESFileProvider {

  public static provideFileInfo(filePath: string, content: string): ESFileInfo | any {
    if (Cache.has(filePath)) {
      return Cache.get(filePath);
    }
    else {
      if (!content) {
        content = fs.readFileSync(filePath, 'UTF-8');
      }
      let info: ESFileInfo | null = ESFileAnalyzer.analyseESFile(content, filePath);
      if (info) {
        Cache.set(filePath, info);
      }
      return info;
    }
  }

  public static provideFnPosition(fnName: string | Array<string>, filePath: string, content: string): vscode.Position {

    let fileInfo: ESFileInfo = this.provideFileInfo(filePath, content);
    if (!fileInfo) {
      return new vscode.Position(0, 0);
    }
    let fnInfo: FnInfo | undefined;
    if (fnName instanceof Array) {
      let canBreak = false;
      let l: number = fileInfo.functions.length;
      for (let i = 0; i < l; i++) {
        let storedFn = fileInfo.functions[i];
        let storedFnName = storedFn.fnName;
        let storedMxFnName = storedFn.mxFnName;
        for (let j = 0; j < fnName.length; j++) {
          let searchName = fnName[j];
          if (searchName.indexOf('.') > -1) {
            let tempArr = searchName.split('.');
            let mxFnName = tempArr[0];
            if (mxFnName === storedMxFnName && searchName === storedFnName) {
              fnInfo = storedFn;
              canBreak = true;
              break;
            }
          } else {
            if (storedFnName === searchName) {
              fnInfo = storedFn;
              canBreak = true;
              break;
            }
          }
        }
        if (canBreak) {
          break;
        }
      }
    } else {
      fnInfo = fileInfo.functions.find(fn => {
        return fn.fnName === fnName;
      });
    }
    if (!fnInfo) {
      return new vscode.Position(0, 0);
    }
    return new vscode.Position(fnInfo.startLine, fnInfo.startColumn);
  }
}