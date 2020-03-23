import { window, TextEditor, workspace, FileSystemWatcher, Uri } from 'vscode';
import { ESFileInfo } from './model/ESFileInfo';
import { Cache } from './common/utils/CacheUtils';
import { ESFileAnalyzer } from './common/analyzer/ESFileAnalyzer';
import { ProjectInfoUtils, Info } from './common/utils/ProjectInfoUtils';
import * as fs from 'fs';
import * as path from 'path';
import { HtmlESMappingCache } from './common/utils/CacheUtils';
import { Iconfont } from './common/utils/Iconfont';
import { FileUtils } from './common/utils/FileUtils';
import { RapModelUtils } from './common/utils/RapModelUtils';


export class Initializer {
  private rootPath: string
  private  excludePath: string[];

  constructor() {
    this.rootPath = FileUtils.getProjectPath(undefined);
    this.excludePath = [path.join(this.rootPath, 'build'), path.join(this.rootPath, 'node_modules')];
  }

  /**
   * 扫描项目文件夹
   */
  private scanSrcFile() {

    let fileList: Array<string> = FileUtils.listFiles(this.rootPath);

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
        this.mappingFile(content, filePath);
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
  private scanProjectFile() {
    
    ProjectInfoUtils.scanProject(this.rootPath);
  }
  /**
   * 从新扫描所有CSSFile
   */
  private reScanAllCSSFile() {
    
    let fileList: Array<string> = FileUtils.listFiles(this.rootPath);

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
  private mappingFile(content: string, filePath: string) {
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
  private mappingSameFile(filePath: string) {
    let htmlPath: string = path.join(path.dirname(filePath), path.basename(filePath).replace(path.extname(filePath), '.html'));
    HtmlESMappingCache.addMapping(filePath, htmlPath);
  }
  /**
   * 判断当前路径是否需要更新
   * @param path 
   */
  private needUpdate(path: string): boolean {
    return !this.excludePath.find((exPath: string) => {
      return path.indexOf(exPath) > -1;
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
      if (!this.needUpdate(filePath)) {
        return;
      }
      let ext: string = path.extname(filePath);
      if (ext === '.ts' || ext === '.js' || ext === '.es') {
        let content: string = fs.readFileSync(filePath, 'utf-8');
        if (ext === '.es') {
          this.mappingSameFile(filePath);
        } else {
          this.mappingFile(content, filePath);
          this.updateModelInfo(filePath);
        }
        this.updateESCache(content, filePath);
      }
      this.reScanAllCSSFile();
    });
    watcher.onDidCreate((e: Uri) => {
      let filePath = e.fsPath;
      if (!this.needUpdate(filePath)) {
        return;
      }
      let ext: string = path.extname(filePath);
      if (ext === '.ts' || ext === '.js' || ext === '.es') {
        let content: string = fs.readFileSync(filePath, 'utf-8');
        if (ext === '.es') {
          this.mappingSameFile(filePath);
        } else {
          this.mappingFile(content, filePath);
          this.updateModelInfo(filePath);
        }
        this.updateESCache(content, filePath);
      }
      this.reScanAllCSSFile();
    });
    watcher.onDidDelete((e: Uri) => {
      let filePath = e.fsPath;
      if (!this.needUpdate(filePath)) {
        return;
      }
      Cache.remove(filePath);

      let ext: string = path.extname(filePath);
      if (ext === '.ts' || ext === '.js' || ext === '.es') {
        HtmlESMappingCache.removeMappingByEsFile(filePath);
      } else if (ext === '.html') {
        HtmlESMappingCache.removeMappingByHtmlFile(filePath);
      }
      this.reScanAllCSSFile();
    });
  }

  private updateESCache(content: string, filePath: string) {
    let info: ESFileInfo | null = ESFileAnalyzer.analyseESFile(content, filePath);
    if (info) {
      Cache.set(filePath, info);
    }
  }
  private updateModelInfo(path: string | undefined | null) {
    let info: Info = ProjectInfoUtils.getInfo();
    if (path && info && info.modelsPath) {
      //如果指定path，path不是models.js 的路径。则不更新rap信息
      if (path.indexOf(info.modelsPath) < 0) {
        return;
      }
    }
    //如果没有指定path，则更新rap信息
    RapModelUtils.updateModelInfo(info);
  }
  public init(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.scanProjectFile();
      this.startWatching();
      this.scanSrcFile();
      this.updateModelInfo(null);
      resolve();

    });
  }

}
