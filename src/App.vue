<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { setDevice } from '@/utils/auth'
export default {
  name: 'App',
  async created(){
    setDevice(this._isMobile())
    // this.deviceInfo()
    const _this = this
    this.$messaging.onMessage(function (payload) {
        console.log(payload)
        //如果可以顯示通知就做顯示通知
        if (Notification.permission === 'granted') {
          if (!("Notification" in window)) {
            console.log("不支援通知");
          }
          else if (Notification.permission === "granted") { //顯示訊息
            _this.showMessage(payload);
          }
          else if (Notification.permission !== 'denied' || Notification.permission === "default") {
              Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                  _this.showMessage(payload);
                };
              });
          };
        }
    });
  },
  computed: {
    ...Vuex.mapGetters([
        'wsmsg',
        'wsuserId',
        'buildingid',
        'id',
        'physicalInfos'
    ])
  },
  watch: {
    id:{ //有登入才連線ws
        handler:async function(){
          if(this.id !== undefined ){
            await this.initsocket()
          }
        },
        immediate:true
    }
  },
  methods: {
    async initsocket(){
      if ("WebSocket" in window){
        this.$socket.initWebSocket()
        await this.getMToken()
      }else{
        console.log("您的瀏覽器不支援 WebSocket!")
      }
    },
    async getMToken(){
      const _this = this
      this.$messaging.getToken({vapidKey: 'BMu0NsMpDOJfRkGUVC1kwS--OOjkM1y7x8j9BJj86J505uDUeUHI05zTqzoj_fM896_QKSLGd-n4Xsq1md5QBDk'})
        .then(async function (currentToken) {
              if (currentToken) {
                console.log('currentToken',currentToken)
                var OsModel = _this.deviceInfo()
                await _this.$store.dispatch('user/setMessageToken', OsModel, currentToken)
                _this.$socket.initProcessWebSocket()
              } else {
                //顯示訂閱的視窗
                console.log('no token')
                Notification.requestPermission(async function (permission) {
                  console.log(permission)
                    if (permission === "granted") {
                      await _this.getMToken()
                    };
                  });
              }
        })
        .catch(function (err) {
              console.log('err',err)
        });
    },
    deviceInfo(){
       Array.prototype.contains = function(needle) {
        for (i in this) {
          if (this[i].indexOf(needle) > 0)
            return i;
        }
        return -1;
      }
      var device_type = navigator.userAgent;
      var md = new MobileDetect(window.navigator.userAgent)
      var os = md.os();
      var model = "";
      if(this._isMobile() == null){ //不是手機：作業系統+瀏覽器名稱版本
        os = this.getOS()
        model = this.getBrowser()[0] + this.getBrowser()[1]
      }else{ //手機版本+型號
        if (os == "iOS") {//ios
          os = md.os() + md.version("iPhone");
          model = md.mobile();  //如何準確獲取手機iphone型號
        } else if (os == "AndroidOS") {//Android
            os = md.os() + md.version("Android");
            var sss = device_type.split(";");
            var i = sss.contains("Build/");
            if (i > -1) {
              model = sss[i].substring(0,sss[i].indexOf("Build/"));
            }
            model = model + md.versionStr('Build')
        }
      }
      console.log(os+'//'+model)
      return os+','+model
    },
    getBrowser(){
      let types = ['edge','firefox','chrome','safari','opera ']
      let userAgent = navigator.userAgent.toLocaleLowerCase()
      var res=[]
      types.forEach(element => {
        if(userAgent.indexOf(element)>0){
          let rule= `${element}`+"\\/([\\d.]+)"
          res.push(element)
          res.push(userAgent.match(rule)[1]) }
      })
      if(res.indexOf('chrome') >-1 && res.indexOf('safari') >-1){
        if(res.length===4){
          let temp=[]
          temp.push('chrome')
          temp.push(res[res.indexOf('chrome')+1])
          return temp
        }else{
          res.splice(res.indexOf('chrome'),2)
          res.splice(res.indexOf('safari'),2)
          return res
        }
      }else{
        return res
      }
    },
    getOS(){
        var sUserAgent = navigator.userAgent;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac) return "Mac";
        var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
        if (isUnix) return "Unix";
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        if (isLinux) return "Linux";
        if (isWin) {
            var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
            if (isWin2K) return "Win2000";
            var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
            if (isWinXP) return "WinXP";
            var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
            if (isWin2003) return "Win2003";
            var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
            if (isWinVista) return "WinVista";
            var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            if (isWin7) return "Win7";
            var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
            if (isWin10) return "Win10";
        }
        return "other";
    },
    _isMobile(){ //不是的話返回'null'
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag;
    },
    showMessage(payload){
		    console.log('onMessage: ', payload);
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
          body: payload.notification.body,
          icon: '/static/icon.png',
          vibrate: [100, 50, 100],
          data: {
              dateOfArrival: Date.now()
          },
          // actions: [
          //     {
          //         action: "confirm", title: "Go interact with this!"
          //     },
          //     {
          //         action: "close", title: "Ignore"
          //     }
          //]
        };
        navigator.serviceWorker.getRegistration().then(reg => {
          reg.showNotification(notificationTitle, notificationOptions);
          console.log('displayNotification');
        });
		}
  }
}
</script>
<style scoped>
#app::-webkit-scrollbar {
width: 0 !important;
}
#app::-webkit-scrollbar {
width: 0 !important;height: 0;
}

