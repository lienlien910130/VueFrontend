<template>
<div>
  <el-select v-model="value1" multiple placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>

  <el-select
    v-model="value2"
    multiple
    collapse-tags
    style="margin-left: 20px;"
    placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-button @click="ok">test</el-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: 'a',
          label: '黄金糕'
        }, {
          value: 'b',
          label: '双皮奶'
        }, {
          value: 'c',
          label: '蚵仔煎'
        }, {
          value: 'd',
          label: '龙须面'
        }, {
          value: 'e',
          label: '北京烤鸭'
        }],
        value1: ['a','b','c'],
        value2: []
      }
    },methods:{
        ok(){
            console.log(this.value1+'/'+this.value2)
        }
    }
  }
</script>