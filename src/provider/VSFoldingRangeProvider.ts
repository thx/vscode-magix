import * as vscode from 'vscode';

export class VSFoldingRangeProvider implements vscode.FoldingRangeProvider {
  provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.FoldingRange[]> {
    let regions: vscode.FoldingRange[] = [];
    
    let rangePairs: Array<TemplateRangePair> = [];
    //Magix3 写法，类mustach的模板语法
    //https://github.com/thx/magix-combine/issues/27
    rangePairs.push(new TemplateRangePair('\{\{ {0,1}each', '\{\{ {0,1}/each'));
    rangePairs.push(new TemplateRangePair('\{\{ {0,1}forin', '\{\{ {0,1}/forin'));
    rangePairs.push(new TemplateRangePair('\{\{ {0,1}for', '\{\{ {0,1}/for'));
    rangePairs.push(new TemplateRangePair('\{\{ {0,1}if', '\{\{ {0,1}/if'));
   //直通车写法
    rangePairs.push(new TemplateRangePair('\{\{#', '\{\{\/'));
    
    //将文本按照行拆分
    var text: string = document.getText();
    var lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      rangePairs.forEach(rangePair => {
        rangePair.readLine(line,i);
      });
    }

    rangePairs.forEach(rangePair => {
      regions = regions.concat(rangePair.getFoldingRanges());
    });
    return regions;
  }


}
class TemplateRangePair {
  start: RegExp;
  end: RegExp;
  startPositions: Array<number>;
  endPositions: Array<number>;
  constructor(startReg: string, endReg: string) {
    this.start = new RegExp(startReg);
    this.end = new RegExp(endReg);
    this.startPositions = [];
    this.endPositions = [];
  }
  public readLine(lineStr: string, lineNumber: number) {
    //console.log(lineStr);
    if (this.start.exec(lineStr)) {
      this.startPositions.push(lineNumber);
    }
    if (this.end.exec(lineStr)) {
      this.endPositions.push(lineNumber);
    }
  }
  getFoldingRanges(): vscode.FoldingRange[] {
   //console.log(this.startPositions);
   //console.log(this.endPositions);
   
    let regions: vscode.FoldingRange[] = [];
    
    for (let i = this.startPositions.length - 1; i >=0 ; i--) {
      let startLine:number = this.startPositions[i];
      let endLine:number = -1;
      let distance:number = 0;
      let index:number = -1;
      for (let j = 0; j < this.endPositions.length; j++) {
        let tempEndLineNum:number = this.endPositions[j];
        //结束行号在开始行号之前，是错误的折叠范围
        if(tempEndLineNum < startLine){
          continue;
        }
        if(tempEndLineNum === startLine){
          index = j;
          break;
        }
        //找到模板中代码片段，开始行和结束行离得最近。就代表着开始行和结束行之间是一个代码段。
        let tempDistance = tempEndLineNum - startLine;
        if(distance === 0 || tempDistance < distance){
          distance = tempDistance;
          endLine = tempEndLineNum;
          index = j;
        }
      }

      if(index !== -1){
        this.endPositions.splice(index,1);
      }
      
      //折叠的开始行数大于结束行数，为正常文本
      if (startLine <= endLine) {
        regions.push(new vscode.FoldingRange(startLine, endLine, vscode.FoldingRangeKind.Comment));
      }

    }
    
    return regions;
  }

}