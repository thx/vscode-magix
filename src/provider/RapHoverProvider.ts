import * as vscode from 'vscode';
import { RapModelUtils, Model, ModelItem } from '../common/utils/RapModelUtils';
import { markdownTable } from 'markdown-table';

export class RapHoverProvider implements vscode.HoverProvider {

  provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
    const word = document.getText(document.getWordRangeAtPosition(position));
    let model: Model = RapModelUtils.getModel();
    if (!model) {
      return null;
    }
    let item: ModelItem | undefined = model.list.find(item => {
      return item.key === word.trim();
    });
    if (!item) {
      return null;
    }
    //console.log(item);
    let hover: vscode.Hover = new vscode.Hover(`${item.moduleName} - ${item.name}`);
    hover.contents = this.buildMarkdownStringList(item);
    return hover;
  }

  private buildMarkdownStringList(item: ModelItem) {
 
    let url: string = `https://rap2.alibaba-inc.com/repository/editor?id=${item.projectId}&mod=${item.moduleId}&itf=${item.id}`;
    url = encodeURI(url);
    return [
      new vscode.MarkdownString(`#### ${item.moduleName} - ${item.name}   [Rap2链接](${url})`),
      new vscode.MarkdownString(`#### 请求`),
      new vscode.MarkdownString(this.buildTable(item.properties, 0, -1, 'request')),
      new vscode.MarkdownString(`#### 返回`),
      new vscode.MarkdownString(this.buildTable(item.properties, 0, -1, 'response')),
    ];
  }
  private buildTable(properties: Array<any>, level: number, pid: number, type: string) {
    const data = [
      ['名称', '类型', '简介'],
      ...this.buildLines(properties, 0, -1, type)
    ];
    return markdownTable(data);
  }
  private buildLines(properties: Array<any>, level: number, pid: number, type: string, lines?: any[]) {
    if (!lines) {
      lines = [];
    }
    properties.forEach(item => {
      if (item.scope === type && item.parentId === pid) {
        let space = '';
        for (let index = 0; index < level; index++) {
            space = space + ' - ';
        }
        const line = [space + item.name, item.type, item.description];
        lines && lines.push(line);
        this.buildLines(properties, level + 1, item.id, type, lines);
      }
    });
    return lines;
  }

}