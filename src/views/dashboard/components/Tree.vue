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
    empty-text="暫無資料"
    >
    <span 
    slot-scope="{ node, data }" 
    style="width:100%;" 
    @click="node.level === 3 ? handleNodeClick(node,data) : null"
    >
        <span>{{ node.label }}</span>
        <span v-if="node.level !== 3 " class="count">{{ data.count }}</span>
        <!-- <i v-if="node.level === 3 " 
        v-show="data.del" 
        class="el-icon-s-tools" 
        style="float:right;" 
        @click="nodeclick(node,data)">叫修</i> -->
        <!-- <el-link v-show="data.del" size="mini" type="primary" @click="alert('叫修')" style="float:right;" icon="el-icon-s-tools"></el-link> -->
    </span>
  </el-tree>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { removeDuplicates } from '@/utils/index';

  export default {
    props:{
      treeData:{
        type:Array
      },
      currentNode:{
        type:String
      },
    },
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
        defaultExpandedKeys: ['-1'],
        deviceOptions:[]
      }
    },
    async mounted(){
     
    },
    watch: {
      treeData:{
        handler:async function(){
          if(this.treeData.length > 0){
            await this.init()
          }
        }
      },
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      currentNode: function() {
        this.$nextTick(()=> {
          this.setAllExpand(false)
          this.defaultExpandedKeys = []
          this.defaultExpandedKeys.push(this.currentNode)
          this.$refs.tree.setCurrentKey(this.currentNode)
        })
      }
    },
    computed:{
      ...mapGetters([
        'buildingid'
      ]),
    },
    methods: {
      async init(){
        for(let obj of this.treeData) { //設備狀況
          var node = {
            id:obj.value,
            name:obj.name,
            count:obj.data.length,
            children:[]
          }
          var typeArray = removeDuplicates(obj.data,'type') //去除掉重複的設備種類
          for(let item of typeArray){ //針對設備種類篩選對應的
            var typeObj = await this.$obj.Setting.getOption(item.type)
            var typedata = obj.data.filter((element,index)=>{
              return element.type == item.type
            })
            const _temp = { 
                id: item.type,
                name: typeObj[0].textName,
                count:typedata.length,
                leaf: false,
                children: typedata
            }
            node.children.push(_temp)
          }
          this.savaData.push(node)
        }
        this.resData = this.savaData
      },
      handleNodeClick(node,data) {
        // let routeData = this.$router.resolve({ name: 'Equipment', params: { target: data.id }})
        // window.open(routeData.href, '_blank')
        this.$router.push({ name: 'Equipment', params: { target: data.id }})
      },
      filterNode(value, data) {
        if(value.length === 0) {
          this.setAllExpand(false)
        }
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
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