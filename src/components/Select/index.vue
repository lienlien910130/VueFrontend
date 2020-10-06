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
      :value="index"
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
        defaultvalue: ''
      }
    },
    watch: {
        selectData: function(){
          if(this.title == 'Building'){
            this.defaultvalue = 0
            this.$store.dispatch('building/setbuildingid',this.selectData[this.defaultvalue].id)
          }
          
          // this.$emit('setselect', this.options[0].value)
          // this.$emit('setfloor', this.options[0].up,this.options[0].down)
            // if(this.options.length === this.building.length){
            //     this.dafaultvalue = this.options[0].label
            //     this.$emit('setselect', this.options[0].value)
            // }
        }
    },
    methods: {
        currentSel(){
          const tempData = this.selectData[this.defaultvalue]
          this.$emit('subChangeOption', tempData)

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