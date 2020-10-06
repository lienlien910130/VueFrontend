<template>
  <el-carousel  trigger="click"  indicator-position="outside">
    <el-carousel-item v-for="item in page" :key="item">
      <div 
      v-for="item in 4" :key="item" 
      class="elev">
       <span class="floor">{{ item }}</span>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
export default {
  computed: {
    page:function(){
      const p = this.list.length / 4
      return p > 1 ? Math.ceil(p) : 1
    }
  },
  data() {
    return {
      list:[
        {name:'a'},{name:'b'},{name:'a'},{name:'b'},{name:'a'},{name:'b'}
      ]
    }
  },
}

</script>
<style lang="scss" scoped>
.el-carousel{
  text-align:center;
  vertical-align: middle;
  height: 350px;
}

  .el-carousel__item {
    background-color: #d3dce6;
    line-height: 300px;

    .elev {
      text-align:center;
      vertical-align: middle;
      margin:5px;
      background-color: red;
      width: 100px;
      height: 100px;
      display: inline-block;
      line-height: 100px;

      .floor{
        
      }
    }
  }
    
  
</style>