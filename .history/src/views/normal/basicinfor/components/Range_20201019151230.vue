<template>
<div class="frange">
      <el-link 
      v-for="item in RangeOptions" 
      :key="item.key"
      :class="[{selected:item.id == selectrange},link]" 
      type="primary"
      @click="selectRange(item.id)">{{ item.name }}
      </el-link>

      <div class="floordiv" 
        v-for="item in divfloor" 
        :key="item" 
        @click="selectFloorDiv(item.id)"
        @mouseover="addClassload(item.id)"
        @mouseleave="removeClassload(item.id)"
        :class="[{ active:classenable && item.id == current },{ select:item.id == selectfloor }]"
      >
      <span v-if="item.floors > 0 ">{{ item.floors }} F</span>
      <span v-else>B{{ -(item.floors) }} F</span>
      </div>
</div>
</template>
<script>
import { getfloors } from '@/api/building'
import { mapGetters } from 'vuex'

export default {
  props: [ 'floor' ],
  computed:{
    ...mapGetters([
        'id',
        'buildingid'
    ])
  },
  data() {
    return {
      RangeOptions : [],
      Upfloors:[],
      Downfloors:[],
      divfloor:[],
      selectrange:'0',
      selectfloor:'',
      current:0,
      classenable:false,
    }
  },
  mounted() {
    this.getfloors()
  },
  watch: {
    floor: function () {
      this.getfloors()
    }
  },
  methods: {
    getfloors(){
      this.RangeOptions = []
      this.Upfloors = []
      this.Downfloors = []
      getfloors(this.buildingid).then(response =>{
        response.result.forEach(element => {
          if(element.floors > 0){
            this.Upfloors.push(element)
          }else{
            this.Downfloors.push(element)
          }
        });
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
      }).catch(error =>{
        console.log('error=>'+error)
      })
    },
    selectRange(val){
      this.selectrange = val
      if(val == 0){
        this.divfloor = this.Downfloors
      }else{
        const pageList = this.Upfloors.filter((item, index) => 
        index < 10 * val && index >= 10 * (val - 1))
        console.log('pageList=>'+JSON.stringify(pageList))
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
  }
}
</script>

<style lang="scss" scoped>
.frange {
    .link{
      margin: 10px;
    }
  }
  .selected {
    color: red;
  }
  .floordiv{
    width: 100% ;
    height: 50px;
    background-color:darkgray;
    border: 2px solid black;
    text-align: center;
    vertical-align: middle;
    color: white;
    font-weight:bold;
    font-size: 30px;
    line-height:50px;
  }
  .active {
    background: rgb(0, 110 , 163);
    cursor: pointer;
  }
  .select {
    background: red;
  }
</style>