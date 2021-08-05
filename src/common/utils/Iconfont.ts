
const request = require('request');
const Datauri = require('datauri');
import * as fs from 'fs';
import * as path from 'path';
const csstree = require('css-tree');

export interface IconfontData {
  code: string;
  data: string;
  className: string;
}
export class Iconfont {
  private static IconFontDataCache: Array<IconfontData> = [];
  private static datauri = new Datauri();
  /**
   * 通过className 获取IconFont 图标信息
   * @param className className
   */
  public static getDataByClass(className: string): Array<IconfontData> {
    return this.IconFontDataCache.filter(item => {
      return item.className.indexOf(className) > -1;
    });
  }
  /**
   * 通过 code 获取IconFont 图标信息 
   * @param code 
   */
  public static getDataByCode(code?: string): Array<IconfontData> {
    if (!code) {
      return this.IconFontDataCache;
    }
    return this.IconFontDataCache.filter(item => {
      return item.code.indexOf(code) > -1;
    });
  }
  /**
   * 去掉注释，避免csstree 无法
   * @param code 
   */
  private static removeComments(code: string) {
    let lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      //避免 url(‘//at.alicdn.com/t/font_826439_bq8dmoo4mn7.woff2') 被清除掉
      if (lines[i].indexOf('url(') < 0) {
        lines[i] = lines[i].replace(/\/\/.*$/mg, '');
      }
    }

    return lines.join('\n');
  }

  public static scanCSSFile(fileList: Array<string>) {
    
    fileList.forEach((filePath) => {
      let extName = path.extname(filePath);
      if (filePath.indexOf('src') < 0) {
        return;
      }
      if (extName === '.css' || extName === '.less' || extName === '.scss') {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, content) => {
          if (!err) {
            content = this.removeComments(content);
            let cssAST: any = csstree.parse(content);
           
            let classUrlMap: Map<string, string> = this.readCSSAST(cssAST)

            classUrlMap.forEach((url, className) => {
              this.fetchSvgData(className, url).then((list: any) => {
                //去重
                list.forEach((data:any)=>{
                  if (!Iconfont.IconFontDataCache.find((item: any) => {
                    return item.className === data.className &&
                      item.code === data.code &&
                      item.data === data.data
                  })) {
                    Iconfont.IconFontDataCache.push(data)
                  }
                })
              });
            });
          }
        })

      }
    });
   
  }
  private static readCSSAST(cssAST: any) {
    let fontFaceList: Array<{ name: string, url: string }> = [];
    let fontClassList: Array<{ fontName: string, className: string }> = [];
    let classUrlMap: Map<string, string> = new Map();

    if (!cssAST.children) {
      return classUrlMap
    }
    cssAST.children.forEach((node: any) => {
      let name: string, url: string, className: string = '', fontName: string = '';
      //解析font-face
      if (node.type === 'Atrule' && node.name === 'font-face' && node.block && node.block.children) {
        node.block.children.forEach((subNode: any) => {
          if (subNode.type === 'Declaration') {
            if (subNode.property === 'font-family' &&
              subNode.value &&
              subNode.value.children) {
              subNode.value.children.forEach((thNode: any) => {
                if (thNode.type === 'String') {
                  name = thNode.value.replace(/[\'\"]/gi, '');
                }
              });

            }

            if (subNode.property === 'src' &&
              subNode.value &&
              subNode.value.children) {
              subNode.value.children.forEach((thNode: any) => {
                if (thNode.type === 'Url' &&
                  thNode.value &&
                  thNode.value.value &&
                  thNode.value.value.indexOf('.svg') > -1) {
                  url = thNode.value.value.replace(/[\'\"]/gi, '');
                }
              });
            }

            if (name && url) {
              fontFaceList.push({ name, url });
            }
          }
        });
      } else if (node.type === 'Rule' &&
        node.prelude &&
        node.prelude.type === 'SelectorList' &&
        node.prelude.children &&
        node.block &&
        node.block.children) {
        //className
        node.prelude.children.forEach((subNode: any) => {
          if (subNode.type === 'Selector' && subNode.children) {
            subNode.children.forEach((thNode: any) => {
              if (thNode.type === 'ClassSelector') {
                className = thNode.name;
              }
            });
          }
        });
        //fontName
        node.block.children.forEach((subNode: any) => {
          if (subNode.type === 'Declaration' &&
            subNode.property === 'font-family' &&
            subNode.value &&
            subNode.value.children) {
            subNode.value.children.forEach((thNode: any) => {
              if (thNode.type === 'String') {
                fontName = thNode.value.replace(/[\'\"]/gi, '');
              }
            });
          }
        });

        if (className && fontName) {
          fontClassList.push({ className, fontName });
        }
      }
    });


    fontClassList.forEach((c) => {
      let font = fontFaceList.find(f => {
        return f.name === c.fontName;
      });
      if (font) {
        classUrlMap.set(c.className, font.url);
      }
    });

    return classUrlMap;
  }
  private static fetchSvgData(className: string, url: string) {
    let p = new Promise((resolve, reject) => {
      request('http:' + url, (error: any, response: any, body: any) => {
        if (!error && response.statusCode === 200) {

          let arr = body.match(/<glyph.*\/>/gi);
          let list: Array<IconfontData> = [];
          if (arr) {
            arr.forEach((item: string) => {
              item.match(/unicode=\"\&\#(\d+);\"\s*d=\"(.*?)\"/gi);
              let code = RegExp.$1 ? Number(RegExp.$1).toString(16) : '';
              let data = RegExp.$2;
              if (code && data) {
                list.push({ className, code, data });
              }
            });
          }
          resolve(list);

        } else {
          //console.error('send log error');
          reject(error);
        }
      });
    });
    return p;
  }

  public static dataToMarkdown(data: IconfontData, needClassName: boolean) {
    let svg: string = needClassName ? this.toSvgWithClassName(data) : this.toSvg(data);
    this.datauri.format('.svg', svg);
    return `![](${this.datauri.content})`;
  }

  private static toSvgWithClassName(data: IconfontData) {
    return `<svg viewBox='0 0 1500 1500' width='80' height='120' style='margin:10px;' xmlns='http://www.w3.org/2000/svg' >
    <path style='transform:rotateX(180deg);transform-origin:center;scale(.8);' fill='#EA3C3C' d='${data.data}'></path>
    <foreignObject width="1500" height="240">
      <body xmlns="http://www.w3.org/1999/xhtml">
        <div style="font-size:200px;margin:0;color:#1F94ED;">${data.className}</div>
      </body>
    </foreignObject>
    </svg>`;
  }
  private static toSvg(data: IconfontData) {
    return `<svg viewBox='0 0 1500 1500' width='80' height='100' style='margin:10px;' xmlns='http://www.w3.org/2000/svg' >
      <path style='transform:rotateX(180deg);transform-origin:center;scale(.8);' fill='#EA3C3C' d='${data.data}'></path>
    </svg>`;
  }
}
