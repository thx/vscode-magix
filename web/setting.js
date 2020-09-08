new Vue({
    el: '#app',
    data: function () {
        return { visible: false, form: { nickname: '', rapType: '0', gogoCodePath: '' } }
    },
    mounted: function () {
        window.addEventListener('message', event => {
            const msg = event.data;
            let data = msg.data;
            if (msg.type === WEB_COMMAND.GET_NICKNAME) {
                Object.assign(this.form, data);
            } else if (msg.type === WEB_COMMAND.SAVE_NICKNAME) {
                this.$alert('保存成功', '温馨提示', {
                    confirmButtonText: '确定'
                }).then(() => {
                    VSCode.postMessage(WEB_COMMAND.CLOSE);
                });
            }
        });
        VSCode.postMessage(WEB_COMMAND.GET_NICKNAME);
    },
    methods: {
        saveNickname() {
            if (this.form.nickname === '') {
                this.$alert('花名不能为空', '温馨提示', {
                    confirmButtonText: '确定'
                });
                return;
            }
            if (this.form.gogoCodePath === '') {
                this.$alert('gogocode项目路径不能为空', '温馨提示', {
                    confirmButtonText: '确定'
                });
                return;
            }
            VSCode.postMessage(WEB_COMMAND.SAVE_NICKNAME, this.form);
        }
    }
});