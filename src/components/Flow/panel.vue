<template>
    <div
    v-if="flowVisible"
    class="index"
    id="zll-index"
  >
    <div class="flow-menu">
      <div class="section">
        <FlowMenu @addNode="addNode" ref="nodeMenu"/>
      </div>
    </div>
    <div class="middle">
        <header>
            <HeaderOperate ref="operate" @handleOperateMenu="handleOperateMenu" />
        </header>
        <div class="section" ref="section">
            <main
                ref="main"
                @mousedown="mousedownHandler"
                @mouseup="mouseupHandler"
                @mousemove="mousemoveHandler"
            >
                <div class="view-scale">縮放：{{ parseInt(viewScale * 100) }}%</div>
                <div
                :class="['flow-content', 'grid', dragMove.isDown ? 'flow-grab' : null]"
                @mousewheel="mousewheelHandler"
                :style="{
                    transform: `scale(${viewScale})`,
                    transformOrigin: `${scalePosition.x}px ${scalePosition.y}px`,
                    left: dragMove.left + 'px',
                    top: dragMove.top + 'px',
                }"
                >
                <div class="flow-area">
                    <template v-for="node in data.nodeList">
                        <FlowNode
                                :id="node.id"
                                :key="node.id"
                                :node="node"
                                :activeElement="activeElement"
                                v-on="flowEvent"
                        >
                        </FlowNode>
                    </template>
                </div>
                </div>
                <div class="mouse-position">x: {{ mousePosition.x }}, y: {{ mousePosition.y }}</div>
            </main>
      </div>
    </div>
    <div class="flow-attr">
       <FlowAttr ref="nodeForm" @setLineLabel="setLineLabel" @repaintEverything="repaintEverything"></FlowAttr>
    </div>
    <FlowInfo v-if="flowInfoVisible" ref="flowInfo" :data="data"></FlowInfo>
    <input type="file" ref="inputFile" @change="handleExportFile" style="display: none" />
  </div>

</template>

