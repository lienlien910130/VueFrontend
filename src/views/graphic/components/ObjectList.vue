<template>
<div>
    <h3>圖層</h3>
    <el-tree
        ref="tree"
        :data="data"
        node-key="id"
        default-expand-all
        empty-text=""
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        >
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <div @click="select(node, data)" style="display:inline-block;">
                <span >{{ node.label }}</span>
            </div>
            <div style="display:inline-block;">
                <span>
                    <el-button
                        type="text"
                        size="mini"
                        @click="() => remove(node, data)">
                        Delete
                    </el-button>
                </span>
            </div>
        </span>
    </el-tree>
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
        },objectDelete:{}
    },
    data(){
        return{
            data:[],
            collect:[],
            id:0
        }
    },
    watch:{
        list(list){
            var _temp = []
            list.forEach(item => {
                _temp = this.collect.filter(function(value) {
                    return value.id === item.id
                })
                if(_temp.length == 0){
                    this.data.push({ id: item.id, label: 'thistest'+item.name, children: [] })
                    this.collect.push(item)
                }
            })
        },
        objectDelete(val){
            const node = this.$refs.tree.getNode(val.id)
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === val.id)
            if(node.childNodes.length >0){
                this.$message({
                    message: '尚有子物件，請先移除子物件再刪除該物件',
                    type: 'warning'
                })
            }else{
                children.splice(index, 1)
                const collectid = this.collect.findIndex(d => d.id === val.id)
                this.collect.splice(collectid, 1)
                this.$emit('subDeleteReturnOption')
            }
            
        }
    },
    methods:{
         remove(node, data) {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            if(children.length >0){
                this.$message({
                    message: '尚有子物件，請先移除子物件再刪除該物件',
                    type: 'warning'
                })
            }else{
                children.splice(index, 1)
                const collectid = this.collect.findIndex(d => d.id === data.id)
                this.$emit('subSelectOption','del',this.collect[collectid])
                this.collect.splice(collectid, 1)
            }
        },
        select(node, data){
            var _temp = this.list.filter(function(value) {
                return value.id === data.id
            })
            this.$emit('subSelectOption','sel',_temp[0])
        },
        append(data) {
            const newChild = { id: id++, label: 'testtest', children: [] };
            if (!data.children) {
            this.$set(data, 'children', []);
            }
            data.children.push(newChild);
        },
        handleDragStart(node, ev) {
            console.log('drag start', node);
        },
        handleDragEnter(draggingNode, dropNode, ev) {
            console.log('tree drag enter: ', dropNode.label);
        },
        handleDragLeave(draggingNode, dropNode, ev) {
            console.log('tree drag leave: ', dropNode.label);
        },
        handleDragOver(draggingNode, dropNode, ev) {
            console.log('tree drag over: ', dropNode.label);
        },
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
            console.log('tree drag end: ', dropNode && dropNode.label, dropType);
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {
            console.log('tree drop: ', dropNode.label, dropType);
        },
        allowDrop(draggingNode, dropNode, type) {
            if (dropNode.data.label === '二级 3-1') {
            return type !== 'inner';
            } else {
            return true;
            }
        },
        allowDrag(draggingNode) {
            return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
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