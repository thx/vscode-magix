const axios = require('axios');
export enum LogType {
  Activate = 'activate',
  Deactivate = 'deactivate',
  MxTable = 'mx-table'
}
import { FileUtils } from './FileUtils';
export class Logger {
  public static error(info: any) {
    console.error(info);
  }

  public static log(info: any) {
    console.log(info);
  }

  public static logActivate(useTime: number, error: string) {
    this.aplusLog(LogType.Activate, { useTime, error });
  }
  public static logDeactivate() {
    this.aplusLog(LogType.Deactivate);
  }
  public static aplusLog(logType: LogType, params?: any) {
    const rootPath: string = FileUtils.getProjectPath();
    const list: any[] = [];
    list.push(`project_path=${encodeURI(rootPath)}`);
    if (params) {
      for (const key in params) {
        const value = params[key];
        value && list.push(`${key}=${encodeURI(value)}`);
      }
    }
    list.push(`t=${new Date().getTime()}`);
    const url = `http://gm.mmstat.com/magix-plugin.event.${logType}?${list.join('&')}`;
    this.request4Log(url);
  }
  private static request4Log(url: string) {
    axios.get(url).then(() => {
      console.log('send log success');
    }).catch((error: any) => {
      console.error(error);
    });
  }
}