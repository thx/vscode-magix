import { window, TextEditor,workspace,  FileSystemWatcher, Uri } from 'vscode';
import { ESFileInfo } from './model/ESFileInfo';
import { Cache } from './common/utils/CacheUtils';
import { ESFileAnalyzer } from './common/analyzer/ESFileAnalyzer';
import { ProjectInfo, Info } from './common/utils/ProjectInfo';
import * as fs from 'fs';
import * as path from 'path';
import * as fut from './common/utils/FileUtils';
//import * as parse5 from 'parse5';
import { HtmlESMappingCache } from './common/utils/CacheUtils';
import {Iconfont} from './common/utils/Iconfont';


export class Initializer {
  /**
   * 扫描项目文件夹
   */
  private scanSrcFile() {

    let fileList: Array<string> = [];
    let rootPath = fut.FileUtils.getProjectPath(undefined);
    this.listFiles(rootPath, fileList);
    let cssFileList: Array<string> = [];

    fileList.forEach((filePath) => {
      let extName = path.extname(filePath);
      if (filePath.indexOf('src') < 0) {
        return;
      }
      if (extName === '.html') {
        let content = fs.readFileSync(filePath, 'UTF-8');
        var reg = new RegExp('<(\S*?)[^>]*>.*?|<.*? />', "g");
        let strArr = content.match(reg);
        if (strArr) {
          strArr.forEach(element => {
          });
        }
      }
      else if (extName === '.ts' || extName === '.js') {
        let content = fs.readFileSync(filePath, 'UTF-8');
        this.mappingFile(content,filePath);
      } else if (extName === '.es') { 
        this.mappingSameFile(filePath);
      } else if (extName === '.css' || extName === '.less' || extName === '.scss') {
        cssFileList.push(filePath);
      }

    });
   
    Iconfont.scanCSSFile(cssFileList);

  }
  /**
   * 扫描工程目录下的关键文件，eg： package.json
   */
  private scanProjectFile(){
    let rootPath = fut.FileUtils.getProjectPath(undefined);
    ProjectInfo.scanProject(rootPath);
  }
  /**
   * 从新扫描所有CSSFile
   */
  private reScanAllCSSFile(){
    let fileList: Array<string> = [];
    let rootPath = fut.FileUtils.getProjectPath(undefined);
    this.listFiles(rootPath, fileList);
    let cssFileList: Array<string> = fileList.filter((filePath: string) => {
      let extName = path.extname(filePath);
      if (filePath.indexOf('src') > -1) {
        if (extName === '.css' || extName === '.less' || extName === '.scss') {
          return true;
        }
      }
      return false;
    });

    Iconfont.scanCSSFile(cssFileList);

  }
  private mappingFile(content: string, filePath: string){
    try {

      content.match(/(['"]?)tmpl\1.*?\@([^'"]*?)['"]/gi);
      //更好的正则
      //content.match(/(['"]?)tmpl\1\s*\:\s*(['"]+?)\@([^\2]*)\2/gi);
      let tmplVal: string = RegExp.$2;
      if (tmplVal) {
        let htmlPath: string = path.join(path.dirname(filePath), tmplVal);
        HtmlESMappingCache.addMapping(filePath, htmlPath);
      } else {
        //KISSY 版本
        let index: number = content.search(/\s*KISSY\s*\.\s*add\s*\(/g);
        if (index === 0) {
         this.mappingSameFile(filePath);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * 相同文件名判断 a.html -> a.js 
   * @param filePath 文件路径 
   */
  private mappingSameFile(filePath: string){
    let htmlPath: string = path.join(path.dirname(filePath), path.basename(filePath).replace(path.extname(filePath), '.html'));
    HtmlESMappingCache.addMapping(filePath, htmlPath);
  }
  /**
   * 列出项目所有文件
   * @param parentPath 
   * @param fileList 
   */
  private listFiles(parentPath: string, fileList: Array<string>) {
    let files = fs.readdirSync(parentPath);
    if (parentPath.indexOf('/.') > -1 || parentPath.indexOf('node_modules') > -1) {
      return;
    }

    files.forEach((item) => {
      item = path.join(parentPath, item);
      let stat = fs.statSync(item);
      try {
        if (stat.isDirectory()) {
          this.listFiles(item, fileList);
        }
        else if (stat.isFile()) {
          fileList.push(item);
        }
      } catch (error) {
        console.log(error);
      }
    });

  }
  /**
   * 开始文件监听
   */
  private startWatching() {
    //当编辑窗口活动时分析其内容
    window.onDidChangeActiveTextEditor((e: any) => {
      let editor: TextEditor | undefined = window.activeTextEditor;
      if (editor && editor.document) {
        let path: string = editor.document.uri.path;
        let languageId: string = editor.document.languageId;
        if (languageId === 'typescript' || languageId === 'javascript') {
          this.updateESCache(editor.document.getText(), path);
        }
      }
    });
    //监听文件

    let watcher: FileSystemWatcher = workspace.createFileSystemWatcher('**/*.{ts,js,html,css,less,scss,json,es}', false, false, false);
    watcher.onDidChange((e: Uri) => {
      let filePath = e.fsPath;
      let ext:string = path.extname(filePath);
      if(ext === '.ts' || ext === '.js' || ext === '.es'){
        let content:string = fs.readFileSync(filePath, 'utf-8');
        if(ext === '.es'){
          this.mappingSameFile(filePath);
        }else{
          this.mappingFile(content,filePath);
        }
        this.updateESCache(content, filePath);
      }
      this.reScanAllCSSFile();
    });
    watcher.onDidCreate((e: Uri) => {
      let filePath = e.fsPath;
      let ext:string = path.extname(filePath);
      if(ext === '.ts' || ext === '.js' || ext === '.es'){
        let content:string = fs.readFileSync(filePath, 'utf-8');
        if(ext === '.es'){
          this.mappingSameFile(filePath);
        }else{
          this.mappingFile(content,filePath);
        }
        this.updateESCache(content, filePath);
      }
      this.reScanAllCSSFile();
    });
    watcher.onDidDelete((e: Uri) => {
      let filePath = e.fsPath;
      Cache.remove(filePath);
     
      let ext:string = path.extname(filePath);
      if(ext === '.ts' || ext === '.js' || ext === '.es'){
        HtmlESMappingCache.removeMappingByEsFile(filePath);
      }else if(ext === '.html'){
        HtmlESMappingCache.removeMappingByHtmlFile(filePath);
      }
      this.reScanAllCSSFile();
    });
  }

  private updateESCache(content: string, filePath: string){
      let info: ESFileInfo | null = ESFileAnalyzer.analyseESFile(content, filePath);
      if (info) {
        Cache.set(filePath, info);
      }
  }
  
  public init(): Promise<any> {

    return new Promise((resolve, reject) => {

      this.startWatching();
      this.scanSrcFile();
      this.scanProjectFile();
      resolve();

    });
  }



}
