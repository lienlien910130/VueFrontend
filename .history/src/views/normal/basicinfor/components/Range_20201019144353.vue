<template>
<div class="frange">
      
      <el-link 
      v-for="item in RangeOptions" 
      :key="item.key"
      class="link" 
      type="primary"
      @click="selectRange(item.id)">{{ item.name }}
      </el-link>

      <div class="floordiv" 
        v-for="item in divfloor" 
        :key="item" 
        @click="selectFloorDiv(item)"
        @mouseover="addClassload(item)"
        @mouseleave="removeClassload(item)"
        :class="[{ active:classenable && item == current },{ select:item == selectfloor }]"
      >
      <span v-if="item > 0 ">{{ item }} F</span>
      <span v-else>B{{ -(item) }} F</span>
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
      Downfloors:[]
    }
  },
  mounted() {
    this.getfloors()
  },
  watch: {
    floor: function () {
      this.setlink()
    }
  },
  methods: {
    getfloors(){
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
          console.log(this.Upfloors.length+'//'+_count)
          for(var i=1;i<=_count;i++){
            var _temp = {
              id:i,
              name:i*10-9+'F~'+i*10+'F'
            }
            this.RangeOptions.push(_temp)
          }
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
    selectRange(val) {
        this.$emit('setrange', val)
    },
    setlink() {
        this.refresh()
        const up = this.floor[0] // 50
        const down = this.floor[1] // 5
        const conup = Math.ceil(up/10) //5個區間
      
        for(var i=1;i<=conup;i++){ 
          const c = i*10
          let _array = {
            name:c-9+'F~'+c+'F' ,id:c-9
          }
          this.RangeOptions.push(_array)
        }
        
        if(down !== '0' ){
          this.RangeOptions.unshift({name:'地下樓層',id:'0'})
        }
    },
    refresh(){
      this.RangeOptions = []
    },
    selectFloorDiv(val) {
      this.selectfloor = val
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
</style>