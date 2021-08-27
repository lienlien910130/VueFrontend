<template>
  <div v-if="easyFlowVisible" style="height: calc(100vh - 50px);">
      
        <!-- @mousemove.prevent="handleMousemove"
          @mouseup.prevent="handleMouseup" -->
        <div
          class="index"
          id="zll-index"
        >
          <div class="flow-menu">
            <div class="section">
              <FlowMenu @on-is-add-node="onIsAddNode" />
            </div>
          </div>
          <div class="middle">
            <header>
              <HeaderOperate ref="operate" v-on:handleMiddleMenu="handleMiddleMenu"/>
            </header>
            <!-- <div class="section">
              <FlowContent ref="flowContent" @on-select-type="onSelectType" />
            </div> -->
          </div>
          <div class="flow-attr">
            <el-row>
                <el-col :span="24" style="height:38px">
                    <el-select
                        v-model="flowId"
                        filterable
                        placeholder="請選擇"
                        style="width:100%"
                        :disabled="disable"
                        @change="dataReload(item.id)"
                        >
                            <el-option
                            v-for="(obj,index) in flowList"
                            :key="index"
                            :label="obj.name"
                            :value="obj.id"
                            >
                            </el-option>  
                    </el-select>

                </el-col>
            </el-row>
            <FlowAttr />
          </div>
          <!-- <div class="modal-warp">
            <Modal
              v-model="isJsonView"
              footer-hide
              title="FlowData数据"
              width="600"
              :transfer="false"
              @on-cancel="handleCloseJsonView"
            >
              <json-viewer :expand-depth="1" copyable boxed :value="jsonData"></json-viewer>
            </Modal>
          </div> -->
        </div>
  </div>
</template>

<script>
import jsp from "jsplumb";
import { deepClone } from '@/utils'
import { flowmixin } from '@/mixin/index'

export default {
  name: "Index",
  mixins:[flowmixin],
  data() {
    return {
        jsPlumb: null,
        easyFlowVisible:true,
        flowList:[
            { id:'1', name:'流程B'},
            { id:'0', name:'流程A'},
        ],
        flowId:'0',
        data: {},
    };
  },
  computed: {
    
  },
  watch: {
    
  },
    created(){
        this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
  mounted() {
    //載入檔案 flowList 並且自動載入第一個
    //載入sample的節點資料
    this.jsPlumb = jsp.jsPlumb.getInstance()
    this.$nextTick(() => {
        this.dataReload({
    name: '流程B',
    nodeList: [
        {
            id: 'nodeA',
            name: '节点A-不可拖拽',
            type: 'task',
            left: '18px',
            top: '223px',
            ico: 'el-icon-user-solid',
            state: 'success',
            viewOnly: true
        },
        {
            id: 'nodeB',
            type: 'task',
            name: '流程B-节点B',
            left: '351px',
            top: '96px',
            ico: 'el-icon-goods',
            state: 'error'
        },
        {
            id: 'nodeC',
            name: '流程B-节点C',
            type: 'task',
            left: '354px',
            top: '351px',
            ico: 'el-icon-present',
            state: 'warning'
        }, {
            id: 'nodeD',
            name: '流程B-节点D',
            type: 'task',
            left: '723px',
            top: '215px',
            ico: 'el-icon-present',
            state: 'running'
        }
    ],
    lineList: [{
        from: 'nodeA',
        to: 'nodeB',
        label: '条件A'
    }, {
        from: 'nodeA',
        to: 'nodeC',
        label: '条件B'
    }, {
        from: 'nodeB',
        to: 'nodeD'
    }, {
        from: 'nodeC',
        to: 'nodeD'
    }
    ]
}
)
    })
  },
  methods: {

    dataReload(data) {
        //先載入檔案內容
        this.easyFlowVisible = false
        this.data.nodeList = []
        this.data.lineList = []
        this.$nextTick(() => {
            data = deepClone(data)
            this.easyFlowVisible = true
            this.data = data
            this.$nextTick(() => {
                this.jsPlumb = jsp.jsPlumb.getInstance()
                this.$nextTick(() => {
                    this.jsPlumbInit()
                })
            })
        })
    },
    jsPlumbInit() {
        this.jsPlumb.ready(() => {
            // 导入默认配置
            this.jsPlumb.importDefaults(this.jsplumbSetting)
            // 会使整个jsPlumb立即重绘。
            this.jsPlumb.setSuspendDrawing(false, true);
            // 初始化节点
            this.loadEasyFlow()
            // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
            this.jsPlumb.bind('click', (conn, originalEvent) => {
                this.activeElement.type = 'line'
                this.activeElement.sourceId = conn.sourceId
                this.activeElement.targetId = conn.targetId
                this.$refs.nodeForm.lineInit({
                    from: conn.sourceId,
                    to: conn.targetId,
                    label: conn.getLabel()
                })
            })
            // 连线
            this.jsPlumb.bind("connection", (evt) => {
                let from = evt.source.id
                let to = evt.target.id
                if (this.loadEasyFlowFinish) {
                    this.data.lineList.push({from: from, to: to})
                }
            })
            // 删除连线回调
            this.jsPlumb.bind("connectionDetached", (evt) => {
                this.deleteLine(evt.sourceId, evt.targetId)
            })
            // 改变线的连接节点
            this.jsPlumb.bind("connectionMoved", (evt) => {
                this.changeLine(evt.originalSourceId, evt.originalTargetId)
            })
            // 连线右击
            this.jsPlumb.bind("contextmenu", (evt) => {
                console.log('contextmenu', evt)
            })
            // 连线
            this.jsPlumb.bind("beforeDrop", (evt) => {
                let from = evt.sourceId
                let to = evt.targetId
                if (from === to) {
                    this.$message.error('节点不支持连接自己')
                    return false
                }
                if (this.hasLine(from, to)) {
                    this.$message.error('该关系已存在,不允许重复创建')
                    return false
                }
                if (this.hashOppositeLine(from, to)) {
                    this.$message.error('不支持两个节点之间连线回环');
                    return false
                }
                this.$message.success('连接成功')
                return true
            })
            // beforeDetach
            this.jsPlumb.bind("beforeDetach", (evt) => {
                console.log('beforeDetach', evt)
            })
            this.jsPlumb.setContainer(this.$refs.efContainer)
        })
    },
    onIsAddNode() {
      this.$refs.flowContent.onIsAddNode();
    },
    handleMiddleMenu(type){
      console.log('畫布的操作變更',type)
    }

  },
};
</script>
<style lang="scss" scoped>
.index {
  display: flex;
  h1 {
    font-size: 18px;
  }
  > div {
    height: 100vh; 
    display: flex;
    flex-direction: column;
  }
  .section {
    flex: 1;
  }
  header {
    height: 38px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    border-bottom: 1px solid #eee;
  }
  .flow-menu {
    width: 200px;
  }
  .middle {
    flex: 1;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }
  .flow-attr {
    width: 280px;
  }
  ::v-deep .ivu-modal {
    margin-bottom: 50px;
    .jv-container.boxed:hover {
      box-shadow: none;
      border: 1px solid #eee;
      border-radius: 6px;
    }
  }
}

</style>
