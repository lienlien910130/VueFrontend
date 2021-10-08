<template>
  <div  class="editor-container">
    <div v-if="device == 'desktop'" class="wscn-http404">
      <div class="pic-404">
        <img v-if="isiPad == false"  class="pic-404__parent" src="@/assets/image/404-d.png" alt="404">
        <img v-else  class="phone" src="@/assets/image/404-p.png" alt="404" style="width:100%">
      </div>
      <img v-if="isiPad == false" class="back" src="@/assets/image/back.png" alt="back" @click="backToIndex">
      <img v-else   class="backipad" src="@/assets/image/back.png" alt="back" @click="backToIndex">
    </div>
    <div v-else>
      <img  class="phone" src="@/assets/image/404-p.png" alt="404" style="width:100%">
       <img  class="phoneback" src="@/assets/image/back.png" alt="back" @click="backToIndex">
    </div>
  </div>
  
</template>

<script>
// const Vuex = require('vuex')

export default {
  name: 'Page404',
  computed: {
      ...Vuex.mapGetters([
        'device'
      ])
  },
  data(){
    return{
      isiPad:false
    }
  },
  mounted() {
    const { body } = document
    const rect = body.getBoundingClientRect()
    if(rect.width == '1024'){
      this.isiPad = true
    }
    
  },
  methods:{
    backToIndex(){
       this.$router.push({path: '/'});
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http404-container{
  transform: translate(-50%,-50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
.phoneback{
  top:80%;
  left: 30%;
  width: 150px;
  position: absolute;
}
.wscn-http404 {
  position: relative;
  height: calc(100vh - 80px);
  padding: 0 50px;
  overflow: hidden;
  .pic-404 {
    position: relative;
    overflow: hidden;
    &__parent {
      width: 100%;
    }
    &__child {
      position: absolute;
      &.left {
        width: 80px;
        top: 17px;
        left: 220px;
        opacity: 0;
        animation-name: cloudLeft;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      &.mid {
        width: 46px;
        top: 10px;
        left: 420px;
        opacity: 0;
        animation-name: cloudMid;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1.2s;
      }
      &.right {
        width: 62px;
        top: 100px;
        left: 500px;
        opacity: 0;
        animation-name: cloudRight;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      @keyframes cloudLeft {
        0% {
          top: 17px;
          left: 220px;
          opacity: 0;
        }
        20% {
          top: 33px;
          left: 188px;
          opacity: 1;
        }
        80% {
          top: 81px;
          left: 92px;
          opacity: 1;
        }
        100% {
          top: 97px;
          left: 60px;
          opacity: 0;
        }
      }
      @keyframes cloudMid {
        0% {
          top: 10px;
          left: 420px;
          opacity: 0;
        }
        20% {
          top: 40px;
          left: 360px;
          opacity: 1;
        }
        70% {
          top: 130px;
          left: 180px;
          opacity: 1;
        }
        100% {
          top: 160px;
          left: 120px;
          opacity: 0;
        }
      }
      @keyframes cloudRight {
        0% {
          top: 100px;
          left: 500px;
          opacity: 0;
        }
        20% {
          top: 120px;
          left: 460px;
          opacity: 1;
        }
        80% {
          top: 180px;
          left: 340px;
          opacity: 1;
        }
        100% {
          top: 200px;
          left: 300px;
          opacity: 0;
        }
      }
    }
  }
  .back{
    top: 40%;
    left: 65%;
    position: absolute;
    width: 200px;
    height: auto;
    cursor: pointer;
  }
  .backipad{
    top: 92%;
    left: 40%;
    position: absolute;
    width: 200px;
    height: auto;
    cursor: pointer;
  }
}
</style>
