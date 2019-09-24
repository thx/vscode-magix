const request = require('request');

export class Rap {
    public static getProjectInfo(projectId: string): Promise<any> {
        let promise = new Promise((resolve, reject) => {

            let url = 'http://rap2api.alibaba-inc.com/repository/get?id=' + projectId;

            request({ url }, (error: any, response: any, body: any) => {
                if (!error && response.statusCode === 200) {
                    let resp = JSON.parse(response.body);
                    if (resp.data) {
                        for (const key in resp.data) {
                            //删除无用字段
                            if (key !== 'modules') {
                                delete resp.data[key];
                            }
                        }
                        let modules = resp.data.modules;
                        let interfaces: Array<any> = [];
                        modules.forEach((module: any) => {
                            module.interfaces.forEach((i: any) => {
                                i.moduleName = module.name;
                                i.moduleId = module.id;
                                i.moduleDescription = module.description;
                                interfaces.push(i);
                            });
                        });
                        resolve(interfaces);
                    }
                    else {
                        reject(resp);
                    }
                } else {
                    reject(error);
                }
            });
        });
        return promise;
    }
}