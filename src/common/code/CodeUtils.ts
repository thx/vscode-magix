import { isString } from "util";

export default class CodeUtils {
    public static getElementsByTagName(root: any, tag: string): any {
        let find:any[] = [];
        this.getElsByTag(root, tag, find);
        return find;
    }
    public static getString(element:any){
        let strArr:string[] = [];
        this.getStr(element,strArr);
        return strArr;
    }
    private static getStr(element:any,strArr:string[]){
        if (Array.isArray(element)) {
            element.forEach(item => {
                this.getStr(item, strArr);
            });
        } else if (typeof (element) === 'object') {
            if (element.content) {
                this.getStr(element.content, strArr);
            }
        } else if (isString(element)) {
            const s = element.trim();
            if (s) {
                strArr.push(s);
            }
        }
    }
    private static getElsByTag(root: any, tag: string, find: any[]) {
        if (Array.isArray(root)) {
            root.forEach(element => {
                this.getElsByTag(element, tag, find);
            });
        } else if (typeof (root) === 'object') {
            if (root.tag === tag) {
                find.push(root);
            } else if (root.content) {
                this.getElsByTag(root.content, tag, find);
            }
        }
    }
    
}