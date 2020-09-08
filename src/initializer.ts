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

  constructor() {
    this.rootPath = FileUtils.getProjectPath(undefined);
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
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, content) => {
          if (!err) {
            var reg = new RegExp('<(\S*?)[^>]*>.*?|<.*? />', "g");
            let strArr = content.match(reg);
            if (strArr) {
              strArr.forEach(element => {
              });
            }
          }
        })
      }
      else if (extName === '.ts' || extName === '.js') {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, content) => {
          if (!err) {
            this.mappingFile(content, filePath);
          }
        })
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
   * 从新扫描CSSFile
   */
  private reScanCSSFile(filePath: string) {
    Iconfont.scanCSSFile([filePath]);
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
          //isDirty  代表数据还没有写到硬盘以editor内容为准，强制刷新缓存
          this.updateESCache(editor.document.getText(), path, editor.document.isDirty);
        } else if (languageId === 'html' || languageId === 'handlebars') {
          //html 切换的时候分析Magix 对应的ts、js 文件
          const jsFilePath = path.replace('.html', '.js');
          if (fs.existsSync(jsFilePath)) {
            const content = fs.readFileSync(jsFilePath, 'UTF-8');
            this.updateESCache(content, jsFilePath);
          }
          const tsFilePath = path.replace('.html', '.ts');
          if (fs.existsSync(tsFilePath)) {
            const content = fs.readFileSync(tsFilePath, 'UTF-8');
            this.updateESCache(content, tsFilePath);
          }
        }
      }
    });
    //监听文件

    const pattern = path.join(this.rootPath, '/src', '**/*.{ts,js,html,css,less,scss,es}')
    let watcher: FileSystemWatcher = workspace.createFileSystemWatcher(pattern, false, false, false);
    watcher.onDidChange((e: Uri) => {
      let filePath = e.fsPath;

      let ext: string = path.extname(filePath);
      if (ext === '.ts' || ext === '.js' || ext === '.es') {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, content) => {
          if (!err) {
            if (ext === '.es') {
              this.mappingSameFile(filePath);
            } else {
              this.mappingFile(content, filePath);
              this.updateModelInfo(filePath);
            }
            this.updateESCache(content, filePath);
          }
        })
      } else if (ext === '.css' || ext === '.less' || ext === '.scss') {
        this.reScanCSSFile(filePath);
      }

    });
    watcher.onDidCreate((e: Uri) => {
      let filePath = e.fsPath;

      let ext: string = path.extname(filePath);
      if (ext === '.ts' || ext === '.js' || ext === '.es') {

        fs.readFile(filePath, { encoding: 'utf-8' }, (err, content) => {
          if (!err) {
            if (ext === '.es') {
              this.mappingSameFile(filePath);
            } else {
              this.mappingFile(content, filePath);
              this.updateModelInfo(filePath);
            }
            this.updateESCache(content, filePath);
          }
        })
      } else if (ext === '.css' || ext === '.less' || ext === '.scss') {
        this.reScanCSSFile(filePath);
      }
    });
    watcher.onDidDelete((e: Uri) => {
      let filePath = e.fsPath;

      Cache.remove(filePath);

      let ext: string = path.extname(filePath);
      if (ext === '.ts' || ext === '.js' || ext === '.es') {
        HtmlESMappingCache.removeMappingByEsFile(filePath);
      } else if (ext === '.html') {
        HtmlESMappingCache.removeMappingByHtmlFile(filePath);
      } else if (ext === '.css' || ext === '.less' || ext === '.scss') {
        this.reScanCSSFile(filePath);
      }
    });
  }

  private updateESCache(content: string, filePath: string, force?: boolean) {

    const cacheData = Cache.get(filePath);
    if (cacheData) {
      const { mtime } = fs.statSync(filePath);
      if (force) {
        this.setESCache(content, filePath);
      } else if (cacheData.mtime.getTime() !== mtime.getTime()) {
        this.setESCache(content, filePath);
      }
    } else {
      this.setESCache(content, filePath);
    }

  }
  private setESCache(content: string, filePath: string) {
    let info: ESFileInfo | null = ESFileAnalyzer.analyseESFile(content, filePath);
    if (!info) {
      return;
    }
    const { mtime } = fs.statSync(filePath);
    info.mtime = mtime;
    Cache.set(filePath, info);
  }
  private updateModelInfo(path: string | undefined | null) {
    if (!path) {
      return;
    }
    let info: Info = ProjectInfoUtils.getInfo();

    if (path && info && info.modelsPath) {
      //如果指定path，path不是models.js 的路径。则不更新rap信息
      if (path.indexOf(info.modelsPath) < 0) {
        return;
      }
      //如果没有指定path，则更新rap信息
      RapModelUtils.updateModelInfo(info);
    }
  }
  public init(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.scanProjectFile();
      this.startWatching();
      this.scanSrcFile();
      let info: Info = ProjectInfoUtils.getInfo();
      if (info && info.modelsPath) {
        RapModelUtils.updateModelInfo(info);
      }
      resolve();

    });
  }

}
