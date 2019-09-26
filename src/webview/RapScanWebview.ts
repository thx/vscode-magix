import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BaseView } from './BaseView';
import { WebCommand } from '../common/constant/WebCommand';
import { ProjectInfoUtils, Info } from '../common/utils/ProjectInfoUtils';
import { FileUtils } from '../common/utils/FileUtils';
import { RapModelUtils, Model } from '../common/utils/RapModelUtils';



export class RapScanWebview extends BaseView {
    public show() {
        let path = './web/rap-scan.html';
        let title = '无效Rap引用扫描';
        this.createWebview(path, title, vscode.ViewColumn.Active);
        this.onDidReceiveMessage((e) => {
            if (e.type === WebCommand.GET_PROJECT_INFO) {
                let info: Info = ProjectInfoUtils.getInfo();
                this.postMessage(WebCommand.GET_PROJECT_INFO, info);
            } else if (e.type === WebCommand.START_SCAN_RAP) {
                this.startScan();
                this.postMessage(WebCommand.FINISH_SCAN_RAP, {});
            } else if (e.type === WebCommand.OPEN_EDITOR) {

                this.openEditor(e.data);
            } else if (e.type === WebCommand.CLOSE) {
                this.dispose();
            }
        });
    }
    private startScan() {
        let info: Info = ProjectInfoUtils.getInfo();
        if (!info) {
            this.postMessage(WebCommand.FINISH_SCAN_RAP, { ok: false, msg: '获取项目信息失败' });
            return;
        }
        if (!info.modelsPath || !info.rootPath) {
            this.postMessage(WebCommand.FINISH_SCAN_RAP, { ok: false, msg: '获取models.js 文件信息失败' });
            return;
        }
        let model: Model = RapModelUtils.getModel();
        if (!model) {
            this.postMessage(WebCommand.FINISH_SCAN_RAP, { ok: false, msg: '获取model信息失败' });
            return;
        }

        let fileList: Array<string> = FileUtils.listFiles(info.rootPath);
        let strReg = /[\'\"]+([^\'\"]*)_(get|post|put|delete|options|patch|head)[\'\"]+/g;
        let list: Array<any> = [];
        fileList.forEach(filePath => {
            let extName = path.extname(filePath);
            if (filePath.indexOf('src') < 0 || filePath.indexOf('gallery') > -1 || filePath.indexOf(info.modelsPath) > -1) {
                //不扫描无效路径
                return;
            }
            if (extName === '.ts' || extName === '.js' || extName === '.es') {
                let content = fs.readFileSync(filePath, 'UTF-8');
                let lines = content.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    let text = lines[i];
                    let arr = text.match(strReg);
                    if (arr && arr.length > 0) {
                        arr.forEach(item => {
                            item = item.replace(/\'|\"/ig, '');
                            //在models.js 文件里面找不到，说明无效Rap引用了
                            if (item.indexOf('_') > -1 && !model.list.find((mi) => {
                                return mi.key === item;
                            })) {
                                let start = text.indexOf(item);
                                let end = start + item.length;
                                list.push({
                                    key: item,
                                    filePath,
                                    start,
                                    end,
                                    line: i
                                });
                            }

                        });

                    }

                }
            }
        });
        this.postMessage(WebCommand.FINISH_SCAN_RAP, { ok: true, list });
    }
    private openEditor(data: any) {
        let filePath: string = data.filePath;
        let range: vscode.Range = new vscode.Range(new vscode.Position(data.line, data.start), new vscode.Position(data.line, data.end));
        let uri = vscode.Uri.file(filePath);

        vscode.window.showTextDocument(uri, { selection: range });
    }


}