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
    <!-- <Dialog
                v-bind="dialogAttrs"
                v-on:handleDialog="handleDialog"></Dialog> -->
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
import { Menu } from "@/object/index";

export default {
  mixins: [sharemixin, blockmixin, dialogmixin, excelmixin],
  watch: {
    menu: {
      handler: async function () {
        this.blockData = [];
        var data = this.menu.map((item) => {
          return item.clone(item);
        });
        this.treeData = data
          .map((element) => {
            this.$set(element, "children", element.getLink());
            element.getLink().map((children) => {
              this.$set(children, "children", children.getLink());
              return children;
            });
            return element;
          })
          .filter((item) => {
            return (
              item.code !== "sys-Setting" &&
              item.code !== "sys-Building" &&
              item.code !== "sys-Index"
            );
          });
        this.treeData.unshift(
          new Menu({
            id: "0",
            sort: "0",
            name: "主選單",
          })
        );
        if (this.selectId !== null) {
          if (this.selectId == "0") {
            this.$refs.menuTree.setHighlight(this.selectId);
            var a = this.menu.map((item) => {
              return item.clone(item);
            });
            this.blockData = a;
          } else {
            this.$refs.menuTree.setHighlight(this.selectId);
            var array = [];
            for (let element of this.treeData) {
              array.push(element);
              array.push(element.linkMainMenus);
            }
            var concatarray = array.reduce(function (a, b) {
              return a.concat(b);
            }, []);
            var data = concatarray.filter((item) => {
              return item.id == this.selectId;
            })[0];
            this.blockData = data.getLink();
          }
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      //tree
      treeData: [],
      selectId: null,
    };
  },
  computed: {
    blockEvent() {
      return {
        handleBlock: this.handleBlock,
      };
    },
  },
  methods: {
    async init() {
      this.title = "mainMenu";
      this.tableConfig = Menu.getTableConfig();
      this.hasSearch = false;
      this.$nextTick(() => {
        document.getElementById("menuTree").style.height =
          document.getElementById("parent").clientHeight + "px";
      });
    },
    async handleTreeNode(node, data) {
      console.log(node, data);
      this.blockData = data.getLink();
      this.selectId = data.getID();
      if (this.selectId == "0") {
        var a = this.menu
          .map((item) => {
            return item.clone(item);
          })
          .sort((x, y) => x.sort - y.sort);
        this.blockData = a;
      }
    },
    async handleBlock(title, index, content) {
      console.log(title, index, JSON.stringify(content));
      this.dialogConfig = this.tableConfig;
      this.dialogData = [];
      if (index === "delete" || index === "deleteMany") {
        var isDelete = await this.handleBlockMixin(title, index, content, Menu);
      } else {
        if (index === "exportExcel" || index === "uploadExcel") {
          if (this.selectId == null) {
            this.$message.error({
              message: "請選擇目錄",
            });
            return false;
          }
        }
        await this.handleBlockMixin(title, index, content, Menu);
      }
    },
    async handleDialog(title, index, content) {
      //Dialog相關操作
      console.log(title, index, JSON.stringify(content));
      if (index !== "cancel") {
        delete content.linkMainMenus;
        delete content.linkAccessAuthorities;
        const { object, isSuccess } = await this.handleDialogMixin(
          title,
          index,
          content,
          Menu,
          null,
          this.selectId == "0" ? null : this.selectId,
          { mainMenuId: this.selectId, content: content }
        );
        if (isSuccess) {
          this.$socket.sendMsg("mainMenu", "routes", "");
        }
        await this.handleDialogMixin_common(
          Menu,
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
