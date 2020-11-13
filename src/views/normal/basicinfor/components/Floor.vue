<template>
<div>
  <p v-if="isChoose == false">請選擇樓層</p>
  <div v-else v-loading="loading" >
    <p v-if="imagesrc=='-1'">請至相關資料設定樓層平面圖</p>
    <img   v-else class="img" :src="imagesrc"/>
  </div>
  
</div>
</template>

<script>

export default {
  props: ['isChoose','floorImage','imagesrc','loading'],
  data() {
    return {
      image:''
    }
  },
  mounted() {
    //this.getImg(this.floorImage)
  },
  watch: {
    
  },
  methods: {
    getImg(id){
      if(id !== null){
         this.$api.files.apiGetFloorImage(id).then(response=> {
          const bufferUrl = btoa(new Uint8Array(response).reduce((data, byte) => data + String.fromCharCode(byte), ''));
          this.image = 'data:image/png;base64,' + bufferUrl;
        }) 
      }else{
        this.image = '-1'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.img {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  max-width: 100%;
}
</style>
