<template>
<div class="frange">
  
  <div v-if="!mobile"
  >
    <div class="rangediv">
      <el-link 
        v-for="item in RangeOptions" 
        :key="item.key"
        :class="[{selected:item.id == selectrange}]" 
        type="primary"
        @click="selectRange(item.id)">{{ item.name }}
      </el-link>
    </div>
    <div 
      class="floordiv" 
      v-for="item in divfloor" 
      :key="item.id" 
      @click="selectFloorDiv(item.id)"
      @mouseover="addClassload(item.id)"
      @mouseleave="removeClassload(item.id)"
      :class="[{ active:classenable && item.id == current },{ select:item.id == selectfloor }]"
    >
      <span v-if="item.floors > 0 ">{{ item.floors }} F</span>
      <span v-else>B{{ -(item.floors) }} F</span>
    </div>
  </div>
  <div v-else>
    <FloorSelect 
      style="margin-bottom: 20px;width:100%"
      v-bind="floorselectAttrs" 
      v-on="floorselectEvent">
    </FloorSelect>
  </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: [ 'floor' ],
  components:{
    FloorSelect: () => import('@/components/Select/index.vue'),
  },
  data() {
    return {
      RangeOptions : [],
      Upfloors:[],
      Downfloors:[],
      divfloor:[],
      allfloor:[],
      selectrange:'0',
      selectfloor:'',
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
    },
    floorselectAttrs() {
      return {
          selectData: this.allfloor,
          title:'Range'
      }
    },
    floorselectEvent(){
      return{
          subChangeOption: this.handleSelectOption
      }
    }
  },
  mounted() {
    this.getfloors()
  },
  watch: {
   
  },
  methods: {
    getfloors(){
      this.RangeOptions = []
      this.Upfloors = []
      this.Downfloors = []
      this.allfloor = []
      this.$api.building.apiGetBuildingFloors().then(response =>{
        response.result.forEach(element => {
          if(element.floors > 0){
            this.Upfloors.push(element)
          }else{
            this.Downfloors.push(element)
          }
          var floor = {
            id:element.id,
            label:element.floors>0 ? element.floors+'F' : '地下'+element.floors.substr(1)+'F'
          }
          this.allfloor.push(floor)
        })
        
        if(this.Upfloors.length >0){
          var _count = Math.ceil(this.Upfloors.length / 10)
          for(var i=1;i<=_count;i++){
            var _temp = {
              id:i,
              name:i*10-9+'F~'+i*10+'F'
            }
            this.RangeOptions.push(_temp)
          }
          this.selectrange = '1'
          this.selectRange(1)
        }
        if(this.Downfloors.length >0){
          var _temp = {
            id:0,
            name:'地下樓層'
          }
          this.RangeOptions.unshift(_temp)
        }
      })
    },
    selectRange(val){
      this.selectrange = val
      if(val == 0){
        this.divfloor = this.Downfloors
      }else{
        const pageList = this.Upfloors.filter((item, index) => 
        index < 10 * val && index >= 10 * (val - 1))
        this.divfloor = pageList
      }
    },
    selectFloorDiv(val) {
      this.selectfloor = val
      this.$emit('subRangeButton',val)
    },
    addClassload(index){
        this.classenable = true
        this.current = index;
    },
    removeClassload(index){
        this.classenable = false
        this.current = index;
    },
    handleSelectOption(val){
      this.selectfloor = val[0].id
      this.$emit('subRangeButton',val[0].id)
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
    color: white;
    font-weight:bold;
    font-size: 30px;
    line-height:50px;
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
  .active {
    background: rgb(202, 191 , 220);
    cursor: pointer;
  }
  .select {
    background: rgb(147, 180 , 197);
  }
</style>