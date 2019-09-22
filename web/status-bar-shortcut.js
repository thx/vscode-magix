new Vue({
  el: '#app',
  data: function () {
    return {
      hasError: false,
      alertType: 'success',
      alertDes: '设置StatusBar快捷方式',
      nickname: '',
      list: []
    }
  },
  mounted: function () {
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    window.addEventListener('message', event => {
      const msg = event.data;
      let data = msg.data;
      if (msg.type === WEB_COMMAND.GET_SHORTCUT) {
        if (data.ok) {
          this.nickname = data.nickname;
          //showMsg(JSON.stringify(data));
          if (data && data.list && data.list.length > 0) {
            this.list = data.list;
          } else {
            this.list.push({ name: 'Diamond', url: 'http://diamond.alibaba-inc.com/diamond-ops/static/pages/config/index.html' });
          }
        } else {
          this.alertType = 'error';
          this.alertDes = data.msg;
          this.hasError = true;
        }
        loading.close();
      } else if (msg.type === WEB_COMMAND.SAVE_SHORTCUT) {
        if (data.ok) {
          this.$alert('保存成功,重启VSCode后StatusBar生效', '温馨提示', {
            confirmButtonText: '确定'
          }).then(() => {
            VSCode.postMessage(WEB_COMMAND.CLOSE);
          });
        } else {
          this.alertType = 'error';
          this.alertDes = data.msg;
          this.hasError = true;
        }
      }
    });
    //初始化，获取配置信息
    VSCode.postMessage(WEB_COMMAND.GET_SHORTCUT);


  },
  methods: {

    addItem() {
      this.list.push({ name: '', url: '' });
    },
    deleteItem(e, index) {
      this.list.splice(index, 1);
    },
    save(e) {
      let data = { nickname: this.nickname, list: this.list };

      VSCode.postMessage(WEB_COMMAND.SAVE_SHORTCUT, data);
    }
  }
});
