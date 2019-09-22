var vscode;
(function () {
    try {
        vscode = acquireVsCodeApi();
    } catch (error) {

    }

})();
var VSCode = {
    init: function () {
        if (vscode) {
            vscode.postMessage({ data: '', type: 'web.page.init' });
        }
    },
    postMessage: function (commandType, data) {
        if (vscode) {
            vscode.postMessage({ data: data || '', type: commandType });
        }
    }
}
var showMsg = function (msg) {
    var de = document.getElementById('showMsg');
    if (!de) {
        de = document.createElement("DIV");
        de.id = 'showMsg';
        document.body.appendChild(de);
    }
    de.innerHTML = de.innerHTML + "<br/>" + msg;
}