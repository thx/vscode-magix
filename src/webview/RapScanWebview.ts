import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BaseView } from './BaseView';
import { WebCommand } from '../common/constant/WebCommand';
import { ProjectInfoUtils, Info } from '../common/utils/ProjectInfoUtils';
import { FileUtils } from '../common/utils/FileUtils';



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
               this.openEditor();
            } else if (e.type === WebCommand.CLOSE) {
                this.dispose();
            }
        });
    }
    private startScan() {
        let info: Info = ProjectInfoUtils.getInfo();
        if (!info) {
            return;
        }
        if(info.modelsPath && info.rootPath){
           
          
        }
      
        let list: Array<string> = FileUtils.listFiles(info.rootPath);
        let strReg = /[\'\"]+([^\'\"]*)_(get|post|put|delete|options|patch|head)[\'\"]+/g;

        list.forEach(filePath => {
            let extName = path.extname(filePath);
            if (filePath.indexOf('src') < 0 || filePath.indexOf('gallery') > -1 || filePath.indexOf(info.modelsPath) > -1) {
                return;
            }
            else if (extName === '.ts' || extName === '.js' || extName === '.es') {
                let content = fs.readFileSync(filePath, 'UTF-8');
                let lines = content.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i];
                    let arr = line.match(strReg);
                    if(arr && arr.length > 0){
                        arr.forEach(item=>{
                            if(item.indexOf('_')>-1){
                                console.log(filePath);
                                console.log(item);
                            }
                          
                        });
                        
                    }
                  
                }
            }
        });
    }
    private openEditor(){
        vscode.window.showTextDocument(vscode.Uri.file('/Users/fuyingjun/MyWork/web/flint/src/flint/views/pages/insight/widget/dimension-search.ts'));
    }


}