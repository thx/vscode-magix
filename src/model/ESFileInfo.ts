import { FnInfo } from './FnInfo';

export class ESFileInfo {

  functions: Array<FnInfo>;
  mtime: Date;
  constructor(data: any = {}) {
    this.functions = data.functions || new Array<FnInfo>();
    this.mtime = new Date();
  }
}