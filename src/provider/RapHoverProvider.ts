import * as vscode from 'vscode';
import { RapModelUtils, Model, ModelItem } from '../common/utils/RapModelUtils';


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
    hover.contents = this.buildMarkdownStringList(item, model);
    return hover;
  }

  private buildMarkdownStringList(item: ModelItem, model: Model) {
    let request = this.buildLines(item.properties, 0, -1, 'request');
    let response = this.buildLines(item.properties, 0, -1, 'response');
    let url: string = 'https://rap2.alibaba-inc.com/repository/editor?id=' +
      model.projectId +
      '&mod=' + item.moduleId +
      '&itf=' + item.id;
    return [
      new vscode.MarkdownString(`#### ${item.moduleName} - ${item.name}   [Rap2链接](${url})`),
      new vscode.MarkdownString(`#### 请求`),
      new vscode.MarkdownString(`| 名称 |  类型  | 简介 | 
      |----------|:-------------:|:------|
      ${request}`),
      new vscode.MarkdownString(`#### 返回`),
      new vscode.MarkdownString(`| 名称 |  类型  | 简介 | 
      |----------|:-------------:|:------|
      ${response}`),
    ];
  }
  private buildLines(properties: Array<any>, level: number, pid: number, type: string) {
    let text = '';
    properties.forEach(item => {
      if (item.scope === type && item.parentId === pid) {
        text = text + ' | ';
        for (let index = 0; index < level; index++) {
          text = text + ' - ';
        }
        text = text + item.name + ' | ' + item.type + ' | ' + item.description + ' | \r';
        text = text + this.buildLines(properties, level + 1, item.id, type);
      }
    });
    return text;
  }

}