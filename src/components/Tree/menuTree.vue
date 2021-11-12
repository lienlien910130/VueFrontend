<template>
  <div>
    <div>
      <h3>目錄</h3>
    </div>
    <div
      style="height: calc(100vh - 280px); overflow-x: hidden; overflow-y: auto"
    >
      <el-tree
        ref="tree"
        :data="treeData"
        empty-text=""
        highlight-current
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <span
          class="custom-tree-node"
          slot-scope="{ node, data }"
          @click="select(node, data)"
        >
          <span>
            {{ data.getName() }}
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuTree",
  props: {
    treeData: {
      type: Array,
      required: true,
    },
  },
  methods: {
    select(node, data) {
      this.$emit("handleTreeNode", node, data);
    },
    setHighlight(selectId) {
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(selectId);
      });
    },
  },
};
</script>
