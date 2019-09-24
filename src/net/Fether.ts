
const request = require('request');
import { ShortcutInfo } from '../model/ShortcutInfo';

export class Fether {
    /**
     * 通过nickname 获取快捷方式
     * @param nickname 花名
     */
    public static getShortcut(nickname: string, projectName: string): Promise<any> {
        let path = 'shortcutGet';
        let params = { nickname, projectName };
        return this.fetherRequest(path, params);
    }
    /**
     * 更新快捷方式
     * @param shortcut 快捷方式信息
     */
    public static updateShortcut(shortcut: ShortcutInfo | any): Promise<any> {
        let path = 'shortcutAdd';
        return this.fetherRequest(path, shortcut);
    }
    private static fetherRequest(path: string, params: any) {
        let promise = new Promise((resolve, reject) => {

            let url = 'https://fether.m.alibaba-inc.com/magix-vscode-server/' + path
                + '?_f_needLogin=0&_f_debug=0&_f_ignoreCache=0&token=&_f_storage=&params='
                + encodeURIComponent(JSON.stringify(params));
            request({ url, timeout: 3000 }, (error: any, response: any, body: any) => {
                if (!error && response.statusCode === 200) {
                    let resp = JSON.parse(response.body);
                    if (resp.code === 200 && resp.result.ok) {
                        resolve(resp.result.data);
                    }
                    else {
                        reject(resp.result.msg);
                    }
                } else {
                    reject(error);
                }
            });
        });
        return promise;
    }
}