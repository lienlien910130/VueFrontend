<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    // getWsMsg() {
    //     return this.$store.state.websocket.msg
    // }
  },
  created(){
　　//在頁面載入時讀取sessionStorage裡的狀態資訊
    //this.initsocket()
    if (localStorage.getItem("store") ) {
      this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    }
    //在頁面重新整理時將vuex裡的資訊儲存到sessionStorage裡
    // window.addEventListener("beforeunload",()=>{
    //   console.log('beforeunload=>'+JSON.stringify(this.$store.state))
    //   localStorage.setItem("store",JSON.stringify(this.$store.state))
    // })
    window.addEventListener('pagehide', () => {
     sessionStorage.setItem('store', JSON.stringify(this.$store.state))
   })
    
  },
  watch: {
    //監聽收來的訊息
    // getWsMsg: function (data, val) {
    //   console.log('data=>'+data); 
    // }      
  },
  methods: {
    initsocket(){
      //this.localSocket()
      if ("WebSocket" in window){
        this.$socket.initWebSocket();
      }else{
        console.log("您的瀏覽器不支援 WebSocket!");
      }
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