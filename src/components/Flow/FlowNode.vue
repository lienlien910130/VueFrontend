<template>
  <div
    ref="node"
    :style="nodeContainerStyle"
    @click="clickNode"
    @mouseup="changeNodeSite"
    :class="nodeContainerClass"
  >
    <div class="ef-node-left"></div>
    <div class="ef-node-left-ico flow-node-drag">
      <i :class="nodeIcoClass"></i>
    </div>
    <div class="ef-node-text" :show-overflow-tooltip="true">
      {{ node.name }}
    </div>
    <div class="ef-node-right-ico">
      <!-- 執行成功=1、執行中=2、警告=3、執行異常=4、執行失敗=5、等待回應=20 -->
      <i
        class="el-icon-circle-check el-node-state-success"
        v-show="node.state === 1"
      ></i>
      <i
        class="el-icon-loading el-node-state-running"
        v-show="node.state === 2"
      ></i>
      <i
        class="el-icon-warning-outline el-node-state-warning"
        v-show="node.state === 3"
      ></i>
      <i
        class="el-icon-warning-outline el-node-state-warning"
        v-show="node.state === 4"
      ></i>
      <i
        class="el-icon-circle-close el-node-state-error"
        v-show="node.state === 5"
      ></i>
      <i
        class="el-icon-refresh el-node-state-running"
        v-show="node.state === 20"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "FlowNode",
  props: {
    title: {
      type: String,
      default: "contingencyProcess",
    },
    node: Object,
    activeElement: Object,
  },
  data() {
    return {};
  },
  computed: {
    nodeContainerClass() {
      return {
        "ef-node-container": true,
        "ef-node-active":
          this.activeElement.type == "node"
            ? this.activeElement.nodeId === this.node.nodeId
            : false,
        "ef-node-running": this.node.state === 20,
      };
    },
    // 节点容器样式
    nodeContainerStyle() {
      return {
        top: this.node.top,
        left: this.node.left,
      };
    },
    nodeIcoClass() {
      var nodeIcoClass = {};
      nodeIcoClass[this.node.icon] = true;
      // 添加该class可以推拽连线出来，viewOnly 可以控制节点是否运行编辑
      if (this.title == "contingencyProcess") {
        nodeIcoClass["flow-node-drag"] = this.node.viewOnly ? false : true;
      } else {
        nodeIcoClass["flow-node-drag"] = false;
      }
      return nodeIcoClass;
    },
  },
  methods: {
    clickNode() {
      this.$emit("clickNode", this.node);
    },
    changeNodeSite() {
      if (
        this.node.left == this.$refs.node.style.left &&
        this.node.top == this.$refs.node.style.top
      ) {
        return;
      }
      this.$emit("changeNodeSite", {
        nodeId: this.node.nodeId,
        left: this.$refs.node.style.left,
        top: this.$refs.node.style.top,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/*节点的最外层容器*/
.ef-node-container {
  position: absolute;
  display: flex;
  width: 170px;
  height: 32px;
  border: 1px solid #e0e3e7;
  border-radius: 5px;
  background-color: #fff;
}

.ef-node-container:hover {
  cursor: move;
  background-color: #f0f7ff;
  border: 2px dashed #1879ff;
}

/*节点激活样式*/
.ef-node-active {
  background-color: #f0f7ff;
  border: 1px solid #1879ff;
}

.ef-node-running {
  background-color: orangered;
}

/*节点左侧的竖线*/
.ef-node-left {
  width: 4px;
  background-color: #0075a9;
  border-radius: 4px 0 0 4px;
}

/*节点左侧的图标*/
.ef-node-left-ico {
  line-height: 32px;
  margin-left: 8px;
}

.ef-node-left-ico:hover .flow-node-drag {
  /* 设置拖拽的样式 */
  cursor: crosshair;
}

/*节点显示的文字*/
.ef-node-text {
  color: #565758;
  font-size: 16px;
  line-height: 32px;
  margin-left: 8px;
  width: 100px;
  /* 设置超出宽度文本显示方式*/
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

/*节点右侧的图标*/
.ef-node-right-ico {
  line-height: 32px;
  position: absolute;
  right: 5px;
  color: #84cf65;
  cursor: default;
}

/*節點狀態樣式*/

.el-node-state-success {
  line-height: 32px;
  position: absolute;
  right: 5px;
  color: #84cf65;
  cursor: default;
}

.el-node-state-error {
  line-height: 32px;
  position: absolute;
  right: 5px;
  color: #f56c6c;
  cursor: default;
}

.el-node-state-warning {
  line-height: 32px;
  position: absolute;
  right: 5px;
  color: #e6a23c;
  cursor: default;
}

.el-node-state-running {
  line-height: 32px;
  position: absolute;
  right: 5px;
  color: #84cf65;
  cursor: default;
}

.ef-drop-hover {
  border: 1px dashed #1879ff;
}
</style>
