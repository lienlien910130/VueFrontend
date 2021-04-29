<template>
<div>
    <h3>圖層</h3>
    <el-tree
        ref="tree"
        :data="data"
        node-key="id"
        empty-text=""
        draggable
        highlight-current
        :expand-on-click-node="false"
        :allow-drop="allowDrop"
        >
        <span class="custom-tree-node" slot-scope="{ node, data }" >
            <span @click="select(node, data)" 
                style="padding:7px;margin:5px;float:left">
                    {{ node.label }}</span>
            <span v-if="node.level === 1 || (node.level === 2 && node.data.children.length > 0)" class="itemcount">
                {{ node.childNodes.length  }}</span>
            <span v-if="type == 'edit' && node.level !== 1" style="float:right">
                <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)">
                    <i style="color:#ff4949;font-size:22px" class="el-icon-delete"/>
                </el-button>
            </span>
        </span>
    </el-tree>
</div>
</template>
<script>
export default {
    props: {
        objectList: {
            type: Array,
            default() {
                return []
            }
        },
        type:{
            type: String
        }
    },
    data(){
        return{
            data:[
                {
                    id:'-1',
                    label: '未分類',
                    children: []
                },
                {
                    id:'-2',
                    label: '警戒區',
                    children: []
                },
                {
                    id:'-3',
                    label: '防護區',
                    children: []
                },
                {
                    id:'-4',
                    label: '放射區',
                    children: []
                },
                {
                    id:'-5',
                    label: '撒水區',
                    children: []
                },
                {
                    id:'-6',
                    label: '圖例',
                    children: []
                }
            ],
            collect:[],
            original:[]
        }
    },
    watch:{
        objectList:{
            handler:async function(newValue,oldValue){
                if(newValue.length == 0){
                    this.collect = []
                }else{
                    await this.checkNode(newValue)
                }
            },
            immediate:true
        }
    },
    mounted(){
        this.original = JSON.stringify(this.data)
    },
    methods:{
        init(){
            this.data = JSON.parse(this.original)
        },
        remove(node, data) {
            if(node.childNodes.length >0){
                this.$message({
                    message: '尚有子物件，請先移除子物件再刪除該物件',
                    type: 'warning'
                })
            }else{
                this.$refs.tree.remove(node)
                const collectid = this.collect.findIndex(d => d.id === data.id)
                const obj = this.collect.filter(item=>{ return item.id === data.id })
                this.$emit('sendActionToCanvas','del',obj)
                this.collect.splice(collectid, 1)
            }
        },
        select(node, data){
            if(data.id >= 0){
                var _temp = this.collect.filter(function(value) {
                    return value.id === data.id
                })
                this.$emit('sendActionToCanvas','sel',_temp[0])
            }
        },
        async checkNode(list){
            var _temp = []
            list.forEach(async(item) => {
                _temp = this.collect.filter(function(value) {
                    return value.id === item.id
                })
                if(_temp.length == 0){
                    this.collect.push(item)
                    if(item.type == 'image'){ //先找第一層圖例 -> 再找該圖例類別 -> 再放新節點
                       var level1 = this.data.filter((obj, index) =>
                            obj.label == '圖例'
                        )
                        var _id = 'img'+item.srcId
                        var temp = level1[0].children.filter((obj, index) =>
                            obj.id == _id
                        )
                        if(temp.length == 0){
                            level1[0].children.push({
                                id: _id , 
                                label: item.objectName, 
                                children: [{
                                    id: item.id , 
                                    label: item.objectName, 
                                    children: []
                                }]
                            })
                            this.$nextTick(() => { 
                                this.$refs.tree.getNode(level1[0].id).expanded = true
                                this.$refs.tree.setCurrentKey(level1[0].id)
                            })
                        }else{
                            temp[0].children.push({ 
                                id: item.id , 
                                label: item.objectName, 
                                children: []
                            })
                            this.$nextTick(() => { 
                                this.$refs.tree.getNode(temp[0].id).expanded = true
                                this.$refs.tree.setCurrentKey(temp[0].id)
                            })
                        }

                    }else{
                        var temp = this.data.filter((obj, index) =>
                            obj.label == item.blockType
                        )
                        temp[0].children.push({
                                id: item.id, 
                                label: item.objectName, 
                                children: []
                        })
                        this.$nextTick(() => { 
                            this.$refs.tree.getNode(temp[0].id).expanded = true
                        })
                    }
                }
            })
        },
        allowDrop(draggingNode, dropNode, type) {
            if (draggingNode.level === dropNode.level && type !== 'inner' && draggingNode.parent === dropNode.parent) {
                return true
            } else {
                return false
            }
        },
        //圖控傳過來的動作
        async redoundo(val){
            this.collect = []
            this.data = JSON.parse(this.original)
            await this.checkNode(val)
        },
        updateNodeLevel(val){
            this.$refs.tree.remove(val[0])
            var temp = this.data.filter((obj, index) =>
                obj.label == val[2]
            )
            temp[0].children.push({
                id: val[0], 
                label: val[1], 
                children: []
            })
        },
        updateNodeLabel(val){
             this.$refs.tree.getNode(val[0]).data.label = val[1]
        },
        objectSelect(val){
            if(val !== null && val.length == 1){
                this.$refs.tree.setCurrentKey(val[0].id)
            }else{
                this.$refs.tree.setCurrentKey(null)
            }
        },
        objectDelete(val){
            if(val !== null){
                var _temp =[]
                val.sort((x,y) => y.id - x.id).forEach(item =>{
                    const node = this.$refs.tree.getNode(item.id)
                    if(node.childNodes.length >0){
                        this.$message({
                            message: '尚有子物件，請先移除子物件再刪除該物件',
                            type: 'warning'
                        })
                    }else{
                        this.$refs.tree.remove(node)
                        const collectid = this.collect.findIndex(d => d.id === item.id)
                        this.collect.splice(collectid, 1)
                        _temp.push(item)
                    }    
                })
                const imgNode = this.$refs.tree.getNode(-6)
                imgNode.data.children.forEach(item=>{
                    if(item.children.length == 0){
                        this.$refs.tree.remove(item)
                    }
                })
                this.$emit('sendActionToCanvas','del',_temp)
            }
        }
    }
}
</script>
<style lang="scss">
.itemcount {
    background-color: #F56C6C;
    border-radius: 10px;
    color: #FFF;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #FFF;
    margin-top:12px
}


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