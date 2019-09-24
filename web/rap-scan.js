new Vue({
    el: '#app',
    data: function () {
        return {
            rootPath: '',
            modelsPath: '',
            loading: false,
            btnText:'开始扫描',
            show:false
        }
    },
    mounted: function () {

        window.addEventListener('message', event => {
            const msg = event.data;
            let data = msg.data;
            if (msg.type === WEB_COMMAND.FINISH_SCAN_RAP) {
                this.loading = false;
                this.btnText = '重新扫描';
                this.show = true;
                //showMsg(JSON.stringify(data));
            }else if (msg.type === WEB_COMMAND.GET_PROJECT_INFO) {
                this.rootPath = data.rootPath;
                this.modelsPath = data.modelsPath;
                //showMsg(JSON.stringify(data));
            }
        });
        //初始化，获取工程信息
        VSCode.postMessage(WEB_COMMAND.GET_PROJECT_INFO);

    },
    methods: {
        startScan() {
            if(this.loading){
                return;
            }
            VSCode.postMessage(WEB_COMMAND.START_SCAN_RAP);
            this.loading = true;
            this.btnText = '扫描中...';
        },
        openEditor(){
            VSCode.postMessage(WEB_COMMAND.OPEN_EDITOR);
        }
    }
});
