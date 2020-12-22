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
      @click="onSelectFloor(item.id)"
      @mouseover="addClass(item.id)"
      @mouseleave="removeClass(item.id)"
      :class="[{ active:classenable && item.id == current },{ select:item.id == selectFloor }]"
    >
      <span v-if="item.floors > 0 ">{{ item.floors }} F</span>
      <span v-else>B{{ -(item.floors) }} F</span>
    </div>
  </div>
  <div v-else>
    <FloorSelect 
      style="margin-bottom: 20px;width:100%"
      :selectData="allFloor" 
      v-on:handleFloorSelect="handleFloorSelect">
    </FloorSelect>
  </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  components:{
    FloorSelect: () => import('@/components/Select/index.vue'),
  },
  data() {
    return {
      rangeOptions : [],
      upFloors:[],
      downFloors:[],
      divFloor:[],
      allFloor:[],
      selectRange:'0',
      selectFloor:'',
      current:0,
      classenable:false
    }
  },
  computed:{
    mobile(){
      if (this.$store.state.app.device === 'mobile') {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.getBuildingFloors()
  },
  methods: {
    getBuildingFloors(){
      this.rangeOptions = []
      this.upFloors = []
      this.downFloors = []
      this.allFloor = []
      this.$api.building.apiGetBuildingFloors().then(response =>{
        response.result.forEach(element => {
          if(element.floors > 0){
            this.upFloors.push(element)
          }else{
            this.downFloors.push(element)
          }
          var floor = {
            id:element.id,
            label:element.floors>0 ? element.floors+'F' : '地下'+element.floors.substr(1)+'F'
          }
          this.allFloor.push(floor)
        })
        if(this.upFloors.length >0){
          var _count = Math.ceil(this.upFloors.length / 10)
          for(var i=1;i<=_count;i++){
            var _temp = {
              id:i,
              name:i*10-9+'F~'+i*10+'F'
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
      })
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
      this.selectFloor = val
      this.$emit('handleBuildingFloorSelect',this.selectFloor)
    },
    addClass(index){
        this.classenable = true
        this.current = index;
    },
    removeClass(index){
        this.classenable = false
        this.current = index;
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