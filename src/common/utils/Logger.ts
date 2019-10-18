const request = require('request');

import { FileUtils } from './FileUtils';
export class Logger {
  public static error(info: any) {
    console.error(info);
  }

  public static log(info: any) {
    console.log(info);
  }

  public static logActivate(useTime: number, error: string) {
    let rootPath: string = FileUtils.getProjectPath(undefined);
    let url: string = 'http://gm.mmstat.com/magix-plugin.event.activate?project_path=' +
      encodeURI(rootPath) +
      '&use_time=' +
      useTime +
      '&error=' +
      encodeURI(error) +
      '&t=' +
      new Date().getTime();
    this.request4Log(url);
  }
  public static logDeactivate() {
    let rootPath: string = FileUtils.getProjectPath(undefined);
    let url: string = 'http://gm.mmstat.com/magix-plugin.event.deactivate?project_path=' + encodeURI(rootPath) + '&t=' + new Date().getTime();
    this.request4Log(url);
  }
  private static request4Log(url: string) {
    try {
      request(url, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {
          console.log('send log success');
        } else {
          console.log('send log error');
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}