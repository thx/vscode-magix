
const axios = require('axios');
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
        const promise = new Promise((resolve, reject) => {

            const url = 'https://fether.m.alibaba-inc.com/magix-vscode-server/' + path
                + '?_f_needLogin=0&_f_debug=0&_f_ignoreCache=0&token=&_f_storage=&params='
                + encodeURIComponent(JSON.stringify(params));
            axios({
                url,
                method: 'get',
                timeout: 3000
            }).then((response: any) => {
                if (response.status === 200) {
                    const resp = response.data;
                    if (resp.code === 200 && resp.result.ok) {
                        resolve(resp.result.data);
                    } else {
                        reject(resp.result.msg);
                    }
                } else {
                    reject(response.status);
                }
            }).catch((err: any) => {
                reject(err.message);
            });
               
        });
        return promise;
    }
}