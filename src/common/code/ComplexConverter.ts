import { ComponentInfo, Type } from "../../model/componentInfo";
import CodeUtils from "./CodeUtils";

export class TableConverter{
    public static convert(element: any):ComponentInfo|null {
        let theadArr = CodeUtils.getElementsByTagName(element, 'thead');
        let thArr, tdArr;
        if (theadArr.length > 0) {
            thArr = CodeUtils.getElementsByTagName(theadArr[0], 'th');
            let tbodyArr = CodeUtils.getElementsByTagName(element, 'tbody');
            if (tbodyArr.length > 0) {
                let trArr = CodeUtils.getElementsByTagName(tbodyArr[0], 'tr');
                for (let i = 0; i < trArr.length; i++) {
                    tdArr = CodeUtils.getElementsByTagName(trArr[i], 'td');;
                    if (tdArr.length === thArr.length) {
                        break;
                    }
                }
            }
        }
        const columns = [];
        if(thArr && tdArr){
           
            for (let i = 0; i < thArr.length; i++) {
                const thStrArr = CodeUtils.getString(thArr[i]);
                const tdStrAtt = CodeUtils.getString(tdArr[i]);
                
                columns.push({
                    title: thStrArr.join(' '),
                    dataIndex: this.getField(tdStrAtt)
                });
            }
            
        }
        if(columns.length === 0){
            return null;
        }
        let componentInfo: ComponentInfo = new ComponentInfo();
        componentInfo.type = Type.Complex;
        componentInfo.importInfo = `import {  MuxTable } from '@alife/mux-components'
        const { Column } = MuxTable`;
        componentInfo.content = this.columnsToCode(columns);
        return componentInfo;
        
    }
    private static getField(strings:string[]){
        const reg = /\.(\w+)[\s\)\}]/i;
        
        for (let i = 0; i < strings.length; i++) {
            const s = strings[i];
            if (s == '--' || s == '-') {
                strings[i] = '';
            } else {
                const match = s.match(reg);
                if (match && match.length > 1) {
                    let m = match[1];
                    strings[i] = m;
                }else{
                    strings[i] = '';
                }
            }
        }
        
        return strings.join(' ');
        
    }
    private static columnsToCode(columns:any[]){
        let code:string = ` <MuxTable dataSource={list}
        loading={loading}
        density="comfortable">\r`;
        columns.forEach(c=>{
            code+= `<Column
            title="${c.title}"
            dataIndex="${c.dataIndex}"
          />\r`;
        });
        code+=`</MuxTable>`;
        return code;
    }
}
