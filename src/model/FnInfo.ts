export class FnInfo {
  mxFnName: string;
  fnName: string;
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  constructor(data: any = {}) {
    this.mxFnName = data.mxFnName || '';
    this.fnName = data.fnName || "";
    this.startLine = data.startLine || 0;
    this.startColumn = data.startColumn || 0;
    this.endLine = data.endLine || 0;
    this.endColumn = data.endColumn || 0;
  }
}