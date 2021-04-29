import { FnInfo } from '../../model/FnInfo';
import { ESFileInfo } from '../../model/ESFileInfo';

import * as $ from 'gogocode';
/**
 * 分析js、ts文件
 */
export class ESFileAnalyzer {

  public static analyseESFile(content: string, filePath: string): ESFileInfo | null {
    try {
      const AST = $(content);
      // 找到 magix 关键代码

      const match: any = AST.find(`$_$1.extend($_$2)`).match;
      if (!match ||
        !match['2'] ||
        !match['2'].length ||
        !match['2'][0].node ||
        !match['2'][0].node.properties) {
        return null;
      }

      let isMagixPage = false;
      let methodList = new Array<FnInfo>();
      match['2'][0].node.properties.forEach((prop: any) => {
        if (prop.method || (prop.value && prop.value.type === 'FunctionExpression')) {
          let fnInfo: FnInfo = new FnInfo();
          fnInfo.fnName = prop.key.name || prop.key.value;
          fnInfo.startColumn = prop.loc.start.column;
          fnInfo.endColumn = prop.loc.end.column;
          fnInfo.startLine = prop.loc.start.line;
          fnInfo.endLine = prop.loc.end.line;
          methodList.push(fnInfo);
        } else if (prop.key && prop.key.name === 'tmpl') {
          isMagixPage = true;
        }
      });
      if (!isMagixPage) {
        return null;
      }
      let info: ESFileInfo = new ESFileInfo();
      info.functions = methodList;
      return info;
    } catch (error) {
      return null;
    }
  }
}