<template>
    <div
    v-if="flowVisible"
    class="index"
    id="zll-index"
  >
  <div class="flow-menu">
      <div class="section">
        <FlowMenu
            ref="nodeMenu"
            v-bind="flowMenuAttrs"
            v-on="flowMenuEvent"
        />
        <FlowAttr
            ref="nodeForm"
            @setLineLabel="setLineLabel"
            @repaintEverything="repaintEverything"
            :processArray="processArray"
            :processId="processId"
            :disabled="true"
            :title="title">
        </FlowAttr>
      </div>
    </div>
    <div class="middle">
        <div class="section" ref="section">
            <main
                ref="main"
            >
                <div class="view-scale">節點數量：{{ data.nodeList !== undefined ? data.nodeList.length : '0' }}</div>
                <div
                :class="['flow-content', 'grid']"
                :style="{
                    transform: `scale(${viewScale})`,
                    transformOrigin: `${scalePosition.x}px ${scalePosition.y}px`,
                    left: dragMove.left + 'px',
                    top: dragMove.top + 'px'
                }"
                >
                    <div class="flow-area" ref="flowarea">
                        <template v-for="node in data.nodeList">
                            <FlowNode
                                    :id="node.nodeId"
                                    :key="node.nodeId"
                                    :node="node"
                                    :activeElement="activeElement"
                                    :title="title"
                                    v-on="flowEvent"
                            >
                            </FlowNode>
                        </template>
                    </div>
                </div>
            </main>
      </div>
    </div>
    <div class="flow-attr">
        <el-tabs v-model="activeName" tab-position="top" style="padding:10px" @tab-click="handleClick">
            <el-tab-pane label="歷程" name="first">歷程</el-tab-pane>
            <el-tab-pane label="定位回報" name="second">定位回報</el-tab-pane>
            <el-tab-pane label="撤退追蹤" name="third">撤退追蹤</el-tab-pane>
        </el-tabs>
    </div>
  </div>

