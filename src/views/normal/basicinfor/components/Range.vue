<template>
<div class="frange">
  
  <div v-if="!mobile"
  >
    <div class="rangediv">
      <el-link 
        v-for="item in rangeOptions" 
        :key="item.key"
        :class="[{selected:item.id == selectRange}]" 
        type="primary"
        @click="onSelectRange(item.id)">{{ item.name }}
      </el-link>
    </div>
    <div 
      class="floordiv" 
      v-for="item in divFloor" 
      :key="item.id" 
      @click="onSelectFloor(item)"
      @mouseover="addClass(item.getID())"
      @mouseleave="removeClass(item.getID())"
      :class="[{ active:classenable && item.getID() == current },{ select:item.getID() == selectFloor }]"
    >
      <span>{{ item.getName() }} </span>
      <!-- <span v-if="item.floors > 0 ">{{ item.floors }} F</span>
      <span v-else>B{{ -(item.floors) }} F</span> -->
    </div>
  </div>
  <div v-else>
    <Select 
      style="margin-bottom: 20px;width:100%"
      :selectData="buildingfloors" 
      v-on:handleFloorSelect="handleFloorSelect">
    </Select>
  </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import Floors from '@/object/floors'

export default {
  data() {
    return {
      rangeOptions : [],
      upFloors:[],
      downFloors:[],
      divFloor:[],
      selectRange:'0',
      selectFloor:'',
      current:0,
      classenable:false
    }
  },
  computed:{
    ...mapGetters([
        'buildingfloors'
    ]),
    mobile(){
      if (this.$store.state.app.device === 'mobile') {
        return true
      } else {
        return false
      }
    }
  },
  watch:{
    buildingfloors:{
      handler:async function(newValue,oldValue){
        var array = this.buildingfloors
        if(this.buildingfloors.length>0 && oldValue == undefined ){ //第一次建立
          this.upFloors = array.filter((item,index) => 
          item.getName().includes("地下") == false)
          this.downFloors = array.filter((item,index) => 
          item.getName().includes("地下") == true)
          this.setRange()
        }else{ //修改平面圖
          this.upFloors = array.filter((item,index) => 
          item.getName().includes("地下") == false)
          this.downFloors = array.filter((item,index) => 
          item.getName().includes("地下") == true)
          this.onSelectRange(this.selectRange)
        }
      },
      immediate:true
    },
  },
  methods: {
    setRange(){
      this.rangeOptions = []
      if(this.upFloors.length >0){
        var _count = Math.ceil(this.upFloors.length / 10)
        for(var i=1;i<=_count;i++){
          var start = this.upFloors[i*10-10].getName()
          var end = i == _count ? this.upFloors[this.upFloors.length-1].getName() : 
          this.upFloors[i*10-1].getName()
          
          var _temp = {
              id:i,
              name:start + '~'+ end
          }
          this.rangeOptions.push(_temp)
        }
      }
      if(this.downFloors.length >0){
          var _temp = {
            id:0,
            name:'地下樓層'
        }
        this.rangeOptions.unshift(_temp)
      }
      this.onSelectRange(0)
    },
    onSelectRange(val){
      this.selectRange = val
      if(val == 0){
        this.divFloor = this.downFloors
      }else{
        const pageList = this.upFloors.filter((item, index) => 
        index < 10 * val && index >= 10 * (val - 1))
        this.divFloor = pageList
      }
    },
    onSelectFloor(val) {
      this.selectFloor = val.getID()
      this.$emit('handleBuildingFloorSelect',val)
    },
    addClass(index){
        this.classenable = true
        this.current = index
    },
    removeClass(index){
        this.classenable = false
        this.current = index
    },
    handleFloorSelect(val){
      this.selectFloor = val[0].id
      this.$emit('handleBuildingFloorSelect',this.selectFloor)
    }
  }
}
</script>

<style lang="scss" scoped>
  .floordiv{
    width: 100% ;
    height: 50px;
    background-color:rgb(219,231,237);
    border: 1px solid black;
    text-align: center;
    vertical-align: middle;
    color: #606266;
    font-weight:bold;
    font-size: 30px;
    line-height:50px;
  }
  .active {
    background: rgb(202, 191 , 220);
    cursor: pointer;
  }
  .select {
    background: rgb(147, 180 , 197);
    color: white;
  }

  .rangediv{
    margin-bottom: 20px;
    width: 100%;
    text-align: center;
    .el-link{
      width: auto;
      margin: 0px 5px;
      color: #606266;
    }
    .selected {
      color: red;
    }
  }
  
</style>