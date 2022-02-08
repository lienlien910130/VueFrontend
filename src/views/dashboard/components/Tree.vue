<template>
  <div>
    <el-input placeholder="輸入關鍵字" v-model="filterText"> </el-input>

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
        style="width: 100%"
        @click="node.level === 3 ? handleNodeClick(node, data) : null"
      >
        <span>{{ node.label }}</span>
        <span v-if="node.level !== 3" class="count">{{ data.count }}</span>
      </span>
    </el-tree>

    <!-- <el-tree
      class="filter-tree"
      :data="resData"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      ref="tree"
    >
    </el-tree> -->
  </div>
</template>

<script>
import { removeDuplicates } from "@/utils/index";
import { Device } from "@/object";
import { computedmixin } from "@/mixin/index";

export default {
  mixins: [computedmixin],
  props: {
    treeData: {
      type: Array,
    },
    currentNode: {
      type: String,
    },
  },
  data() {
    return {
      filterText: "",
      resData: [],
      savaData: [],
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: "leaf",
        count: "count",
      },
      defaultExpandedKeys: ["-1"],
      deviceOptions: [],
    };
  },
  watch: {
    treeData: {
      handler: async function () {
        if (this.treeData.length > 0) {
          await this.init();
        }
      },
      immediate: true,
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    currentNode: function () {
      this.$nextTick(() => {
        this.setAllExpand(false);
        this.defaultExpandedKeys = [];
        this.defaultExpandedKeys.push(this.currentNode);
        this.$refs.tree.setCurrentKey(this.currentNode);
      });
    },
  },
  methods: {
    async init() {
      this.savaData = [];
      for (let obj of this.treeData) {
        //設備狀況
        var node = {
          id: obj.status,
          name: obj.name,
          count: obj.value,
          children: [],
        };
        var d = removeDuplicates(obj.data, "type");
        var newArray = d.filter((item) => {
          return Object.keys(item).length !== 0;
        });
        for (let item of newArray) {
          //針對設備種類篩選對應的
          var typedata = obj.data.filter((element, index) => {
            return element.type == item.type;
          });
          const _temp = {
            id:
              item.linkDeviceTypes.length !== 0
                ? item.linkDeviceTypes[0].id
                : "",
            name: item.getOnlyTypeName(),
            count: typedata.length,
            leaf: false,
            children: typedata,
          };
          //console.log(_temp);
          node.children.push(_temp);
        }
        this.savaData.push(node);
      }
      this.resData = this.savaData;
    },
    handleNodeClick(node, data) {
      console.log(node, data);
      const h = this.$createElement;
      var config = Device.getTableConfig().filter((item) => {
        return item.isShow == true;
      });
      var showList = [];
      config.forEach((item) => {
        var value = this.changeShowText(
          item.prop,
          item.formType,
          item.format,
          data
        );
        showList.push(
          h("p", { style: "width:100%" }, [
            h(
              "span",
              { style: "width:40%;display:inline-block;vertical-align:top" },
              item.label
            ),
            h(
              "span",
              { style: "width:60%;display:inline-block;vertical-align:top" },
              value
            ),
          ])
        );
      });
      this.$msgbox({
        title: data.getName(),
        message: h("div", null, showList),
        showCancelButton: true,
        distinguishCancelAndClose: true,
        confirmButtonText: "編輯",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            done();
            this.$router.push({
              name: "devicesManagement",
              params: { type: "open", target: new Array(data) },
            });
          } else {
            done();
          }
        },
      })
        .then((action) => {
          done();
        })
        .catch(() => {});
    },
    changeShowText(prop, formType, format, data) {
      switch (formType) {
        case "date":
          return this.dataStr(data, format, prop);
        case "select":
        case "singleChoice":
          return this.changeShowFormat(format, data, prop);
        case "selectSetting":
          return this.changeOptionName(data[prop]);
        default:
          return data[prop];
      }
    },
    filterNode(value, data) {
      if (value.length === 0) {
        this.setAllExpand(false);
      }
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    setAllExpand(state) {
      this.changeTreeNodeStatus(this.$refs.tree.store.root);
    },
    changeTreeNodeStatus(node) {
      for (let i = 0; i < node.childNodes.length; i++) {
        node.childNodes[i].expanded = false;
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeNodeStatus(node.childNodes[i]);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tree-node__label {
  font-size: 22px;
}

.count {
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
}
</style>
