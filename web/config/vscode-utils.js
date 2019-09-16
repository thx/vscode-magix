var vscode;
(function () {
  vscode = acquireVsCodeApi();
})();
var VSCode = {
    init:function(){
        vscode.postMessage({data:'',type:'web.page.init',page:'setting'});
    }
}