<script>
    import draggable from 'vuedraggable'
    import jsp from 'jsplumb'
    import { flowmixin } from '@/mixin/index'
    import lodash from 'lodash'
    import { uploadFile } from '@/utils'

    export default {
        data() {
            return {
                flowList:[
                    { id:'1', name:'流程B'},
                    { id:'0', name:'流程A'},
                ],
                flowId:'0',
                jsPlumb: null,
                flowVisible: true, //用於銷毀節點&連線
                loadFlowFinish: false, //繪製節點&連線是否完成
                flowInfoVisible: false, //數據檢視視窗
                data: {},
                activeElement: {
                    type: undefined,
                    nodeId: undefined,
                    sourceId: undefined,
                    targetId: undefined
                },
                isMouseDownStop: false,
                dragMove: {
                    offsetX: -3000,
                    offsetY: -3000,
                    name:"",
                    nodeList: [],
                    lineList: []
                },
                 viewScale: 1,
                scalePosition: {
                    x: 0,
                    y: 0,
                },
                 mousePosition: {
                    x: 0,
                    y: 0,
                },
            }
        },
        mixins: [flowmixin],
        computed:{
            flowEvent(){
                return{
                    changeNodeSite:this.changeNodeSite,
                    clickNode:this.clickNode
                }
            }
        },
        components: {
            draggable
        },
        mounted() {
            this.jsPlumb = jsp.jsPlumb.getInstance()
            this.$nextTick(() => {
                this.dataReload(this.dragMove)
            })
        },
        methods: {
            mousedownHandler(e) {
                let event = window.event || e;
                this.dragMove.isDown = true;
                this.dragMove.originalPosition = { ...this.dragMove };
                this.dragMove.downPosition = {
                    y: event.y,
                    x: event.x,
                }
            },
            mouseupHandler(e) {
                if (this.data.offsetX !== this.dragMove.left && this.data.offsetY !== this.dragMove.top) {
                    this.data.offsetX = this.dragMove.left
                    this.data.offsetY = this.dragMove.top
                }
                this.dragMove = { ...this.dragMove, ...{ isDown: false } }
            },
            mousemoveHandler(e) {
                let event = window.event || e;
                let offsetX = event.layerX ? event.layerX : event.offsetX;
                let offsetY = event.layerY ? event.layerY : event.offsetY;
                this.mousePosition = { x: offsetX, y: offsetY };
                let { downPosition, originalPosition, isDown } = this.dragMove;
                if (isDown) {
                    let top = originalPosition.top + (event.y - downPosition.y);
                    let left = originalPosition.left + (event.x - downPosition.x);
                    this.dragMove.top = top;
                    this.dragMove.left = left;
                }
            },
            mousewheelHandler(e) {
                let event = window.event || e;
                if (event.wheelDelta) { //ie、google
                    if (event.wheelDelta > 0) {
                        this.setZoom("enlarge");
                    }
                    if (event.wheelDelta < 0) {
                        this.setZoom("narrow");
                    }
                } else if (event.detail) { //fox
                    if (event.detail > 0) {
                        this.setZoom("narrow");
                    }
                    if (event.detail < 0) {
                        this.setZoom("enlarge");
                    }
                }
                this.scalePosition = {
                    x: event.layerX ? event.layerX : event.offsetX,
                    y: event.layerY ? event.layerY : event.offsetY,
                }
            },
            setZoom(mark) {
                let viewScale = this.viewScale;
                if (mark === "enlarge") {
                    viewScale = viewScale > 1.5 ? viewScale : viewScale + 0.05;
                } else if (mark === "narrow") {
                    viewScale = viewScale < 0.5 ? viewScale : viewScale - 0.05;
                }
                this.viewScale = viewScale;
            },
            getUUID() {
                return Math.random().toString(36).substr(3, 10)
            },
            jsPlumbInit() {
                this.jsPlumb.ready(() => {
                    // 默認配置
                    this.jsPlumb.importDefaults(this.jsplumbSetting)
                    this.jsPlumb.setSuspendDrawing(false, true)
                    this.loadEasyFlow() // 繪製json
                    //點擊線-傳遞資訊到右側
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
                    // 連線前的判斷
                    this.jsPlumb.bind("beforeDrop", (evt) => {
                        let from = evt.sourceId
                        let to = evt.targetId
                        if (from === to) {
                            this.$message.error('節點不支援連接自己')
                            return false
                        }
                        if (this.hasLine(from, to)) {
                            this.$message.error('該關係已存在，不允許重複')
                            return false
                        }
                        if (this.hashOppositeLine(from, to)) {
                            this.$message.error('不支援兩點之間循環')
                            return false
                        }
                        this.$message.success('連接成功')
                        return true
                    })
                    // 連線
                    this.jsPlumb.bind("connection", (evt) => {
                        let from = evt.source.id
                        let to = evt.target.id
                        if (this.loadFlowFinish) {
                            this.data.lineList.push({from: from, to: to})
                        }
                    })
                    // 刪除線的回調  beforeDetach:刪除線前的回調
                    this.jsPlumb.bind("connectionDetached", (evt) => {
                        this.data.lineList = this.data.lineList.filter(function (line) {
                            if (line.from == evt.sourceId && line.to == evt.targetId) {
                                return false
                            }
                            return true
                        })
                    })
                    this.jsPlumb.setContainer(this.$refs.efContainer)
                })
            },
            dataReload(data) {
                this.flowVisible = false
                this.$nextTick(() => {
                    data = lodash.cloneDeep(data)
                    this.flowVisible = true
                    this.data = data
                    let { offsetX, offsetY } = this.data
                    if (offsetX && offsetY) {
                        this.dragMove = {
                            top: offsetY,
                            left: offsetX,
                        }
                    }
                    this.$nextTick(() => {
                        this.jsPlumb = jsPlumb.getInstance()
                        this.$nextTick(() => {
                            this.jsPlumbInit()
                        })
                    })
                })
            },
            // 繪製json
            loadEasyFlow() {
                // 初始化節點
                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    this.jsPlumb.makeSource(node.id, lodash.merge(this.jsplumbSourceOptions, {}))
                    this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
                    this.jsPlumb.draggable(node.id, {
                        containment: 'parent',
                        stop: function (el) {
                            console.log('拖拽结束: ', el)
                        }
                    })
                }
                // 初始化連線
                for (var i = 0; i < this.data.lineList.length; i++) {
                    let line = this.data.lineList[i]
                    var connParam = {
                        source: line.from,
                        target: line.to,
                        label: line.label ? line.label : '',
                        connector: line.connector ? line.connector : '',
                        anchors: line.anchors ? line.anchors : undefined,
                        paintStyle: line.paintStyle ? line.paintStyle : undefined,
                    }
                    this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
                }
                this.$nextTick(function () {
                    this.loadFlowFinish = true
                })
            },
            // 是否具有该线
            hasLine(from, to) {
                for (var i = 0; i < this.data.lineList.length; i++) {
                    var line = this.data.lineList[i]
                    if (line.from === from && line.to === to) {
                        return true
                    }
                }
                return false
            },
            // 是否含有相反的线
            hashOppositeLine(from, to) {
                return this.hasLine(to, from)
            },
            //右邊傳來的事件
            // 設置線的備註
            setLineLabel(from, to, label) {
                var conn = this.jsPlumb.getConnections({
                    source: from,
                    target: to
                })[0]
                if (!label || label === '') {
                    conn.removeClass('flowLabel')
                    conn.addClass('emptyFlowLabel')
                } else {
                    conn.addClass('flowLabel')
                }
                conn.setLabel({
                    label: label,
                })
                this.data.lineList.forEach(function (line) {
                    if (line.from == from && line.to == to) {
                        line.label = label
                    }
                })
            },
            repaintEverything() {
                this.jsPlumb.repaint()
            },
            //node傳來的事件
            //點擊節點-在節點組件呼叫回來
            clickNode(node) { 
                this.activeElement.name = node.name
                this.activeElement.type = 'node'
                this.activeElement.nodeId = node.id
                this.$refs.nodeForm.nodeInit(this.data, node.id)
            },
            // 改變節點位置
            changeNodeSite(data) {
                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    if (node.id === data.nodeId) {
                        node.left = data.left
                        node.top = data.top
                    }
                }
            },
            //menu傳來的事件
            addNode(evt, nodeMenu, mousePosition) {
                var screenX = evt.originalEvent.clientX, screenY = evt.originalEvent.clientY
                let efContainer = this.$refs.section
                var containerRect = efContainer.getBoundingClientRect()
                var left = screenX, top = screenY
                // 计算是否拖入到容器中
                if (left < containerRect.x || left > containerRect.width + containerRect.x || top < containerRect.y || 
                containerRect.y > containerRect.y + containerRect.height) {
                    this.$message.error("请把节点拖入到画布中")
                    return
                }
                // left = left - containerRect.x + efContainer.scrollLeft
                // top = top - containerRect.y + efContainer.scrollTop
                left = this.mousePosition.x
                top = this.mousePosition.y
                // 居中
                left -= 85
                top -= 16
                var nodeId = this.getUUID()
                // 动态生成名字
                var origName = nodeMenu.name
                var nodeName = origName
                var index = 1
                while (index < 10000) {
                    var repeat = false
                    for (var i = 0; i < this.data.nodeList.length; i++) {
                        let node = this.data.nodeList[i]
                        if (node.name === nodeName) {
                            nodeName = origName + index
                            repeat = true
                        }
                    }
                    if (repeat) {
                        index++
                        continue
                    }
                    break
                }
                var node = {
                    id: nodeId,
                    name: nodeName,
                    type: nodeMenu.type,
                    left: left + 'px',
                    top: top + 'px',
                    ico: nodeMenu.ico,
                    state: 'success'
                }
                /**
                 * 这里可以进行业务判断、是否能够添加该节点
                 */
                this.data.nodeList.push(node)
                this.$nextTick(function () {
                    this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
                    this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
                    this.jsPlumb.draggable(nodeId, {
                        containment: 'parent',
                        stop: function (el) {
                            // 拖拽节点结束后的对调
                            console.log('拖拽结束: ', el)
                        }
                    })
                })
            },
            //畫布操作
            handleOperateMenu(operate){
              switch(operate){
                case 'upper-step':
                  break;
                case 'next-step':
                  break;
                case 'enlarge':
                  break;
                case 'narrow':
                  break;
                case 'delete':
                  this.deleteElement()
                  break;
                case 'import':
                  this.$refs.inputFile.click()
                  break;
                case 'export':
                  this.downloadData()
                  break;
                case 'view-code':
                  this.dataInfo()
                  break;
                case 'save':
                  //儲存檔案&儲存節點
                  break;
                case 'clear':
                    this.dataReload({
                        offsetX: -3000,
                        offsetY: -3000,
                        name:"",
                        nodeList: [],
                        lineList: []
                    })
                    this.dragMove = {
                        top: -3000,
                        left: -3000,
                    }
                  break;
              }
            },
            // 刪除節點or線
            deleteElement() {
                if (this.activeElement.type === 'node') {
                    this.$confirm('確定要刪除節點名稱【' + this.activeElement.name + '】?', '提示', {
                        confirmButtonText: '確定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        closeOnClickModal: false
                    }).then(() => {
                        this.data.nodeList = this.data.nodeList.filter(function (node) {
                            if (node.id === nodeId) {
                                // 伪删除，将节点隐藏，否则会导致位置错位
                                // node.show = false
                                return false
                            }
                            return true
                        })
                        this.$nextTick(function () {
                            this.jsPlumb.removeAllEndpoints(nodeId)
                        })
                    }).catch(() => {
                    })
                } else if (this.activeElement.type === 'line') {
                    this.$confirm('確定要刪除所點擊的線嗎?', '提示', {
                        confirmButtonText: '確定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var conn = this.jsPlumb.getConnections({
                            source: this.activeElement.sourceId,
                            target: this.activeElement.targetId
                        })[0]
                        this.jsPlumb.deleteConnection(conn)
                    }).catch(() => {
                    })
                }
            },
            // 檢視數據
            dataInfo() {
                this.flowInfoVisible = true
                this.$nextTick(function () {
                    this.$refs.flowInfo.init()
                })
            },
            downloadData() {
                this.$confirm('確定要下載數據嗎？', '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    var datastr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, '\t'));
                    var downloadAnchorNode = document.createElement('a')
                    downloadAnchorNode.setAttribute("href", datastr);
                    downloadAnchorNode.setAttribute("download", 'data.json')
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                    this.$message.success("正在下載，請稍後...")
                }).catch(() => {
                })
            },
            handleExportFile(){
              uploadFile(this.$refs.inputFile, (content) => {
                this.dataReload(JSON.parse(content))
              })
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
    width: 280px;
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
