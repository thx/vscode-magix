import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BaseView } from './BaseView';
import { WebCommand } from '../common/constant/WebCommand';
import { ProjectInfo, Info } from '../common/utils/ProjectInfo';
import { FileUtils } from '../common/utils/FileUtils';



export class RapScanWebview extends BaseView {
    public show() {
        let path = './web/rap-scan.html';
        let title = '无效Rap引用扫描';
        this.createWebview(path, title, vscode.ViewColumn.Active);
        this.onDidReceiveMessage((e) => {
            if (e.type === WebCommand.GET_PROJECT_INFO) {
                let info: Info = ProjectInfo.getInfo();
                this.postMessage(WebCommand.GET_PROJECT_INFO, info);
            } else if (e.type === WebCommand.START_SCAN_RAP) {
                this.startScan();
                this.postMessage(WebCommand.FINISH_SCAN_RAP, {});
            } else if (e.type === WebCommand.CLOSE) {
                this.dispose();
            }
        });
    }
    private startScan() {
        let info: Info = ProjectInfo.getInfo();
        if (!info) {
            return;
        }
        let list: Array<string> = FileUtils.listFiles(info.rootPath);
        let strReg = /[\'\"]?([^\'\"]*)_get[\'\"]?/i;
        list.forEach(filePath => {
            let extName = path.extname(filePath);
            if (filePath.indexOf('src') < 0 || filePath.indexOf('gallery') > -1 || filePath === info.modelsPath) {
                return;
            }
            else if (extName === '.ts' || extName === '.js' || extName === '.es') {
                let content = fs.readFileSync(filePath, 'UTF-8');
                let lines = content.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i];
                    let arr = line.match(strReg);
                    if(arr && arr.length > 0){
                        console.log();
                    }
                  
                }
            }
        });
    }


}