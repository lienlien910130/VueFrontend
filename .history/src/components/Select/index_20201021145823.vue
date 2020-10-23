<template>
  <el-select ref="selbud" v-model="defaultvalue" @change="currentSel" placeholder="請選擇">
    <el-option
    v-if="title=='ContactUnit' "
    label="全部"
    key=""
    value="-1"
    ></el-option>
    <el-option
      v-for="(item,index) in selectData"
      :key="index"
      :label="item.label"
      :value="item.id"
      >
    </el-option>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props:{
      selectData: {
          type: Array,
          required: true
      },
      title: {
          type: String
      },
    },
    data() {
      return {
        defaultvalue: '',
      }
    },
    watch: {
        selectData: function(){
          if(this.title == 'Building'){
            this.defaultvalue = 0
            this.$store.dispatch('building/setbuildingid',this.selectData[this.defaultvalue].id)
          }
          
        }
    },
    methods: {
        currentSel(select){
          const tempData = this.selectData.filter((item, index) => 
              item.id == select )
          this.$emit('subChangeOption', tempData>0 ? tempData : undefined)
        }
    },
  }
</script>

<style lang="scss" scoped>

</style>