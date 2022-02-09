<template>
  <div v-if="flowVisible" class="index" id="zll-index">
    <div class="flow-menu">
      <div class="section">
        <FlowMenu ref="nodeMenu" v-bind="flowMenuAttrs" v-on="flowMenuEvent" />
        <FlowAttr
          ref="nodeForm"
          @setLineLabel="setLineLabel"
          @repaintEverything="repaintEverything"
          :processArray="processArray"
          :processId="processId"
          :disabled="true"
          :title="title"
        >
        </FlowAttr>
      </div>
    </div>
    <div class="middle">
      <div class="section" ref="section">
        <main
          ref="main"
          @mousedown="mousedownHandler"
          @mouseup="mouseupHandler"
          @mousemove="mousemoveHandler"
        >
          <div class="view-scale">
            節點數量：{{
              data.nodeList !== undefined ? data.nodeList.length : "0"
            }}
          </div>
          <div
            :class="['flow-content', 'grid']"
            :style="{
              transform: `scale(${viewScale})`,
              transformOrigin: `${scalePosition.x}px ${scalePosition.y}px`,
              left: dragMove.left + 'px',
              top: dragMove.top + 'px',
            }"
            @mousewheel="mousewheelHandler"
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
      <el-tabs
        v-model="activeName"
        tab-position="top"
        style="padding: 10px"
        @tab-click="handleClick"
      >
        <el-tab-pane label="歷程" name="first" class="tabClass">
          <el-input
            v-model="input"
            placeholder="請輸入關鍵字"
            style="margin: 5px 5px 10px 0px; width: 100%"
            @input="search"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <template v-for="(item, index) in reversedMessage">
            <div :key="index" style="padding: 5px 8px">
              <span style="display: block">
                <i
                  :class="[
                    {
                      'el-icon-circle-check el-node-state-success':
                        item.state === 1,
                    },
                    {
                      'el-icon-loading el-node-state-running': item.state === 2,
                    },
                    {
                      'el-icon-warning-outline el-node-state-warning':
                        item.state === 3 || item.state === 4,
                    },
                    {
                      'el-icon-circle-close el-node-state-error':
                        item.state === 5,
                    },
                    {
                      'el-icon-refresh el-node-state-running':
                        item.state === 20,
                    },
                  ]"
                ></i
                >{{ item.createTime }}
              </span>
              <span style="display: block">
                {{ changeProcessName(item.cpId) }} - {{ item.name }}
              </span>
              <!-- <span style= "display:block">{{ item.name }} - {{ item.state | changeType }}</span> -->
              <span v-if="item.message" style="display: block; color: red">{{
                item.message
              }}</span>
              <span style="display: block">-----------------------------</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="定位回報" name="third" class="tabClass">
          <template v-for="(item, index) in reversedMessage">
            <div :key="index" style="padding: 5px 8px">
              <span style="display: block">
                {{ item.createTime }}
              </span>
              <span style="display: block">
                {{ item.nodeName }} - {{ item.name }}
              </span>
              <span style="display: block">
                {{ item.state }}
                <i
                  class="el-icon-user-solid"
                  :style="{ color: item.state == '已定位' ? 'red' : 'green' }"
                ></i>
              </span>
              <span style="display: block">-----------------------------</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="撤退追蹤" name="four">
          <template v-for="(item, index) in reversedMessage">
            <div :key="index" style="padding: 5px 8px">
              <span style="display: block">
                {{ item.createTime }}
              </span>
              <span style="display: block">
                {{ item.nodeName }} - {{ item.name }}
              </span>
              <span style="display: block">
                {{ item.state }}
                <i
                  class="el-icon-user-solid"
                  :style="{ color: item.state == '已定位' ? 'red' : 'green' }"
                ></i>
              </span>
              <span style="display: block">-----------------------------</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import "@/utils/jsplumb";
import { flowmixin } from "@/mixin/index";
import {
  CNode,
  ContingencyProcess,
  COption,
  SelfDefenseFireMarshalling,
} from "@/object";
import ws from "@/utils/socket";

