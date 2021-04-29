import * as $ from 'gogocode';
import * as path from 'path';
import { Info } from './ProjectInfoUtils';
import { Rap } from '../../net/Rap';
import * as fs from 'fs';

export class RapModelUtils {
    private static model: Model;
    public static getModel(): Model {
        return this.model;
    }
    /**
     * 更新RapModels 信息
     * @param projectInfo 
     */
    public static updateModelInfo(projectInfo: Info) {
        if (!projectInfo || !projectInfo.modelsPath || !projectInfo.rapProjectId) {
            // console.error('无法找到工程目录，或无法找到 models 文件');
            return;
        }
        this.analyseModelsFile(projectInfo);
        this.getDataFromRap(projectInfo.rapProjectId);
    }
    private static analyseModelsFile(projectInfo: Info) {
        let mPath = path.join(projectInfo.rootPath, projectInfo.modelsPath);
        this.model = new Model();
        this.model.projectId = projectInfo.rapProjectId;
        try {

            fs.readFile(mPath, { encoding: 'utf-8' }, (err, content) => {
                if (!err) {
                    const ast: any = $(content).node;

                    if (ast.program.body &&
                        ast.program.body.length > 0 &&
                        ast.program.body[0].expression &&
                        ast.program.body[0].expression.right &&
                        ast.program.body[0].expression.right.elements) {
                        let elements = ast.program.body[0].expression.right.elements;
                        elements.forEach((element: any) => {
                            let modelItem: ModelItem = new ModelItem();
                            // 分析注释文本，找到rapid等信息
                            if (element.leadingComments && element.leadingComments.length > 0) {
                                let comment = element.leadingComments[0].value;
                                let arr = comment.split('-');
                                if (arr.length > 1) {
                                    modelItem.name = arr[0];
                                    let tempArr = arr[1].split('#');
                                    modelItem.id = tempArr.length > 1 ? tempArr[1] : '';
                                }

                            }
                            if (element.properties) {
                                element.properties.forEach((prop: any) => {
                                    let key = prop.key.value;
                                    let value = prop.value.value;
                                    if (key === 'name') {
                                        modelItem.key = value;
                                    } else if (key === 'url') {
                                        modelItem.url = value;
                                    }
                                });
                            }
                            this.model.list.push(modelItem);
                        });
                    }
                }
            })

        } catch (error) {
            //console.error(error);
        }
    }
    private static getDataFromRap(projectId: string) {
        Rap.getProjectInfo(projectId).then((interfaces: Array<any>) => {

            let list = this.model.list;

            interfaces.forEach((interfaceItem: any) => {

                let find = list.find((item: ModelItem) => {
                    return interfaceItem.url === item.url;
                });
                if (find) {
                    find.id = interfaceItem.id;
                    find.moduleDescription = interfaceItem.moduleDescription;
                    find.moduleId = interfaceItem.moduleId;
                    find.moduleName = interfaceItem.moduleName;
                    find.name = interfaceItem.name;
                    find.properties = interfaceItem.properties;

                }
            });
        });
    }
}
export class Model {
    projectId: string;
    list: Array<ModelItem>;
    constructor() {
        this.projectId = '';
        this.list = [];
    }
}
export class ModelItem {
    key: string;
    url: string;
    name: string;
    id: string;
    moduleName: string;
    moduleId: string;
    moduleDescription: string;
    properties: Array<any>;
    constructor() {
        this.key = '';
        this.url = '';
        this.name = '';
        this.id = '';
        this.moduleName = '';
        this.moduleId = '';
        this.moduleDescription = '';
        this.properties = [];
    }
}