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
