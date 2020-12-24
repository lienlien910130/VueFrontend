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
      if(this.buildingid !== undefined){
        await this.getDeviceTypeOption()
      }
    },
    watch: {
      buildingid:{
        handler:async function(){
          await this.getDeviceTypeOption()
        }
      },
      treeData:{
        handler:function(){
          if(this.treeData.length > 0){
            this.init()
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
      init(){
        var good = this.treeData[0]
        var damage = this.treeData[1]
        var repair = this.treeData[2]
        this.savaData = [{
              id:'-1',
              name:'損壞',
              type:'damage',
              count:damage.length,
              children: []
          }, {
              id:'-2',
              name:'叫修中',
              type:'repair',
              count:repair.length,
              children: []
          },{
              id:'-3',
              name:'良好',
              type:'good',
              count:good.length,
              children: []
          }]
          var _good = this.removeDuplicates(good,'type') // 去除重複的種類
          var _damage = this.removeDuplicates(damage,'type') 
          var _repair = this.removeDuplicates(repair,'type')
          this.createChildrenNode(damage,_damage,0)
          this.createChildrenNode(repair,_repair,1)
          this.createChildrenNode(good,_good,2)
          this.resData = this.savaData
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
      async getDeviceTypeOption(){
        await this.$api.setting.apiGetOptions('DeviceOptions').then(response => {
          console.log('getDeviceTypeOption',response)
          this.deviceOptions = response.result.sort((x,y) => x.id - y.id)
        })
      },
      optionsFilter(id){
        console.log('Tree_optionsFilter',this.deviceOptions,id)
        let data = this.deviceOptions.filter((item, index) => 
          item.id == id 
        )
        return data[0]
      },
      countToType(array,type){
        let data = array.filter((item, index) => 
          item.type == type 
        )
        return data
      },
      createChildrenNode(origin,removeDuplicatesArray,index){
        removeDuplicatesArray.forEach(item => {
          var array = this.optionsFilter(item.type) //設備種類的資料
          console.log('Tree_createChildrenNode',array)
          var cnt = this.countToType(origin,item.type) //取得該種類的數量
          const _temp = { 
              id: -array.id,
              name: array.textName,
              type: item.type,
              count:cnt.length,
              leaf: false,
              children: []
          }
          this.savaData[index].children.push(_temp) //建立設備種類子節點
          const childrenindex = this.savaData[index].children.length
          const newArray = cnt.map(v => {
              this.$set(v, 'children', []) 
              this.$set(v, 'leaf', false) 
              return v
          })
          for (let i = 0; i < newArray.length; i++){
            this.savaData[index].children[childrenindex-1].children.push(newArray[i]) //建立設備子節點
          }
        })
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