</style>

<style lang="scss">

.editor-container{
  padding: 15px;
  background-color: rgb(209, 226, 236);
  position: relative;
  min-height: calc(100vh - 50px);

  .block-wrapper{
    background: #fff;
    padding: 15px 15px;
    height: 100%;
  }
  .floornotMobile{
    background: #fff;
    padding: 10px;
    height: 750px;
    overflow-x:hidden;
    overflow-y:auto;
  }
}

.el-upload-list{
  height:500px;
  overflow-y: auto;
  overflow-x: hidden;
}
.el-form-item{
  margin-bottom: 18px;
}
.el-form-item__label{
  font-size: 18px;
}
.el-form-item__content{
  font-size: 18px;
}
.el-button--primary{
  background:rgb(0,140,214);
  color:white;
}
.el-button--info{
  background:white;
  color:black;
}
.el-button--success{
  background:rgb(171,205,3);
  color:white;
}
.el-button+.el-button{
  margin-left: 5px;
}
.el-button{
  margin: 5px;
}
.el-tabs--border-card>.el-tabs__header{
  background-color:rgb(237,237,237);
}
.el-link{
  font-size: 16px;
}

.el-table .cell{
  font-size: 18px;
}
.el-checkbox__label{
  font-size: 18px;
}
.el-message-box {
    width: 400px;
}

.el-tree {
  color: black;
  background: transparent;
  font-size: 20px;
  margin:10px;
}
.custom-tree-node{
    margin: 5px;
    width:100%;
}
/* 设置三角形图标的颜色 */
.el-tree-node__expand-icon {
  color: black;
  font-size: 25px;
}

/* 树节点鼠标悬浮式改变背景色，字体颜色 */
.el-tree-node__content:hover {
  background-color: rgb(202, 191 , 220);
  color: rgb(29, 4, 4);
}

/* 改变节点高度 */
.el-tree-node__content {
  height: 30px;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: lightgray;
  color:black;
}
.el-tree-node .is-focusable .is-checked{
background-color:rgb(147, 180 , 197);
  color: black;
}
/* 设置树形最外层的背景颜色和字体颜色 */
.el-tree {
  color: black;
  background: transparent;
  font-size: 20px;
  margin:10px;
}
.custom-tree-node{
    margin: 5px;
    width:100%;
}
/* 设置三角形图标的颜色 */
.el-tree-node__expand-icon {
  color: black;
  font-size: 25px;
}

/* 树节点鼠标悬浮式改变背景色，字体颜色 */
.el-tree-node__content:hover {
  background-color: rgb(202, 191 , 220);
  color: rgb(29, 4, 4);
}

/* 改变节点高度 */
.el-tree-node__content {
  height: 30px;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: lightgray;
  color:black;
}
.el-tree-node .is-focusable .is-checked{
background-color:rgb(147, 180 , 197);
  color: black;
}


@media (max-width: 767px) {
  .el-message-box{
    width:90%
  }
}

.jtk-overlay {
    cursor: pointer;
    color: #4A4A4A;
}

/* 连线中的label 样式*/
.jtk-overlay.flowLabel:not(.aLabel) {
    padding: 4px 10px;
    background-color: white;
    color: #565758 !important;
    border: 1px solid #E0E3E7;
    border-radius: 5px;
    font-size: 12px;
}

/* label 为空的样式 */
.emptyFlowLabel {
}


::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #E0E3E7;
  height: 20px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

</style>
