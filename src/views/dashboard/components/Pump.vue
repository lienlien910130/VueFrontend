<template>
  <el-row>
    <div
    v-for="(item,index) in list"
    :key="index"
    >
        <span>{{ item.name }}</span>
        <el-switch
            v-model="item.value"
            active-color="#13ce66"
            inactive-color="#ff4949">   
        </el-switch> 
   </div>
    
  </el-row>
</template>


<script>
  export default {
    data() {
      return {
          list:[
              {value:false,name:'室內消防栓'},
              {value:true,name:'自動撒水'},
              {value:false,name:'泡沫'},
              {value:false,name:'水霧'},
              {value:false,name:'連結送水管'}
          ]
      }
    }
  };
</script>