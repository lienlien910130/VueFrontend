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
      data:{

      },
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
        defaultvalue: ''
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
          
          // if(content !== undefined){
          //   this.blockData = array.filter((item, index) => 
          //   item.type == content.type )
          // }else{
          //   this.blockData = array
          // }
          const tempData = this.selectData.filter((item, index) => 
              item.id == select )
          console.log('select=>'+JSON.stringify(tempData))
          // this.$emit('subChangeOption', tempData)

          // var filtered = this.options.filter(function(item) {
          //   if(item.id == selVal) return true
          //   return false;
          // });

          // this.$emit('setselect', selVal)
          // this.$emit('setfloor', filtered[0].up,filtered[0].down)
        }
    },
  }
</script>

<style lang="scss" scoped>

</style>