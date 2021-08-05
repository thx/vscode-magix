const request = require('request');
export class Rap {
    public static getProjectInfo(projectId: string): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            this.fetchProject(projectId).then((project) => {
                const { modules = [], collaborators = [], id: pId } = project;
                let interfaces: Array<any> = [];
                this.modules2Interfaces(pId, modules, interfaces);
                if (collaborators.length === 0) {
                    resolve(interfaces);
                    return;
                }
                const pList = collaborators.map((item: any) => this.fetchProject(item.id));
                Promise.all(pList).then((projectList) => {
                    projectList.forEach((project: any) => {
                        const { modules = [], id: pId } = project;
                        this.modules2Interfaces(pId, modules, interfaces);
                    });
                    resolve(interfaces);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
        return promise;
    }
    private static modules2Interfaces(projectId: string | number, modules: Array<any>, interfaces: Array<any>) {
        modules.forEach((module: any) => {
            module.interfaces.forEach((i: any) => {
                i.moduleName = module.name;
                i.moduleId = module.id;
                i.moduleDescription = module.description;
                i.projectId = projectId;
                interfaces.push(i);
            });
        });
    }
    private static fetchProject(projectId: string): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            let url = 'http://rap2api.alibaba-inc.com/repository/get?id=' + projectId;
            request({ url }, (error: any, response: any, body: any) => {
                if (!error && response.statusCode === 200) {
                    let resp = JSON.parse(response.body);
                    resolve(resp.data);
                } else {
                    reject(error);
                }
            });
        });
        return promise;
    }
}