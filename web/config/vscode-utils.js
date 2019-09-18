var vscode;
(function () {
    try {
        vscode = acquireVsCodeApi();
    } catch (error) {
        
    }

})();
var VSCode = {
    init:function(){
        if(vscode){
            vscode.postMessage({data:'',type:'web.page.init'});
        }
    },
    postMessage:function(commandType,data){
        if (vscode) {
            vscode.postMessage({ data: data || '', type: commandType });
        }
    }
}