<template>
  <el-select 
  ref="selbud" 
  v-model="defaultvalue" 
  @change="currentSel" 
  placeholder="請選擇"
  filterable
  >
    <el-option
    v-if="title=='contactunit' || title=='equipment' "
    label="全部"
    key=""
    value="all"
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
            this.defaultvalue = this.selectData[0].id
          }else if(this.title == 'contactunit' || this.title == 'equipment'){
            this.defaultvalue = 'all'
          }
        }
    },
    methods: {
        currentSel(select){
          const tempData = this.selectData.filter((item, index) => 
              item.id == select )
          this.$emit('handleSelect', tempData.length>0 ? tempData : undefined)
        }
    },
  }
</script>

<style lang="scss" scoped>

</style>