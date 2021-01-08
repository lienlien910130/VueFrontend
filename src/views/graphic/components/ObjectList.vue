<template>
<div>
    <h3>圖層</h3>
    <el-tree
        ref="tree"
        :data="data"
        node-key="id"
        empty-text=""
        draggable
        :filter-node-method="filterNode"
        highlight-current
        :expand-on-click-node="false"
        >
        <span class="custom-tree-node" slot-scope="{ node, data }" >
            <span @click="select(node, data)" 
                style="padding:7px;margin:5px;float:left">
                    {{ node.label }}</span>
            <span v-if="node.level === 1 && node.data.id < 0" class="itemcount">
                {{ node.childNodes.length  }}</span>
            <span v-else-if="node.level === 1 && node.data.id >= 0" class="itemcount">
                {{ node.childNodes.length + 1  }}</span>
            <span style="float:right">
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
        list: {
            type: Array,
            default() {
                return []
            }
        },objectDelete:{},objectSelect:{},redoundo:{},originalData:{}
    },
    data(){
        return{
            data:[],
            collect:[],
            parentnode:null
        }
    },
    watch:{
        list:{
            handler:function(newValue,oldValue){
                console.log('listwatch',JSON.stringify(newValue))
                if(newValue.length == 0){
                    this.data = []
                    this.collect = []
                    this.parentnode = null
                }else{
                    this.checkNode(newValue)
                }
            },
            immediate:true
        },
        objectDelete(val){
            console.log('objectdelete',val)
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
                    this.$emit('returnDeleteSuccess',_temp)
                }
        },
        objectSelect(val){
            if(val !== null){
                val.sort((x,y) => y.id - x.id).forEach(item =>{
                    this.$refs.tree.setCurrentKey(item.id)
                })
            }else{
                this.$refs.tree.setCurrentKey(null)
            }
        },
        redoundo(val){
            if(val !== null ){
                this.collect.length = 0
                this.data.length = 0
                console.log('redoundo',val,this.collect,this.data)
                this.checkNode(val)
                this.$emit('returnObjectRedoUndo','')
            }
        },
        originalData(val){
            console.log('originalData',JSON.stringify(val))
            this.setOriginalData(val)
        }
    },
    methods:{
        remove(node, data) {
            if(node.childNodes.length >0){
                this.$message({
                    message: '尚有子物件，請先移除子物件再刪除該物件',
                    type: 'warning'
                })
            }else{
                this.$refs.tree.remove(node)
                const collectid = this.collect.findIndex(d => d.id === data.id)
                this.$emit('sendActionToCanvas','del',this.collect[collectid])
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
        filterNode(value, data) {
            const node =  this.$refs.tree.getNode(data.id)
            if(node.parent.level == 0){
                if(node.data.label == value){
                    this.parentnode = node
                }
            }
            return true
        },
        removeDuplicates(originalArray, prop) {
            var newArray = []
            var lookupObject  = {}
            for(var i in originalArray) {
                lookupObject[originalArray[i][prop]] = originalArray[i]
            }
            for(i in lookupObject) {
                newArray.push(lookupObject[i])
            }
            return newArray
        },
        checkNode(list){
            var _temp = []
            list.forEach(item => {
                _temp = this.collect.filter(function(value) {
                    return value.id === item.id
                })
                if(_temp.length == 0){
                    this.collect.push(item)
                    if(item.type == 'image'){
                        this.$refs.tree.filter(item.objectName)   
                        if(this.parentnode == null){
                            this.data.push({ 
                                id: item.id , 
                                label: item.objectName, 
                                children: []
                            })  
                        }else{
                            this.$refs.tree.append({ 
                                id: item.id, 
                                label: item.objectName, 
                                children: []} , 
                                this.parentnode)
                            this.parentnode = null
                        }
                    }else{
                        this.$refs.tree.filter(item.blockType) 
                        var i = 0
                        switch(item.blockType){
                            case '未分類':
                                i = -1    
                                break;
                            case '警戒區':
                                i = -2    
                                break;
                            case '防護區':
                                i = -3    
                                break;
                            case '放射區':
                                i = -4    
                                break;
                            case '撒水區':
                                i = -5    
                                break;
                        }
                        if(this.parentnode == null){
                            this.data.push({ 
                                id: i , 
                                label: item.blockType !== '' ? item.blockType : '尚未分類', 
                                children: [{
                                    id: item.id, 
                                    label: item.objectName, 
                                    children: []
                                }]
                            }) 
                        }else{
                            this.$refs.tree.append({ 
                                id: item.id, 
                                label: item.objectName, 
                                children: []} , 
                                this.parentnode)
                            this.parentnode = null  
                        }
                    }
                }
            })
        },
        setOriginalData(val){
            val.forEach(item =>{
                this.collect.push(item)
                if(item.type === 'image'){
                    var temp = this.data.filter((obj, index) =>
                        obj.label == item.objectName
                    )
                    var node = temp.length == 0? this.data : temp[0].children
                    node.push({ 
                        id: item.id , 
                        label: item.objectName, 
                        children: []
                    })
                }else{
                    var i = 0
                    switch(item.blockType){
                        case '未分類':
                            i = -1    
                            break;
                        case '警戒區':
                            i = -2    
                            break;
                        case '防護區':
                            i = -3    
                            break;
                        case '放射區':
                            i = -4    
                            break;
                        case '撒水區':
                            i = -5    
                            break;
                    }
                    var temp = this.data.filter((obj, index) =>
                        obj.id == i
                    )
                    if(temp.length == 0){
                        this.data.push({ 
                            id: i , 
                            label: item.blockType !== '' ? item.blockType : '尚未分類', 
                            children: [{
                                id: item.id, 
                                label: item.objectName, 
                                children: []
                            }]
                        })
                    }else{
                        temp[0].children.push({
                            id: item.id, 
                            label: item.objectName, 
                            children: []
                        })
                    }
                }
                
            })
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