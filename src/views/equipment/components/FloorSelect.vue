<template>
  <el-select ref="selfloor" v-model="dafaultvalue" @change="currentSel" placeholder="請選擇樓層">
    <el-option
      v-for="(item,index) in options"
      :key="index"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props:['options'],
    data() {
      return {
        dafaultvalue: ''
      }
    },
    watch: {
    },
    mounted() {
    },
    methods: {
        currentSel(selVal){
          this.$emit('setdevice', selVal)
        }
    },
  }
</script>

<style lang="scss" scoped>

</style>