<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  async created(){
    this.initsocket()
    this.register()
  },
  methods: {
    initsocket(){
      //this.localSocket()
      if ("WebSocket" in window){
        this.$socket.initWebSocket()
      }else{
        console.log("您的瀏覽器不支援 WebSocket!")
      }
    },
    register(){
      if('serviceWorker' in navigator){
          navigator.serviceWorker
                .register('service-worker.js')
                .then(function(){
                    console.log('Service Worker 註冊成功')
                }).catch(function(error) {
                    console.log('Service worker 註冊失敗:', error)
                });
        } else {
          avalon.log('瀏覽器不支援 serviceWorker')
        }
        window.addEventListener('beforeinstallprompt', function(e) {
            e.userChoice.then(function(choiceResult) {
                if(choiceResult.outcome == 'dismissed') {
                    console.log('user取消安裝至桌面')
                }
                else {
                    console.log('user接受安裝至桌面')
                }
            })
        })
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

<style>
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
.editor-container{
  padding: 15px;
  background-color: rgb(209, 226, 236);
  position: relative;
  min-height: calc(100vh - 155px);
  max-height: calc(100vh - 155px);
  overflow-y: auto;
  overflow-x: hidden;
}
.el-table .cell{
  font-size: 18px;
}
.el-checkbox__label{
  font-size: 18px;
}
/* .el-form-item__label{
  font-size: 16px;
} */
</style>