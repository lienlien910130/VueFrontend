<template>
    <div>
        <div>
            <h3>目錄</h3>
        </div>
        <div>
            <el-tree
            ref="tree"
            :data="data"
            empty-text=""
            highlight-current
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            >
              <span class="custom-tree-node" slot-scope="{ node,data }" @click="select(node, data)">
                  <span >
                    {{ data.name }}
                  </span>
              </span>
            </el-tree>    
        </div>
    </div>
</template>

<script>
export default {
    props:['data','selectId'],
    watch:{
      data:{
        handler:function(){
          if(this.selectId !== ''){
            this.$nextTick(()=>{
              this.$refs.tree.setCurrentKey(this.selectId)
            })
          }
        },
        immediate:true
      },
      selectId:{
        handler:function(){
          if(this.selectId !== ''){
            this.$nextTick(()=>{
              this.$refs.tree.setCurrentKey(this.selectId)
            })
          }
        },
        immediate:true
      }
    },
    methods:{
        select(node, data){
          this.$emit('handleTreeNode',node,data)
        },
    }
}
</script>

<style lang="scss">



/* 设置树形最外层的背景颜色和字体颜色 */
.el-tree {
  color: black;
  background: transparent;
  font-size: 20px;
  margin:10px;
}
.custom-tree-node{
    margin: 5px;
    width:100%;
}
/* 设置三角形图标的颜色 */
.el-tree-node__expand-icon {
  color: black;
  font-size: 25px;
}

/* 树节点鼠标悬浮式改变背景色，字体颜色 */
.el-tree-node__content:hover {
  background-color: rgb(202, 191 , 220);
  color: rgb(29, 4, 4);
}
 
/* 改变节点高度 */
.el-tree-node__content {
  height: 30px;
}
 

 
/* 改变被点击节点背景颜色，字体颜色 */
// .el-tree-node:focus > .el-tree-node__content {
//   background-color:rgb(147, 180 , 197);
//   color: black;
// }
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: lightgray;
  color:black;
}
.el-tree-node .is-focusable .is-checked{
background-color:rgb(147, 180 , 197);
  color: black;
}
</style>