</template>
<script>
import '@/utils/jsplumb'
import { flowmixin } from '@/mixin/index'
import { CNode, ContingencyProcess, COption, SelfDefenseFireMarshalling } from '@/object'
import ws from '@/utils/socket'
import store from '@/store'
export default {
    mixins: [flowmixin],
    created(){
        this.$store.dispatch('app/toggleDevice', 'mobile')
        this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    computed:{
        ...Vuex.mapGetters([
            'actions',
            'options',
            'process',
            'wsmsg'
        ]),
        flowMenuAttrs(){
            return{
                processId:this.processId,
                processArray:this.processArray,
                title:this.title
            }
        },
        flowMenuEvent(){
            return{
                changeProcess:this.getJsonFile
            }
        },
        flowEvent(){
            return{
                clickNode:this.clickNode
            }
        }
    },
    watch: {
        process:{ //有登入ws&有發生緊急應變才繪製畫面
            handler:async function(){
              if(this.process == true && ws.processWs.floorId !== null){
                this.$nextTick(async() => {
                    this.processArray = await SelfDefenseFireMarshalling.getProcess(ws.processWs.selfDefenseFireMarshallingListId)
                    await this.getJsonFile(ws.processWs.contingencyProcessId)
                })  
              }
            },
            immediate:true
        },
    },
    data(){
        return{
            activeName: 'first',
            title:'',
            jsPlumb: null,
            flowVisible:true,
            viewScale: 1,
            scalePosition: {
                x: 0,
                y: 0,
            },
            dragMove: {
                offsetX: -3000,
                offsetY: -3000
            },
            data: {
                offsetX: -3000,
                offsetY: -3000,
                name:"",
                nodeList: [],
                lineList: []
            },
            activeElement: {
                type: undefined,
                nodeId: undefined,
                sourceId: undefined,
                targetId: undefined
            },
            processId:null,
            processArray:[],
            processNodeArray:[],
            processLineArray:[]
        }
    },
    async mounted() {
        this.jsPlumb = jsPlumb.getInstance({ Container: "zll-index" })
        this.title = 'selfDefenseClass'
        this.$messaging.getToken({vapidKey: 'BMu0NsMpDOJfRkGUVC1kwS--OOjkM1y7x8j9BJj86J505uDUeUHI05zTqzoj_fM896_QKSLGd-n4Xsq1md5QBDk'})
        .then(async function (currentToken) {
            if (currentToken) {
                console.log('currentToken',currentToken)
                await store.dispatch('user/saveMToken',currentToken)
                if(ws.processWs.$ws == null){
                    ws.initProcessWebSocket()
                }
            } else {
                //顯示訂閱的視窗
                console.log('no token')
            }
        })
        .catch(function (err) {
            console.log('err',err)
        });
        // if(this.$route.query.l !== undefined && this.$route.query.p !== undefined){
        //     //取得所有流程圖
        //     this.processArray = await SelfDefenseFireMarshalling.getProcess(this.$route.query.l)
        //     await this.getJsonFile(this.$route.query.p)
        // }
    },
    methods: {
        async getJsonFile(pid = null){ //讀取指定的process ID取得JSON，載入流程圖
                if(pid !== null){
                    var result = await ContingencyProcess.getJson(pid)
                    this.processId = pid
                    this.processNodeArray = await CNode.get(this.processId)
                    console.log(JSON.stringify(this.processNodeArray))
                    this.processLineArray = await COption.getOfProcess(this.processId)
                    if(result.codeContent !== undefined){
                        this.$nextTick(() => {
                            this.dataReload(JSON.parse(result.codeContent))
                        })
                    }else{
                        this.$nextTick(() => {
                            this.dataReload({
                                offsetX: -3000,
                                offsetY: -3000,
                                name:"",
                                nodeList: [],
                                lineList: []
                            })
                        })
                    }
                }else{
                    this.$nextTick(() => {
                        this.dataReload({
                            offsetX: -3000,
                            offsetY: -3000,
                            name:"",
                            nodeList: [],
                            lineList: []
                        })
                    })
                }
        },
        dataReload(data) {
                this.flowVisible = false
                this.$nextTick(() => {
                    data = _.cloneDeep(data)
                    this.flowVisible = true
                    this.data = data
                    let { offsetX, offsetY } = this.data
                    if (offsetX && offsetY) {
                        this.dragMove = {
                            top: offsetY,
                            left: offsetX,
                        }
                    }else{
                        this.dragMove = {
                            top: '-3000px',
                            left: '-3000px'
                        }
                    }
                    this.$nextTick(() => {
                        this.jsPlumb = jsPlumb.getInstance({ Container: "zll-index" })
                        this.$nextTick(() => {
                            this.jsPlumbInit()
                        })
                    })
                })
        },
        jsPlumbInit() {
                this.jsPlumb.ready(() => {
                    // 默認配置
                    this.jsPlumb.importDefaults(this.jsplumbSetting)
                    this.jsPlumb.setSuspendDrawing(false, true)
                    this.loadFlow() // 繪製json
                    //點擊線-傳遞資訊到右側
                    this.jsPlumb.bind('click', (conn, originalEvent) => {
                        this.activeElement.type = 'line'
                        this.activeElement.sourceId = conn.sourceId
                        this.activeElement.targetId = conn.targetId
                        this.$refs.nodeForm.lineInit({
                            id:conn.id,
                            from: conn.sourceId,
                            to: conn.targetId,
                            label: conn.getLabel()
                        })
                    })
                    // 連線前的判斷：需判斷該連線是否已存在
                    this.jsPlumb.bind("beforeDrop", (evt) => {
                        return true
                    })
                })
        },
        loadFlow() {
                // 初始化節點
                if(this.data.nodeList !== undefined){
                    for(let node of this.data.nodeList){
                        this.jsPlumb.makeSource(node.nodeId, _.merge(this.jsplumbSourceOptions, {}))
                        this.jsPlumb.makeTarget(node.nodeId, this.jsplumbTargetOptions)
                        this.jsPlumb.draggable(node.nodeId, {
                            containment: 'parent'
                        })
                    }
                }
                // 初始化連線
                if(this.data.lineList !== undefined){
                    this.data.lineList.forEach(line => {
                        var connParam = {
                            source: line.from,
                            target: line.to,
                            label: line.label ? line.label : '',
                            connector: line.connector ? line.connector : '',
                            anchors: line.anchors ? line.anchors : undefined,
                            paintStyle: line.paintStyle ? line.paintStyle : undefined,
                        }
                        this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
                    })
                }
        },
        clickNode(node) {
                this.activeElement.name = node.name
                this.activeElement.type = 'node'
                this.activeElement.nodeId = node.nodeId
                this.$refs.nodeForm.nodeInit(this.data, node.nodeId)
        },
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
}

</script>

<style lang="scss" scoped>
.index {
  display: flex;
  h1 {
    font-size: 18px;
  }
  > div {
    height: calc(100vh - 50px);
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
    width: 250px;
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

main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .grid {
    &::before {
      content: "";
      display: block;
      position: absolute;
      height: 100%;
      width: 100%;
      z-index: 0;
      background-image: linear-gradient(90deg, #ebebeb75 1px, transparent 0),
        linear-gradient(#ebebeb75 1px, transparent 0);
      background-size: 12px 12px;
    }
  }
  .flow-content {
    position: absolute;
    transform: scale(1);
    transform-origin: 0px 0px;
    width: 1000%;
    height: 1000%;
    z-index: 1;
    // background: #eee;
    cursor: move;
    cursor: -moz-grab;
    cursor: -webkit-grab;
  }
  .flow-grab {
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  }
  .view-scale {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    font-size: 12px;
  }
  .footer {
    position: absolute;
    bottom: 10px;
    left: 20px;
    z-index: 1;
  }
  .reset {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  }
  .mouse-position {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 1;
  }
  // 遮罩层
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
  }
}

.flow-area {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 10;
}


</style>
