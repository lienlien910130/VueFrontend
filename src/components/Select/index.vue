<template>
  <el-select 
  ref="selbud" 
  v-model="defaultvalue" 
  @change="currentSel" 
  placeholder="請選擇"
  filterable
  :disabled="isSelect"
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
      :label="item.getName()"
      :value="item.getID()"
      >
    </el-option>
  </el-select>
</template>

<script>

export default {
    name: 'Select',
    props:{
      selectData: {
          type: Array,
          required: true
      },
      title: {
          type: String
      },
      isSelect: {
          type: Boolean,
          default: false
      }
    },
    data() {
      return {
        defaultvalue: '',
      }
    },
    watch: {
      selectData:{
        handler:async function(){
          if(this.title == 'Building' || this.title == 'GraphicFloor'){
            this.defaultvalue = this.selectData[0].getID()
            this.currentSel(this.defaultvalue)
          }else if(this.title == 'contactunit' || this.title == 'equipment'){
            this.defaultvalue = 'all'
          }
        },
        immediate:true
      }
    },
    methods: {
        currentSel(select){
          const tempData = this.selectData.filter((item, index) => 
              item.id == select )
          this.$emit('handleSelect', tempData.length>0 ? tempData[0] : undefined)
        }
    },
  }
</script>

<style lang="scss" scoped>

</style>