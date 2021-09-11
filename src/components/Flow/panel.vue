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
                <!-- <div class="view-scale">縮放：{{ parseInt(viewScale * 100) }}%</div> -->
                <div class="view-scale">節點數量：{{ data.nodeList !== undefined ? data.nodeList.length : '0' }}</div> 
                <div
                :class="['flow-content', 'grid', dragMove.isDown ? 'flow-grab' : null]"
                
                :style="{
                    transform: `scale(${viewScale})`,
                    transformOrigin: `${scalePosition.x}px ${scalePosition.y}px`,
                    left: dragMove.left + 'px',
                    top: dragMove.top + 'px'
                }"
                >
                <!-- @mousewheel="mousewheelHandler"
                 transformOrigin: `${scalePosition.x}px ${scalePosition.y}px`,
                    left: dragMove.left + 'px',
                    top: dragMove.top + 'px', -->
                <div class="flow-area" ref="flowarea">
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
   
    // import jsp from 'jsplumb'
    import '@/utils/jsplumb'
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
                selsectNode:{},
                copyNode:{},
                pasteElement:{left:0,top:0},
                startDragpos:{left:0,top:0},
                endDragpos:{left:0,top:0},
                isMouseDownStop: false,
                dragMove: {
                    offsetX: -3000,
                    offsetY: -3000
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
                //步骤缓存
                flowStepData: [],
                stepIndex: 0,
                //上一步下一步
                state:{
                    offsetX: -3000,
                    offsetY: -3000,
                    name:"",
                    nodeList: [],
                    lineList: []
                }, //狀態
                undo:[], //之前的步驟
                redo:[],
                isUndoRedoing: false //判斷是不是在做上一步&下一步，是的話則刪除線不儲存狀態

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
        created(){
            this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
        },
        mounted() {
            this.jsPlumb = jsPlumb.getInstance({ Container: "zll-index" })
            this.$nextTick(() => {
                this.dataReload({
                    offsetX: -3000,
                    offsetY: -3000,
                    name:"",
                    nodeList: [],
                    lineList: []
                })
            })
            document.onkeydown = async(e) => {
                if (e.keyCode == 46) {
                    this.deleteElement()
                }
                if(e.keyCode == 67 && e.ctrlKey){
                    this.copy()
                }
                if(e.keyCode == 86 && e.ctrlKey){
                    this.paste()
                }
                if(e.keyCode == 90 && e.ctrlKey){ //上一步 Z
                    this.doUndo()
                }
                if(e.keyCode == 89 && e.ctrlKey){ //下一步 y
                    this.doRedo()
                }
                if(e.keyCode == 83 && e.ctrlKey){ //存檔 s
                    
                }
            }
        },
        beforeDestroy(){
            document.onkeydown = async(e) => {
                if (e.keyCode == 46) {
                    return false
                }
                if(e.keyCode == 67 && e.ctrlKey){
                    return false
                }
                if(e.keyCode == 86 && e.ctrlKey){
                    return false
                }
                if(e.keyCode == 90 && e.ctrlKey){ //上一步 Z
                    return false
                }
                if(e.keyCode == 89 && e.ctrlKey){ //下一步 y
                    return false
                }
                if(e.keyCode == 83 && e.ctrlKey){ //存檔 s
                    return false
                }
            }
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
                let event = window.event || e
                let offsetX = event.layerX ? event.layerX : event.offsetX
                let offsetY = event.layerY ? event.layerY : event.offsetY
                this.mousePosition = { x: offsetX, y: offsetY }
                let { downPosition, originalPosition, isDown } = this.dragMove
                if (isDown) {
                    let top = originalPosition.top + (event.y - downPosition.y)
                    let left = originalPosition.left + (event.x - downPosition.x)
                    this.dragMove.top = top
                    this.dragMove.left = left
                }
            },
            // mousewheelHandler(e) {
            //     let event = window.event || e
            //     if (event.wheelDelta) { //ie、google
            //         if (event.wheelDelta > 0) {
            //             this.setZoom("enlarge")
            //         }
            //         if (event.wheelDelta < 0) {
            //             this.setZoom("narrow")
            //         }
            //     } else if (event.detail) { //fox
            //         if (event.detail > 0) {
            //             this.setZoom("narrow")
            //         }
            //         if (event.detail < 0) {
            //             this.setZoom("enlarge")
            //         }
            //     }
            //     this.scalePosition = {
            //         x: event.layerX ? event.layerX : event.offsetX,
            //         y: event.layerY ? event.layerY : event.offsetY
            //     }
            // },
            // setZoom(mark) {
            //     let viewScale = this.viewScale;
            //     if (mark === "enlarge") {
            //         viewScale = viewScale > 1.5 ? viewScale : viewScale + 0.05
            //     } else if (mark === "narrow") {
            //         viewScale = viewScale < 0.5 ? viewScale : viewScale - 0.05
            //     }
            //     this.viewScale = viewScale
            // },
            getUUID() {
                return Math.random().toString(36).substr(3, 10)
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
                            from: conn.sourceId,
                            to: conn.targetId,
                            label: conn.getLabel()
                        })
                    })
                    // 連線前的判斷：需判斷該連線是否已存在
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
                    // 連線：需判斷data-lineList是否已存在
                    this.jsPlumb.bind("connection", (evt) => {
                        let lineId = evt.connection.id
                        let from = evt.sourceId
                        let to = evt.targetId
                        let isExist = this.data.lineList.findIndex((item) => {
                            return item.from === from && item.to === to
                        })
                        if (this.loadFlowFinish && isExist <0) {
                            this.data.lineList.push({id:lineId, from: from, to: to})
                            this.saveState()
                        }  
                    })
                    // 刪除線的回調：若使用deleteEveryConnection，有幾條線就會呼叫幾次
                    this.jsPlumb.bind("connectionDetached", (evt) => {
                        this.data.lineList = this.data.lineList.filter(function (line) {
                            if (line.id == evt.connection.id) {
                                return false
                            }
                            return true
                        })
                        //正在執行上一步下一步時不儲存
                        if(this.isUndoRedoing == false){
                            this.saveState()
                        }
                    })
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
                    }else{
                        this.dragMove = {
                            top: '-3000px',
                            left: '-3000px'
                        }
                    }
                    this.$nextTick(() => {
                        //this.jsPlumbInit()
                        this.jsPlumb = jsPlumb.getInstance({ Container: "zll-index" })
                        this.$nextTick(() => {
                            this.jsPlumbInit()
                        })
                    })
                })
            },
            // 繪製json
            loadFlow() {
                // 初始化節點
                var self = this
                if(this.data.nodeList !== undefined){
                    for(let node of this.data.nodeList){
                        this.jsPlumb.makeSource(node.id, lodash.merge(this.jsplumbSourceOptions, {}))
                        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
                        this.jsPlumb.draggable(node.id, {
                            containment: 'parent',
                            stop: function (el) {
                                this.pasteElement = { left:0, top:0}
                                self.saveState()
                            }
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
                this.$nextTick(function () {
                    this.loadFlowFinish = true
                    //this.jsPlumb.setSuspendDrawing(false, true)
                    this.saveState()
                })
            },
            // 是否具有该线
            hasLine(from, to) {
                for(let line of this.data.lineList){
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
                console.log('label',label)
                var conn = this.jsPlumb.getConnections({
                    source: from,
                    target: to
                })[0]
                this.$nextTick(()=>{
                    console.log(!label || label === '')
                    if (!label || label === '') {
                        conn.removeClass('flowLabel')
                        conn.addClass('emptyFlowLabel')
                    } else {
                        conn.addClass('flowLabel')
                    }
                    conn.setLabel({
                        label: label
                    })
                   
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
                this.selsectNode = lodash.cloneDeep(node)
                this.pasteElement = { left:0, top:0}
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
                    this.$message.error("請把節點拖曳到畫面中")
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
                var nodeName = this.countNodeName(nodeMenu.name)
                var node = {
                    id: nodeId,
                    name: nodeName,
                    type: nodeMenu.type,
                    left: left + 'px',
                    top: top + 'px',
                    ico: nodeMenu.ico,
                    state: 'default',
                    message:'',
                    linkRoles:[],
                    linkAccounts:[],
                    linkOptions:[]
                }
                this.data.nodeList.push(node)
                var self = this
                this.$nextTick(function () {
                    this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
                    this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
                    this.jsPlumb.draggable(nodeId, {
                        containment: 'parent',
                        stop: function (el) {
                            this.pasteElement = { left:0, top:0}
                            self.saveState()
                        }
                    })
                    self.saveState()
                })
            },
            countNodeName(originalName){
                var nodeName = originalName
                var index = 1
                while (index < 100000 && this.data.nodeList !== undefined) {
                    var repeat = false
                    for (var i = 0; i < this.data.nodeList.length; i++) {
                        let node = this.data.nodeList[i]
                        if (node.name === nodeName) {
                            nodeName = originalName + index
                            repeat = true
                        }
                    }
                    if (repeat) {
                        index++
                        continue
                    }
                    break
                }
                return nodeName
            },
            //畫布操作
            handleOperateMenu(operate){
              switch(operate){
                case 'upper-step': //上一步
                    this.doUndo()
                    break;
                case 'next-step': //下一步
                    this.doRedo()
                    break;
                // case 'enlarge':
                //   break;
                // case 'narrow':
                //   break;
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
                    this.data = {
                        offsetX: -3000,
                        offsetY: -3000,
                        name:"",
                        nodeList: [],
                        lineList: []
                    }
                    this.state = lodash.cloneDeep(this.data)
                    this.dragMove = {
                        top: -3000,
                        left: -3000,
                    }
                    this.jsPlumb.deleteEveryEndpoint()
                    this.jsPlumb.deleteEveryConnection()
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
                        this.data.nodeList = this.data.nodeList.filter(item => { return item.id !== this.activeElement.nodeId})
                        this.$nextTick(function () {
                            this.jsPlumb.deleteConnectionsForElement(this.activeElement.nodeId)
                            this.jsPlumb.removeAllEndpoints(this.activeElement.nodeId)
                            this.saveState()
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
                } else {
                    this.$message.error('請選擇要刪除的節點或線')
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
            },
            copy(){
                this.copyNode = lodash.cloneDeep(this.selsectNode)
            },
            paste(){
                if(this.activeElement.type == 'line'){
                    this.$message.error('請勿複製線，請選擇節點並複製')
                    return false
                }else if(Object.keys(this.selsectNode).length == 0){
                    this.$message.error('請選擇節點並複製')
                    return false
                }
                this.copyNode = lodash.cloneDeep(this.selsectNode)
                this.copyNode.id = this.getUUID()
                this.copyNode.name = this.countNodeName(this.copyNode.name)
                var left, top
                if(this.pasteElement.left == 0 && this.pasteElement.top == 0){
                    left = parseInt(this.copyNode.left.replace("px","")) + 8
                    top = parseInt(this.copyNode.top.replace("px","")) + 8
                }else{
                    left = this.pasteElement.left +8
                    top = this.pasteElement.top +8
                }
                this.pasteElement.left = left
                this.pasteElement.top = top
                this.copyNode.left = left + 'px'
                this.copyNode.top = top +'px'
                this.data.nodeList.push(this.copyNode)
                this.$nextTick(function () {
                    this.jsPlumb.makeSource(this.copyNode.id, this.jsplumbSourceOptions)
                    this.jsPlumb.makeTarget(this.copyNode.id, this.jsplumbTargetOptions)
                    this.jsPlumb.draggable(this.copyNode.id, {
                        containment: 'parent'
                    })
                    this.saveState()
                })
            },
            saveState(){ //儲存狀態：新增節點/刪除節點/新增線/刪除線/拖曳節點
                if(JSON.stringify(this.data) === JSON.stringify(this.state)) return  
                this.undo.push(this.state)
                this.state = lodash.cloneDeep(this.data)
                this.redo = []
                console.log('saveState',JSON.stringify(this.state))
            },
            doUndo() { //上一步
                if (this.undo.length === 0) {
                    this.$message.error('目前沒有動作可復原')
                    return
                }
                this.isUndoRedoing = true
                this.$refs.operate.setDisable(true)
                let lastJSON = this.undo.pop() // 取出 undo 最後一筆資料讀取
                console.log('doUndo',JSON.stringify(lastJSON))
                this.redo.push(this.state) // 在做上一步時把目前狀態 push 到 redo 陣列
                this.state = lastJSON // 換成上一步的狀態
                this.jsPlumb.deleteEveryEndpoint()
                this.jsPlumb.deleteEveryConnection()
                this.data = lodash.cloneDeep(this.state)
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
                this.$nextTick(function () {
                    this.jsPlumb.setSuspendDrawing(false, true)
                    this.isUndoRedoing = false
                    this.$refs.operate.setDisable(false)
                })
            },
            doRedo () { //下一步
                if (this.redo.length === 0) {
                    this.$message.error('目前沒有動作可復原')
                    return
                }
                this.isUndoRedoing = true
                 this.$refs.operate.setDisable(true)
                let lastJSON = this.redo.pop()
                console.log('doRedo',JSON.stringify(lastJSON))
                this.undo.push(this.state)
                this.state = lastJSON
                this.jsPlumb.deleteEveryEndpoint()
                this.jsPlumb.deleteEveryConnection()
                this.data = lodash.cloneDeep(this.state)
                this.dataReload(this.data)
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