export default {
  mixins: [flowmixin],
  created() {
    this.$store.dispatch("app/toggleDevice", "mobile");
    this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
  },
  computed: {
    ...Vuex.mapGetters([
      "process",
      "nodeResult",
      "selectResult",
      "waitingNode",
    ]),
    flowMenuAttrs() {
      return {
        processId: this.processId,
        processArray: this.processArray,
        title: this.title,
      };
    },
    flowMenuEvent() {
      return {
        changeProcess: this.getJsonFile,
      };
    },
    flowEvent() {
      return {
        clickNode: this.clickNode,
      };
    },
    changeProcessName: function () {
      return function (val) {
        var objItem = this.processArray.filter((obj) => {
          return obj.id == val;
        });
        if (objItem.length) {
          var name = objItem[0].name.replace("流程圖", "");
          return name;
        }
        return "";
      };
    },
    reversedMessage: function () {
      return this.list.sort(function (a, b) {
        return new Date(b.createTime) - new Date(a.createTime);
      });
    },
  },
  filters: {
    changeType: function (val) {
      switch (val) {
        case 1:
          return "執行成功";
        case 2:
          return "執行中";
        case 3:
          return "警告";
        case 4:
          return "執行異常";
        case 5:
          return "執行失敗";
        case 20:
          return "等待回應";
      }
    },
  },
  watch: {
    process: {
      //有登入ws&有發生緊急應變才繪製畫面
      handler: async function () {
        if (this.process == true && ws.processWs.floorId !== null) {
          this.$nextTick(async () => {
            this.processArray = await SelfDefenseFireMarshalling.getProcess(
              "/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt",
              ws.processWs.selfDefenseFireMarshallingListId
            );
            await this.getJsonFile(ws.processWs.contingencyProcessId);
          });
        }
      },
      immediate: true,
    },
    nodeResult: {
      handler: async function () {
        if (this.nodeResult.length) {
          this.list = _.cloneDeep(this.nodeResult);
          this.$nextTick(async () => {
            this.updateNodeState();
          });
        }
      },
      immediate: true,
      deep: true,
    },
    // waitingNode: {
    //   handler: async function () {
    //     if (this.waitingNode.length) {
    //       console.log(JSON.stringify(this.waitingNode));
    //     }
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  data() {
    return {
      activeName: "first",
      title: "",
      jsPlumb: null,
      flowVisible: true,
      viewScale: 1,
      scalePosition: {
        x: 0,
        y: 0,
      },
      dragMove: {
        offsetX: -3000,
        offsetY: -3000,
      },
      data: {
        offsetX: -3000,
        offsetY: -3000,
        name: "",
        nodeList: [],
        lineList: [],
      },
      activeElement: {
        type: undefined,
        nodeId: undefined,
        sourceId: undefined,
        targetId: undefined,
      },
      processId: null,
      processArray: [],
      processNodeArray: [],
      processLineArray: [],
      list: [],
      input: "",
    };
  },
  async mounted() {
    this.jsPlumb = jsPlumb.getInstance({ Container: "zll-index" });
    this.title = "selfDefenseClass";
  },
  methods: {
    async getJsonFile(pid = null) {
      //讀取指定的process ID取得JSON，載入流程圖
      if (pid !== null) {
        var result = await ContingencyProcess.getJson(pid);
        this.processId = pid;
        this.processNodeArray = await CNode.get(this.processId);
        this.processLineArray = await COption.getOfProcess(this.processId);
        if (result.codeContent !== undefined) {
          this.$nextTick(() => {
            this.dataReload(JSON.parse(result.codeContent));
          });
        } else {
          this.$nextTick(() => {
            this.dataReload({
              offsetX: -3000,
              offsetY: -3000,
              name: "",
              nodeList: [],
              lineList: [],
            });
          });
        }
      } else {
        this.$nextTick(() => {
          this.dataReload({
            offsetX: -3000,
            offsetY: -3000,
            name: "",
            nodeList: [],
            lineList: [],
          });
        });
      }
    },
    dataReload(data) {
      this.flowVisible = false;
      this.$nextTick(() => {
        data = _.cloneDeep(data);
        this.flowVisible = true;
        this.data = data;
        let { offsetX, offsetY } = this.data;
        if (offsetX && offsetY) {
          this.dragMove = {
            top: offsetY,
            left: offsetX,
          };
        } else {
          this.dragMove = {
            top: "-3000px",
            left: "-3000px",
          };
        }
        this.$nextTick(() => {
          this.jsPlumb = jsPlumb.getInstance({ Container: "zll-index" });
          this.$nextTick(() => {
            this.jsPlumbInit();
            this.updateNodeState();
          });
        });
      });
    },
    jsPlumbInit() {
      this.jsPlumb.ready(() => {
        // 默認配置
        this.jsPlumb.importDefaults(this.jsplumbSetting);
        this.jsPlumb.setSuspendDrawing(false, true);
        this.loadFlow(); // 繪製json
        //點擊線-傳遞資訊到右側
        this.jsPlumb.bind("click", (conn, originalEvent) => {
          this.activeElement.type = "line";
          this.activeElement.sourceId = conn.sourceId;
          this.activeElement.targetId = conn.targetId;
          this.$refs.nodeForm.lineInit({
            id: conn.id,
            from: conn.sourceId,
            to: conn.targetId,
            label: conn.getLabel(),
          });
        });
        // 連線前的判斷：需判斷該連線是否已存在
        this.jsPlumb.bind("beforeDrop", (evt) => {
          return true;
        });
      });
    },
    loadFlow() {
      // 初始化節點
      if (this.data.nodeList !== undefined) {
        for (let node of this.data.nodeList) {
          this.jsPlumb.makeSource(
            node.nodeId,
            _.merge(this.jsplumbSourceOptions, {})
          );
          this.jsPlumb.makeTarget(node.nodeId, this.jsplumbTargetOptions);
          this.jsPlumb.draggable(node.nodeId, {
            containment: "parent",
          });
        }
      }
      // 初始化連線
      if (this.data.lineList !== undefined) {
        this.data.lineList.forEach((line) => {
          var connParam = {
            source: line.from,
            target: line.to,
            label: line.label ? line.label : "",
            connector: line.connector ? line.connector : "",
            anchors: line.anchors ? line.anchors : undefined,
            paintStyle: line.paintStyle ? line.paintStyle : undefined,
          };
          this.jsPlumb.connect(connParam, this.jsplumbConnectOptions);
        });
      }
    },
    clickNode(node) {
      this.activeElement.name = node.name;
      this.activeElement.type = "node";
      this.activeElement.nodeId = node.nodeId;
      this.$refs.nodeForm.nodeInit(this.data, node.nodeId);
    },
    mousedownHandler(e) {
      let event = window.event || e;
      this.dragMove.isDown = true;
      this.dragMove.originalPosition = { ...this.dragMove };
      this.dragMove.downPosition = {
        y: event.y,
        x: event.x,
      };
    },
    mouseupHandler(e) {
      if (
        this.data.offsetX !== this.dragMove.left &&
        this.data.offsetY !== this.dragMove.top
      ) {
        this.data.offsetX = this.dragMove.left;
        this.data.offsetY = this.dragMove.top;
      }
      this.dragMove = { ...this.dragMove, ...{ isDown: false } };
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
      console.log(this.scalePosition.x, this.scalePosition.y);
      console.log(event.layerX, event.layerY);
      console.log(event);
      var x = event.layerX ? event.layerX : event.offsetX;
      var y = event.layerY ? event.layerY : event.offsetY;
      this.scalePosition = {
        x: x,
        y: y,
      };
      if (event.wheelDelta) {
        //ie、google
        if (event.wheelDelta > 0) {
          this.setZoom("enlarge");
        }
        if (event.wheelDelta < 0) {
          this.setZoom("narrow");
        }
      } else if (event.detail) {
        //fox
        if (event.detail > 0) {
          this.setZoom("narrow");
        }
        if (event.detail < 0) {
          this.setZoom("enlarge");
        }
      }
    },
    setZoom(mark) {
      let viewScale = this.viewScale;
      if (mark === "enlarge") {
        viewScale = viewScale > 1.5 ? viewScale : viewScale + 0.05;
      } else if (mark === "narrow") {
        viewScale = viewScale < 0.6 ? viewScale : viewScale - 0.05;
      }
      this.viewScale = viewScale;
    },
    handleClick(tab, event) {
      console.log(tab.index, event);
      switch (tab.index) {
        case "0":
          this.list = _.cloneDeep(this.nodeResult);
          break;
        case "1":
        case "2":
          var _waitnode = _.cloneDeep(this.waitingNode);
          var temp = [];
          _waitnode
            .filter((node) => {
              return tab.index == "1" ? node.nType == 62 : node.nType == 61;
            })
            .forEach((node) => {
              node.linkAccountList.forEach((ac) => {
                var index = node.replyUser.findIndex((rU) => {
                  return rU.id == ac.id;
                });
                temp.push({
                  cpId: node.cpId,
                  createTime: node.createTime,
                  nodeName: node.name,
                  name: ac.name,
                  accountId: ac.id,
                  state:
                    node.state == 20
                      ? "等待回應"
                      : node.state == 1
                      ? index == -1
                        ? "等待回應"
                        : tab.index == "1"
                        ? "已定位"
                        : "已撤退"
                      : "錯誤",
                });
              });
            });
          this.list = temp;
          break;
      }
    },
    updateNodeState() {
      for (const [index, value] of this.nodeResult.entries()) {
        var objItem = this.data.nodeList.filter((obj) => {
          return obj.nodeId == value.nodeId;
        });
        console.log(objItem[0]);
        if (objItem.length) {
          objItem[0].state = value.state;
        }
      }
    },
    search() {
      if (this.input !== "") {
        this.list = this.nodeResult.filter((item) => {
          var cpName = this.changeProcessName(item.cpId);
          if (
            item.name.toLowerCase().includes(this.input.toLowerCase()) ||
            cpName.toLowerCase().includes(this.input.toLowerCase())
          ) {
            return item;
          }
        });
      } else {
        this.list = _.cloneDeep(this.nodeResult);
      }
    },
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

.tabClass {
  text-align: center;
  padding: 5px 8px;
  height: 700px;
  overflow-y: auto;
}
</style>
