<template>
  <div class="editor-container">
    <el-col :xs="24" :sm="24" :md="24" :lg="24">
      <div class="block-wrapper">
        <Block
          ref="block"
          :list-query-params.sync="listQueryParams"
          v-bind="blockAttrs"
          v-on="blockEvent"
        ></Block>
      </div>
    </el-col>

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

    <DialogAuthority
      ref="dialogauthority"
      v-if="authorityVisible === true"
      v-bind="authorityAttrs"
      v-on:handleDialog="handleDialog"
    ></DialogAuthority>
  </div>
</template>
<script>
import { blockmixin, dialogmixin, sharemixin, excelmixin } from "@/mixin/index";
import {  Menu, Role } from "@/object/index";

export default {
  mixins: [sharemixin, blockmixin, dialogmixin, excelmixin],
  data() {
    return {
      roleAccessAuthority: [],
      originalRoleAccessAuthority: [],
      selectRoleId: "",
      accessAuthority: [],
      treeData: [],
      authorityVisible: false,
    };
  },
  computed: {
    blockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getAllRole,
        resetlistQueryParams: this.resetlistQueryParams,
      };
    },
    authorityAttrs() {
      return {
        visible: this.authorityVisible,
        buttonsName: [
          { name: "儲存", type: "primary", status: "authoritycreate" },
          { name: "取消", type: "info", status: "cancel" },
        ],
        title: this.title,
        accessAuthoritiesData: this.treeData,
        accessAuthorities: this.roleAccessAuthority,
      };
    },
  },
  watch: {
    menu: {
      handler: async function () {
        await this.setMenuRoleAccess();
      },
      immediate: true,
    },
  },
  methods: {
    async init() {
      this.title = "roles";
      this.tableConfig = Role.getTableConfig();
      await this.getAllRole();
      this.buttonsName = [
        { name: "刪除", icon: "el-icon-delete", status: "delete" },
        { name: "編輯", icon: "el-icon-edit", status: "open" },
        {
          name: "分配權限",
          icon: "el-icon-magic-stick",
          status: "distribution",
        },
      ];
    },
    async resetlistQueryParams() {
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
        orderBy: "sort",
      };
      await this.getAllRole();
    },
    async getAllRole() {
      this.listQueryParams.orderBy = "sort";
      var data = await Role.getSearchPage(this.listQueryParams);
      this.blockData = data.result;
      this.listQueryParams.total = data.totalPageCount;
    },
    async setMenuRoleAccess() {
      this.accessAuthority = [];
      for (let item of this.menu) {
        for (let obj of item.getAccessAuthorities()) {
          this.accessAuthority.push(obj);
        }
        for (let children of item.getLink()) {
          for (let obj of children.getAccessAuthorities()) {
            this.accessAuthority.push(obj);
          }
        }
      }
    },
    async handleBlock(title, index, content) {
      console.log(title, index, JSON.stringify(content));
      this.dialogConfig = this.tableConfig;
      this.dialogSelect = this.accessAuthority;
      if(index === "distribution"){
        this.selectRoleId = content.getID();
        this.roleAccessAuthority = await content.getAccess("role"); //取得角色所有權限的id
        this.originalRoleAccessAuthority = JSON.parse(
          JSON.stringify(this.roleAccessAuthority)
        );
        this.treeData = this.menu.map((item) => {
          return new Menu(item);
        });
        this.authorityVisible = true;
      }else if (index === "delete" || index === "deleteMany") {
        var isDelete = await this.handleBlockMixin(
          title,
          index,
          content,
          Role
        );
        if (isDelete) {
          await this.getAllRole();
        }
      } else{
        await this.handleBlockMixin(title, index, content, Role);
      }
    },
    async handleDialog(title, index, content) {
      //Dialog相關操作
      console.log(title, index, JSON.stringify(content));
      if (index !== "cancel") {
        if (index === "authoritycreate"){
          var array = this.originalRoleAccessAuthority;
        var array2 = content;
        var remove = [];
        var add = [];
        array.forEach((item) => {
          //以原始的role為基礎 比對是否有移除掉的權限
          var stra = item;
          var count = 0;
          for (var j = 0; j < array2.length; j++) {
            var strb = array2[j];
            if (stra == strb) {
              count++;
            }
          }
          if (count === 0) {
            remove.push(stra);
          }
        });
        array2.forEach((item) => {
          //以原始的role為基礎 比對是否有新增的權限
          var stra = item;
          var count = 0;
          for (var j = 0; j < array.length; j++) {
            var strb = array[j];
            if (stra == strb) {
              count++;
            }
          }
          if (count === 0) {
            add.push(stra);
          }
        });
        console.log("原始", JSON.stringify(array));
        console.log("此次傳來", JSON.stringify(array2));
        console.log("移除", JSON.stringify(remove));
        console.log("新增", JSON.stringify(add));
        var isOk = false;
        var updateArray = [];
        for (let obj of remove) {
          var data = this.accessAuthority.filter(
            (item, index) => item.id == obj
          )[0];
          var array = [];
          var newRole = data.linkRoles.filter(
            (item, index) => item.id !== this.selectRoleId
          );
          newRole.forEach((role) => {
            array.push({ id: role.id });
          });
          data.linkRoles = array;
          updateArray.push(data);
        }
        for (let obj of add) {
          var data = this.accessAuthority.filter(
            (item, index) => item.id == obj
          )[0];
          var array = [];
          data.linkRoles.forEach((role) => {
            array.push({ id: role.id });
          });
          array.push({ id: this.selectRoleId });
          data.linkRoles = array;
          updateArray.push(data);
        }
        isOk = await Role.updateAccessAuthority(updateArray);
        if (isOk) {
          this.$message("更新成功");
          // this.$store.dispatch('permission/setmenu',await Menu.get())
          // this.$socket.sendMsg('menus', 'reset' , await Menu.get())
          await this.getAllRole();
          this.authorityVisible = false;
        } else {
          this.$message.error("系統錯誤");
        }
        }else{
          const { object, isSuccess } = await this.handleDialogMixin(
            title,
            index,
            content,
            Role,
            null
          );
          if(isSuccess){
            await this.getAllRole();
          }
          await this.handleDialogMixin_common(
            Role,
            isSuccess,
            index,
            content,
            object
          );
        }
      }else{
        this.closeAll()
      }
    },
    async changeTable(value) {
      this.isTable = value;
      await this.openDialogWindows()
    },
  },
};
</script>
