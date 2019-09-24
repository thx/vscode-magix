import { FnInfo } from '../../model/FnInfo';
import { ESFileInfo } from '../../model/ESFileInfo';
import * as path from 'path';
const babylon = require("babylon");
/**
 * 分析es文件
 */
export class ESFileAnalyzer {
  
  public static analyseESFile(content: string, filePath: string): ESFileInfo | null {
    try {
      let doc = babylon.parse(content, {
        allowImportExportEverywhere: true, allowReturnOutsideFunction: true, allowSuperOutsideMethod: true, plugins: [
          // enable jsx and flow syntax https://babeljs.io/docs/en/babel-parser
          "typescript", "estree", "flow", "flowComments", "objectRestSpread", "throwExpressions", "classProperties"
        ]
      });

      if (!doc.program.body) {
        return null;
      }
      let body: any = doc.program.body;
      let extName: string = path.extname(filePath);
      if (extName === '.es') {
        return this.analyseSubwayESFile(body);
      }
      if (extName === '.js') {
        this.analyseASTObject(body[0],false);
        //KISSY 版本
        let index: number = content.search(/\s*KISSY\s*\.\s*add\s*\(/g);
        if (index === 0) {
          return this.analyseSubwayJSFile(body);
        }
      }
      return this.analyseCommonFile(body);
    } catch (error) {
      console.log(error);
      return null;
    }

  }

  /**
   * Magix js、ts文件通用写法
   * @param body 
   */
  private static analyseCommonFile(body: any): ESFileInfo | null {
    let isMagixPage: boolean = false;
    let methodList = new Array<FnInfo>();
    body.forEach((declarationItem: any) => {
      if (declarationItem.type === 'ExportDefaultDeclaration' || declarationItem.type === 'ExpressionStatement') {
        let argumentArr;

        if (declarationItem.type === 'ExportDefaultDeclaration' &&
          declarationItem.declaration &&
          declarationItem.declaration.arguments) {
          //ts写法
          argumentArr = declarationItem.declaration.arguments;
        } else if (declarationItem.type === 'ExpressionStatement' &&
          declarationItem.expression &&
          declarationItem.expression.right &&
          declarationItem.expression.right.arguments
        ) {
          //js写法
          argumentArr = declarationItem.expression.right.arguments;
        }
        if (argumentArr) {
          argumentArr.forEach((argument: any) => {
            if (argument.type === 'ObjectExpression') {
              if (argument.properties) {
                argument.properties.forEach((prop: any) => {
                  if (prop.type === 'Property') {

                    if (prop.method || (prop.value && prop.value.type === 'FunctionExpression')) {
                      let fnInfo: FnInfo = new FnInfo();
                      fnInfo.fnName = prop.key.name ? prop.key.name : prop.key.value;
                      fnInfo.startColumn = prop.loc.start.column;
                      fnInfo.endColumn = prop.loc.end.column;
                      fnInfo.startLine = prop.loc.start.line;
                      fnInfo.endLine = prop.loc.end.line;
                      methodList.push(fnInfo);
                    } else {
                      if (prop.key.name === 'tmpl') {
                        isMagixPage = true;
                      }
                    }
                  }
                });
              }
            }
          });
        }

      }

    });
    if (isMagixPage) {
      let info: ESFileInfo = new ESFileInfo();
      info.functions = methodList;
      return info;
    }
    return null;

  }
  /**
   * 分析直通车es文件
   * @param body 
   */
  private static analyseSubwayESFile(body: any): ESFileInfo | null {
    let methodList = new Array<FnInfo>();
    body.forEach((declarationItem: any) => {
      if (declarationItem.type === 'ExportDefaultDeclaration' &&
        declarationItem.declaration &&
        declarationItem.declaration.body &&
        declarationItem.declaration.body.body) {
        let classBodyArr = declarationItem.declaration.body.body;
        classBodyArr.forEach((bodyItem: any) => {
          if (bodyItem.type === 'ClassProperty' && bodyItem.key.name === 'events') {
            if (bodyItem.value && bodyItem.value.type === 'ObjectExpression' && bodyItem.value.properties) {
              var typeArr = bodyItem.value.properties;
              typeArr.forEach((fnType: any) => {
                let propArr = fnType.value.properties;
                propArr.forEach((prop: any) => {
                  if (prop.method) {
                    let fnInfo: FnInfo = new FnInfo();
                    fnInfo.mxFnName = fnType.key.name;
                    fnInfo.fnName = prop.key.name;
                    fnInfo.startColumn = prop.loc.start.column;
                    fnInfo.endColumn = prop.loc.end.column;
                    fnInfo.startLine = prop.loc.start.line;
                    fnInfo.endLine = prop.loc.end.line;
                    methodList.push(fnInfo);
                  }
                });
              });
            }
          }
        });
      }
      else if (declarationItem.type === 'ExportDefaultDeclaration' &&
        declarationItem.declaration &&
        declarationItem.declaration.callee &&
        declarationItem.declaration.callee.property &&
        declarationItem.declaration.callee.property.name === 'extend' &&
        declarationItem.declaration.arguments) {
        var args = declarationItem.declaration.arguments;
        args.forEach((arg: any) => {
          arg.properties.forEach((property: any) => {
            if (property.key &&
              property.value &&
              property.value.properties &&
              property.key.name === 'events') {
              property.value.properties.forEach((prop: any) => {
                if (prop.value && prop.value.type === 'ObjectExpression' && prop.value.properties) {

                  prop.value.properties.forEach((p: any) => {
                    if (p.method && p.key && p.key.name) {
                      let fnInfo: FnInfo = new FnInfo();
                      fnInfo.mxFnName = prop.key.name;
                      fnInfo.fnName = p.key.name;
                      fnInfo.startColumn = p.loc.start.column;
                      fnInfo.endColumn = p.loc.end.column;
                      fnInfo.startLine = p.loc.start.line;
                      fnInfo.endLine = p.loc.end.line;
                      methodList.push(fnInfo);
                    }
                  });
                }
              });
            }
          });
        });
      }
    });
    let info: ESFileInfo = new ESFileInfo();
    info.functions = methodList;
    return info;
  }
  /**
   * 分析直通车js文件
   * @param body 
   */
  private static analyseSubwayJSFile(body: any): ESFileInfo | null {

   

    let methodList = new Array<FnInfo>();
    if (body.length !== 1) {
      return null;
    }
    body[0].expression.arguments.forEach((arg: any) => {
      if (arg.type === 'FunctionExpression' && arg.body && arg.body.body) {
        arg.body.body.forEach((bodyItem: any) => {
          if (bodyItem.type === 'ReturnStatement') {
            if (bodyItem.argument) {
              bodyItem.argument.arguments.forEach((argu: any) => {
                if (argu.type === 'ObjectExpression') {
                  if (argu.properties) {
                    argu.properties.forEach((objProp: any) => {
                      
                    });
                  }
                }
              });
            }
          }
        });
      }
    });
    body.forEach((declarationItem: any) => {
      if (declarationItem.type === 'ExportDefaultDeclaration' &&
        declarationItem.declaration &&
        declarationItem.declaration.body &&
        declarationItem.declaration.body.body) {
        let classBodyArr = declarationItem.declaration.body.body;
        classBodyArr.forEach((bodyItem: any) => {
          if (bodyItem.type === 'ClassProperty' && bodyItem.key.name === 'events') {
            if (bodyItem.value && bodyItem.value.type === 'ObjectExpression' && bodyItem.value.properties) {
              var typeArr = bodyItem.value.properties;
              typeArr.forEach((fnType: any) => {
                let propArr = fnType.value.properties;
                propArr.forEach((prop: any) => {
                  if (prop.method) {
                    let fnInfo: FnInfo = new FnInfo();
                    fnInfo.mxFnName = fnType.key.name;
                    fnInfo.fnName = prop.key.name;
                    fnInfo.startColumn = prop.loc.start.column;
                    fnInfo.endColumn = prop.loc.end.column;
                    fnInfo.startLine = prop.loc.start.line;
                    fnInfo.endLine = prop.loc.end.line;
                    methodList.push(fnInfo);
                  }
                });
              });
            }
          }
        });
      }
    });
    let info: ESFileInfo = new ESFileInfo();
    info.functions = methodList;
    return info;
  }
  private static analyseASTObject(astObj: any,isInMagix:boolean) {
   // console.log(JSON.stringify(astObj));
    if (!astObj.type) {
      return;
    }
    
    if (astObj.type === 'ExpressionStatement' &&
      astObj.expression &&
      astObj.expression.callee &&
      astObj.expression.callee.object &&
      astObj.expression.callee.object.name &&
      astObj.expression.callee.object.name === 'KISSY' &&
      astObj.expression.callee.property &&
      astObj.expression.callee.property.name &&
      astObj.expression.callee.property.name === 'add' &&
      astObj.expression.arguments) {
      astObj.expression.arguments.forEach((argument: any) => {
        this.analyseASTObject(argument,isInMagix);
      });
    }
    else if (astObj.type === 'FunctionExpression'&&
    astObj.body && 
    astObj.body.body
    ) {
      astObj.body.body.forEach((b:any)=>{
        this.analyseASTObject(b,isInMagix);
      });
    }
    else if (astObj.type === 'ObjectExpression' &&
      astObj.properties) {
      astObj.properties.forEach((prop: any) => {
        this.analyseASTObject(prop,isInMagix);
      });
    }
    else if ((astObj.type === 'ObjectProperty' || astObj.type === 'Property') &&
      astObj.key.name &&
      astObj.value) {
        if(isInMagix){
          console.log('key: ' + astObj.key.name);
        }
      this.analyseASTObject(astObj.value,isInMagix);
    }
    
    else if (astObj.type === 'ArrayExpression' &&
      astObj.elements ) {
        astObj.elements.forEach((item:any)=>{
          this.analyseASTObject(item,isInMagix);
        });
    }else if(astObj.type === 'FunctionDeclaration' &&
    astObj.body &&
    astObj.body.body ){
      astObj.body.body.forEach((b:any)=>{
        this.analyseASTObject(b,isInMagix);
      });
    }
    else if(astObj.type === 'BlockStatement' &&
      astObj.body ){
      astObj.body.forEach((b:any)=>{
        this.analyseASTObject(b,isInMagix);
      });
    }
    else if(astObj.type === 'ReturnStatement' &&
    astObj.argument  ){
        this.analyseASTObject(astObj.argument,isInMagix);
    }
    else if(astObj.type === 'CallExpression' 
     ){
       if(astObj.arguments && 
        astObj.callee && 
        astObj.callee.object &&
        astObj.callee.object.name &&
        astObj.callee.object.name === 'View' &&
        astObj.callee.property &&
        astObj.callee.property.name === 'extend'){
          astObj.arguments.forEach((arg:any)=>{
            this.analyseASTObject(arg,true);
          });
        }
     
     
    }
  }
}
