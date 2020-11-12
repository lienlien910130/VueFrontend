<template>
<div>
    <div v-for="(element,index) in list" :key="element.id" class="list-complete-item">
        <div class="list-complete-item-handle" @click="selectEle(element)">
            {{ index+1 }}.  {{ element.name }}  
        </div>
        <div style="position:absolute;right:0px;">
            <span style="float: right ;margin-top: -20px;margin-right:5px" @click="deleteEle(element)">
                <i style="color:#ff4949" class="el-icon-delete"/>
            </span>
        </div>
    </div>
</div>
</template>
<script>
export default {
    props: {
        list: {
            type: Array,
            default() {
                return []
            }
        }
    },
    methods:{
        deleteEle(element){
            this.$emit('subSelectOption','del',element)
        },
        selectEle(element){
            console.log('ee')
            this.$emit('subSelectOption','sel',element)
        }
    }
}
</script>
<style lang="scss" scoped>
.list-complete-item {
  cursor: pointer;
  position: relative;
  font-size: 14px;
  padding: 5px 12px;
  margin-top: 4px;
  border: 1px solid #bfcbd9;
  transition: all 1s;
}

.list-complete-item-handle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 50px;
  font-size: 18px;
}
</style>