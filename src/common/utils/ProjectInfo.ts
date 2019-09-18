import * as from 'vscode';

export class  ProjectInfo{
    private static info:Info;
    /**
     * 扫描当前目录
     */
    public static scanProject(rootPath:string){
        if(rootPath){

        }
        this.info = new Info();
    }
    public static getInfo():Info{
        return this.info;
    }
}
export class Info{
    constructor(){
        this.rootPath = '';
        this.appName = '';
        this.rap = '';
    }
    rootPath:string;
    appName:string;
    rap:string;
}
