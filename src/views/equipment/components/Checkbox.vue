<template>
  <el-checkbox-group v-model="checkList">
      <el-checkbox 
      v-for="(item,index) in optionData"
      :key="index"
      :label="item"
      style="display:block;"
      ></el-checkbox>
  </el-checkbox-group>
</template>

<script>
  export default {
    props:{
      optionData: {
          type: Array,
          required: true
      },
      title: {
          type: String
      },
    },
    data () {
      return {
        options:['a','b','c','d','e','f'],
        checkList: ['b','e']
      };
    }
  };
</script>

<style lang="stylus" scoped>

</style>