<template>
  <div class="editor-container">
    <el-row :gutter="32" id="parent">
      <el-col :xs="24" :sm="24" :md="24" :lg="7">
        <div class="block-wrapper" id="menuTree">
          <MenuTree
            ref="menuTree"
            :treeData="treeData"
            v-on:handleTreeNode="handleTreeNode"
          >
          </MenuTree>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="17">
        <div class="block-wrapper">
          <Block
            ref="block"
            :list-query-params.sync="listQueryParams"
            v-bind="blockAttrs"
            v-on="blockEvent"
          ></Block>
        </div>
      </el-col>
    </el-row>
    <DialogForm
      ref="dialogform"
      v-if="innerVisible === true"
      v-bind="dialogAttrs"
      v-on:handleDialog="handleDialog"
    ></DialogForm>

    <DialogExcel
      ref="dialogexcel"
      v-if="excelVisible === true"
      v-bind="excelAttrs"
      v-on:handleDialog="handleDialog"
    ></DialogExcel>
  </div>
</template>
<script>
import { blockmixin, dialogmixin, sharemixin, excelmixin } from "@/mixin/index";
import { AccessAuthority } from "@/object/index";

export default {
  mixins: [sharemixin, blockmixin, dialogmixin, excelmixin],
  data() {
    return {
      //tree
      treeData: [],
      selectId: null,
      classCode: "",
    };
  },
  computed: {
    blockEvent() {
      return {
        handleBlock: this.handleBlock,
      };
    },
  },
  watch: {
    menu: {
      handler: async function () {
        this.blockData = [];
        var data = this.menu.map((item) => {
          return item.clone(item);
        });
        this.treeData = data.map((element) => {
          this.$set(element, "children", element.getLink());
          element.getLink().map((children) => {
            this.$set(children, "children", children.getLink());
            return children;
          });
          return element;
        });
        if (this.selectId !== null) {
          this.$refs.menuTree.setHighlight(this.selectId);
          var data = await AccessAuthority.get(this.selectId);
          this.blockData = data.result;
        }
      },
      immediate: true,
    },
  },
  methods: {
    async init() {
      this.title = "accessAuthority";
      this.tableConfig = AccessAuthority.getTableConfig();
      this.hasSearch = false;
      this.$nextTick(() => {
        document.getElementById("menuTree").style.height =
          document.getElementById("parent").clientHeight + "px";
      });
    },
    async handleTreeNode(node, data) {
      this.selectId = data.getID();
      this.classCode = data.getCode();
      var array = await AccessAuthority.get(this.selectId);
      this.blockData = array.result;
    },
    async handleBlock(title, index, content) {
      console.log(title, index, JSON.stringify(content));
      this.dialogConfig = this.tableConfig;
      this.dialogData = [];
      if (index === "delete" || index === "deleteMany") {
        var isDelete = await this.handleBlockMixin(
          title,
          index,
          content,
          AccessAuthority
        );
        if (isDelete) {
          var array = await AccessAuthority.get(this.selectId);
          this.blockData = array.result;
        }
      } else {
        if (
          index === "empty" ||
          index === "exportExcel" ||
          index === "uploadExcel"
        ) {
          if (this.selectId == null) {
            this.$message.error({
              message: "請選擇目錄",
            });
            return false;
          }
        }
        await this.handleBlockMixin(title, index, content, AccessAuthority);
      }
    },
    async handleDialog(title, index, content) {
      //Dialog相關操作
      console.log(title, index, JSON.stringify(content));
      if (index !== "cancel") {
        if (index === "create") {
          content.setlinkMainMenus([{ id: this.selectId }]);
          content.class = this.classCode;
        } else if (index === "uploadExcelSave") {
          content.forEach((element) => {
            element.class = "{Check}" + this.classCode;
            element.linkMainMenus = [{ id: this.selectId }];
          });
        }
        const { object, isSuccess } = await this.handleDialogMixin(
          title,
          index,
          content,
          AccessAuthority,
          null
        );
        if (isSuccess) {
          var array = await AccessAuthority.get(this.selectId);
          this.blockData = array.result;
        }
        await this.handleDialogMixin_common(
          AccessAuthority,
          isSuccess,
          index,
          content,
          object
        );
      } else {
        this.closeAll();
      }
    },
    async changeTable(value) {
      this.isTable = value;
    },
  },
};
</script>
