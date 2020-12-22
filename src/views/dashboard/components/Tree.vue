<template>
<div>
<el-input
  placeholder="輸入關鍵字"
  v-model="filterText">
</el-input>

<el-tree
  ref="tree"
  class="filter-tree"
  :data="resData"
  :props="defaultProps"
  :filter-node-method="filterNode"
  node-key="id"
  :default-expanded-keys="defaultExpandedKeys"
  :highlight-current="true"
  >
  <span class="custom-tree-node" slot-scope="{ node, data }" style="width:100%;" @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
      <span>{{ node.label }}</span>
      <span v-if="node.level !== 3 " class="count">{{ data.count }}</span>
      <i v-if="node.level === 3 " v-show="data.del" class="el-icon-s-tools" style="float:right;" @click="nodeclick(data)">叫修</i>
      
      <!-- <el-link v-show="data.del" size="mini" type="primary" @click="alert('叫修')" style="float:right;" icon="el-icon-s-tools"></el-link> -->
  </span>
  
</el-tree>
</div>
</template>

<script>
import { getequipment } from '@/api/index'
import dialog from './Dialog'

  export default {
    props:['currentnode','loadtree'],
     data() {
      return {
        filterText: '',
        resData: [],
        savaData:[],
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf',
          count: 'count'
        },
        defaultExpandedKeys: ['11']
      };
    },
    watch: {
        loadtree: function() {
            this.loadTree()
        },
        filterText(val) {
            this.$refs.tree.filter(val);
        },
        currentnode: function() {
        this.$nextTick(()=> {
          this.setAllExpand(false)
          this.defaultExpandedKeys = []
          if(this.currentnode === 'good'){
            this.defaultExpandedKeys.push(13)
            this.$refs.tree.setCurrentKey(13)
          } else if (this.currentnode === 'repair') {
            this.defaultExpandedKeys.push(12)
            this.$refs.tree.setCurrentKey(12)
          } else {
            this.defaultExpandedKeys.push(11)
            this.$refs.tree.setCurrentKey(11)
          }
        })
      }
    },
    methods: {
      nodeclick(data) {
        this.$emit('setvisible', data)
      },
      mouseenter(data){
          this.$set(data, 'del', true)
      },
      mouseleave(data){
          this.$set(data, 'del', false)
      },
      filterNode(value, data) {
        if(value.length === 0) {
          this.setAllExpand(false)
        }
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      loadTree() {
        this.savaData = [{
              id:'-1',
              name:'損壞',
              type:'damage',
              count:'0',
              children: []
          }, {
              id:'-2',
              name:'叫修',
              type:'repair',
              count:'0',
              children: []
          },{
              id:'-3',
              name:'妥善',
              type:'good',
              count:'0',
              children: []
          }]

          for (let i = 0; i < this.savaData.length; i++){
              if( i === this.savaData.length-1 ) this.finaltype === true
              this.requestData(i,this.savaData[i].type)
          }
      },
      requestData(index,type) {
        // 取得相對應的陣列 傳入損壞/叫修/妥善
          getequipment(type).then(respone => {
            const resDatas = respone.data.items;
            const types= [
              {id: '1',type: 'F',name:'消防設備'},
              {id: '2',type: 'P',name:'防火/防煙設備'},
              {id: '3',type: 'B',name:'建築設備'},
              {id: '4',type: 'G',name:'一般設備'},
              {id: '5',type: 'O',name:'其他設備'} 
            ]
            this.savaData[index].count = resDatas.length
            types.forEach( typelistitem => {
              const count = resDatas.filter( function(item, index){
                if (item.type === typelistitem.type) {
                    return true
                }
              })
              if(count.length > 0) {
                const itemar = {
                  id: typelistitem.id,
                  name: typelistitem.name,
                  type: typelistitem.type,
                  count:count.length,
                  leaf: false,
                  children: []
                }
                this.savaData[index].children.push(itemar)
                const childrenindex = this.savaData[index].children.length
                for (let i = 0; i < count.length; i++){
                  this.savaData[index].children[childrenindex-1].children.push(count[i])
                  if( index=== 2 && typelistitem.id === '5' && i === count.length-1 ){
                    this.resData = this.savaData
                  }
                }
              }
            });
          }).catch(error => {
            console.log("error=>"+error)
          })
      },
      setAllExpand(state){
        this.changeTreeNodeStatus(this.$refs.tree.store.root);
      },
       changeTreeNodeStatus(node) {
        for(let i = 0; i < node.childNodes.length; i++ ) {
          node.childNodes[i].expanded = false;
          if(node.childNodes[i].childNodes.length > 0) {
            this.changeTreeNodeStatus(node.childNodes[i]);
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
.el-tree-node__label{
  font-size: 22px;
}

.count {
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
  }
</style>