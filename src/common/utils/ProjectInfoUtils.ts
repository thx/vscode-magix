import * as path from 'path';
import * as fs from 'fs';

export class ProjectInfoUtils {
    private static info: Info ;
    /**
     * 扫描当前目录
     */
    public static scanProject(rootPath: string) {
        if (rootPath) {
            let packageFilePath = path.join(rootPath, 'package.json');
            if (fs.existsSync(packageFilePath)) {
                try {
                    let content = fs.readFileSync(packageFilePath, 'UTF-8');
                    let obj = JSON.parse(content);
                    let info = new Info();
                    info.name = obj.name;
                    info.modelsPath = obj.magixCliConfig.modelsPath;
                    info.rootPath = rootPath;
                    info.rapProjectId = obj.magixCliConfig.rapProjectId || obj.magixCliConfig.matProjectId;
                    info.rapVersion = obj.magixCliConfig.rapVersion;
                    this.info = info;
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
    public static getInfo(): Info {
        return this.info;
    }
}
export class Info {
    constructor() {
        this.rootPath = '';
        this.name = '';
        this.modelsPath = '';
        this.rapVersion = '';
        this.rapProjectId = '';
    }
    rootPath: string;
    name: string;
    modelsPath: string;
    rapVersion: string;
    rapProjectId: string;
}
