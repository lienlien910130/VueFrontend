<template>
<div class="frange">
    <el-link 
    v-for="item in RangeOptions" 
    :key="item.key"
    class="link" 
    type="primary"
    @click="selectRange(item.id)">{{ item.name }}</el-link>
</div>
</template>
<script>
export default {
  props: [ 'floor' ],
  data() {
    return {
      RangeOptions : []
    }
  },
  mounted() {
    
  },
  watch: {
    floor: function () {
      this.setlink()
    }
  },
  methods: {
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
    }
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