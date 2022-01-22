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

    <!-- <DialogTable
      ref="dialogtable"
      v-if="tableVisible === true"
      v-bind="tableAttrs"
      v-on="tableEvent"
    ></DialogTable> -->
  </div>
</template>
<script>
import { blockmixin, dialogmixin, sharemixin, excelmixin } from "@/mixin/index";
import { Menu, Role, Account } from "@/object/index";
import CharacterStatus from "@/object/characterStatus";

export default {
  mixins: [sharemixin, blockmixin, dialogmixin, excelmixin],
  computed: {
    blockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getAllAccount,
        resetlistQueryParams: this.resetlistQueryParams,
      };
    },
    authorityAttrs() {
      return {
        visible: this.authorityVisible,
        isHasButtons: false,
        title: this.title,
        accessAuthoritiesData: this.treeData,
        accessAuthorities: this.roleAccessAuthority,
      };
    },
    // tableEvent() {
    //   return {
    //     handleTableClick: this.handleTableClick,
    //     clickPagination: this.handleTableClick,
    //   };
    // },
  },
  watch: {
    menu: {
      handler: async function () {
        await this.setMenuRoleAccess();
      },
      immediate: true,
    },
  },
  data() {
    return {
      roleAccessAuthority: [],
      treeData: [],
      accessAuthority: [],
      authorityVisible: false,
      account: null,
    };
  },
  methods: {
    async init() {
      this.title = "account";
      this.tableConfig = Account.getTableConfig();
      await this.getAllAccount();
      this.buttonsName = [
        { name: "刪除", icon: "el-icon-delete", status: "delete" },
        { name: "編輯", icon: "el-icon-edit", status: "open" },
        { name: "查看權限", icon: "el-icon-view", status: "distribution" },
      ];
      // if(this.account_record == 0){
      //     this.$store.dispatch('building/setaccounts')
      //     this.$store.dispatch('record/saveAccountRecord',1)
      // }
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
    async resetlistQueryParams() {
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
      };
      await this.getAllAccount();
    },
    async getAllAccount() {
      var data = await Account.getSearchPage(this.listQueryParams);
      this.blockData = data.result;
      this.listQueryParams.total = data.totalPageCount;
    },
    // async getAccountCharacterStatus() {
    //   var data = await CharacterStatus.getSearchPage(
    //     "accountSetting",
    //     this.account.getID(),
    //     this.tablelistQueryParams
    //   );
    //   this.tableTitle = "accountOfCharacterStatus";
    //   this.dialogtableConfig = CharacterStatus.getTableConfig();
    //   this.tableData = data.result;
    //   this.tablelistQueryParams.total = data.totalPageCount;
    // },
    // async resettablelistQueryParams() {
    //   this.tablelistQueryParams = {
    //     pageIndex: 1,
    //     pageSize: 10,
    //     total: 0,
    //   };
    //   await this.getAccountCharacterStatus();
    // },
    async handleBlock(title, index, content) {
      console.log(title, index, JSON.stringify(content));
      this.dialogData = [];
      this.dialogConfig = Account.getTableConfig();
      this.dialogTitle = this.title;
      this.dialogSelect = this.accessAuthority;
      this.dialogButtonsName = [];
      if (index === "open") {
        this.dialogConfig[6].label = "生日";
        this.dialogConfig[2].isEdit = false;
        this.dialogConfig[2].mandatory = false;
        this.dialogData.push(content);
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "update" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
        this.account = content;
        this.dialogStatus = "update";
      } else if (index === "delete" || index === "deleteMany") {
        var isDelete = false;
        if (index === "delete") {
          isDelete = await content.delete();
        } else {
          var deleteArray = [];
          content.forEach((item) => {
            deleteArray.push(item.id);
          });
          isDelete = await Account.deleteMany(deleteArray.toString());
        }
        if (isDelete) {
          this.$message("刪除成功");
          var length = content.length !== undefined ? content.length : 1;
          var page = Math.ceil(
            (this.listQueryParams.total - length) /
              this.listQueryParams.pageSize
          );
          if (this.listQueryParams.pageIndex > page) {
            this.listQueryParams.pageIndex = page;
          }
          // this.$store.dispatch('building/setaccounts')
          this.$store.dispatch("building/setCommittee");
          this.$socket.sendMsg(
            "account",
            "delete",
            index === "delete" ? content.getID() : deleteArray.toString()
          );
          await this.getAllAccount();
          this.$refs.block.clearSelectArray();
        } else {
          this.$message.error("系統錯誤");
        }
      } else if (index === "empty") {
        this.dialogConfig[6].label = "生日";
        this.dialogData.push(Account.empty());
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "create" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
        this.dialogStatus = "create";
      } else if (index === "distribution") {
        var roles = content.getRoles();
        var array = [];
        for (let element of roles) {
          array.push(await element.getAccess("account"));
        }
        console.log(array);
        var concatarray = array
          .reduce(function (a, b) {
            return a.concat(b);
          }, [])
          .filter(function (element, index, arr) {
            return arr.indexOf(element) === index;
          });
        this.roleAccessAuthority = concatarray;
        console.log(this.roleAccessAuthority);
        this.treeData = this.menu.map((item) => {
          return new Menu(item);
        });
        this.authorityVisible = true;
      } else if (index === "exportExcel") {
        this.exportExcelData = this.blockData;
        this.excelVisible = true;
        this.excelType = "exportExcel";
      } else if (index === "uploadExcel") {
        this.excelVisible = true;
        this.excelType = "uploadExcel";
      } else if (index === "updateMany") {
        this.dialogConfig[6].label = "生日";
        this.dialogStatus = "updateMany";
        content.forEach((item) => {
          var obj = _.cloneDeep(item);
          this.dialogData.push(obj);
        });
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "updateManySave" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
      }
      // else if (index === "characterStatus") {
      //   this.account = content;
      //   await this.resettablelistQueryParams();
      //   this.tableVisible = true;
      // }
    },
    async handleDialog(title, index, content) {
      //Dialog相關操作
      console.log(title, index, content);
      if (index !== "cancel") {
        // if (title === "characterStatus") {
        //   await this.onCharacterStatus(index, content);
        // } else
        if (title === "photo") {
          if (index === "photo") {
            const formData = new FormData();
            content.forEach((item) => {
              formData.append("file", item.raw);
            });
            var result = await Account.postPhoto(
              this.account.getID(),
              formData,
              "/accountSetting"
            );
            if (result !== null) {
              this.$message("上傳成功");
              this.dialogData[0]["headShotFileId"] = result;
            } else {
              this.$message.error("上傳失敗");
            }
          } else {
            //刪除圖片
            var temp = { id: content, headShotFileId: "" };
            var result = await Account.updateHead(temp);
            if (result) {
              this.$message("刪除成功");
              this.dialogData[0]["headShotFileId"] = "";
            } else {
              this.$message.error("刪除失敗");
            }
          }
        } else {
          var _p = null;
          if (index == "create" && content.photo !== undefined) {
            _p = _.cloneDeep(content.photo);
            this.$delete(content, "photo");
          }
          var result =
            index === "update" || index === "updateManySave"
              ? await content.update()
              : index === "create"
              ? await content.create()
              : await Account.postMany(content);
          var condition =
            index !== "uploadExcelSave"
              ? Object.keys(result).length !== 0
              : result.result.length !== 0;
          if (condition) {
            index === "update" || index === "updateManySave"
              ? this.$message("更新成功")
              : this.$message("新增成功");
            if (index === "create" && _p !== null) {
              const formData = new FormData();
              _p.forEach((item) => {
                formData.append("file", item.raw);
              });
              var _result = await Account.postPhoto(
                result.id,
                formData,
                "/accountSetting"
              );
              console.log(_result);
            }
            if (index === "update" || index == "updateManySave") {
              this.$store.dispatch("building/setCommittee");
            }
            // this.$store.dispatch('building/setaccounts')
            this.$socket.sendMsg(
              "account",
              index,
              index !== "uploadExcelSave" ? result : result.result
            );
            await this.getAllAccount();
            if (index !== "updateManySave") {
              this.innerVisible = false;
            } else {
              this.dialogData.forEach((item, index) => {
                if (item.id == content.id) {
                  this.dialogData.splice(index, 1, content);
                }
              });
            }
            this.excelVisible = false;
          } else {
            if (index !== "uploadExcelSave") {
              this.$message.error("該帳號已存在，請重新輸入");
            }
          }
          if (
            index == "uploadExcelSave" &&
            result.repeatDataList !== undefined
          ) {
            var list = [];
            result.repeatDataList.forEach((item) => {
              list.push(item.account);
            });
            this.$message.error(
              "【" + list.toString() + "】帳號已存在，請重新上傳"
            );
          }
        }
      } else {
        this.innerVisible = false;
        this.excelVisible = false;
        this.authorityVisible = false;
        this.$refs.block.clearSelectArray();
        // if (title === "characterStatus") {
        //   this.$refs.dialogtable.clearSelectArray();
        // } else {
        //   this.$refs.block.clearSelectArray();
        // }
      }
    },
    // async handleTableClick(index, content) {
    //   console.log(index, JSON.stringify(content));
    //   this.dialogData = [];
    //   this.dialogTitle = "characterStatus";
    //   this.dialogButtonsName = [];
    //   this.dialogConfig = CharacterStatus.getTableConfig();
    //   if (index === "cancel") {
    //     this.tableVisible = false;
    //   } else if (index === "clickPagination") {
    //     this.tablelistQueryParams = content;
    //     await this.getAccountCharacterStatus();
    //   } else if (index === "open") {
    //     this.dialogData.push(content);
    //     this.dialogButtonsName = [
    //       { name: "儲存", type: "primary", status: "update" },
    //       { name: "取消", type: "info", status: "cancel" },
    //     ];
    //     this.innerVisible = true;
    //     this.dialogStatus = "update";
    //   } else if (index === "delete" || index === "deleteMany") {
    //     var isDelete = false;
    //     if (index === "delete") {
    //       isDelete = await content.delete("accountSetting");
    //     } else {
    //       var deleteArray = [];
    //       content.forEach((item) => {
    //         deleteArray.push(item.id);
    //       });
    //       isDelete = await CharacterStatus.deleteMany(
    //         "accountSetting",
    //         deleteArray.toString()
    //       );
    //     }
    //     if (isDelete) {
    //       this.$message("刪除成功");
    //       var length = content.length !== undefined ? content.length : 1;
    //       var page = Math.ceil(
    //         (this.listQueryParams.total - length) /
    //           this.listQueryParams.pageSize
    //       );
    //       if (this.listQueryParams.pageIndex > page) {
    //         this.listQueryParams.pageIndex = page;
    //       }
    //       await this.getAccountCharacterStatus();
    //       this.$refs.block.clearSelectArray();
    //     } else {
    //       this.$message.error("系統錯誤");
    //     }
    //   } else if (index === "empty") {
    //     this.dialogData.push(CharacterStatus.empty());
    //     this.dialogButtonsName = [
    //       { name: "儲存", type: "primary", status: "create" },
    //       { name: "取消", type: "info", status: "cancel" },
    //     ];
    //     this.innerVisible = true;
    //     this.dialogStatus = "create";
    //   } else if (index === "exportExcel") {
    //     this.exportExcelData = this.tableData;
    //     this.excelVisible = true;
    //     this.excelType = "exportExcel";
    //   } else if (index === "uploadExcel") {
    //     this.excelVisible = true;
    //     this.excelType = "uploadExcel";
    //   } else if (index === "updateMany") {
    //     this.dialogStatus = "updateMany";
    //     content.forEach((item) => {
    //       var obj = _.cloneDeep(item);
    //       this.dialogData.push(obj);
    //     });
    //     this.dialogButtonsName = [
    //       { name: "儲存", type: "primary", status: "updateManySave" },
    //       { name: "取消", type: "info", status: "cancel" },
    //     ];
    //     this.innerVisible = true;
    //   }
    // },
    // async onCharacterStatus(index, content) {
    //   var result =
    //     index === "update" || index === "updateManySave"
    //       ? await content.update("accountSetting")
    //       : index === "create"
    //       ? await content.create("accountSetting", this.account.getID())
    //       : await CharacterStatus.postMany(
    //           "accountSetting",
    //           this.account.getID(),
    //           content
    //         );
    //   var condition =
    //     index !== "uploadExcelSave"
    //       ? Object.keys(result).length !== 0
    //       : result.result.length !== 0;
    //   if (condition) {
    //     index === "update" || index === "updateManySave"
    //       ? this.$message("更新成功")
    //       : this.$message("新增成功");
    //     await this.getAccountCharacterStatus();
    //     if (index !== "updateManySave") {
    //       this.innerVisible = false;
    //     } else {
    //       this.dialogData.forEach((item, index) => {
    //         if (item.id == content.id) {
    //           this.dialogData.splice(index, 1, content);
    //         }
    //       });
    //     }
    //     this.excelVisible = false;
    //   } else {
    //     this.$message.error("系統錯誤");
    //   }
    // },
    async changeTable(value) {
      this.isTable = value;
      //需處理
      if (
        this.$route.params.target !== undefined &&
        this.$route.params.target !== ""
      ) {
        this.$nextTick(async () => {
          await this.handleBlock(
            "account",
            "updateMany",
            this.$route.params.target
          );
        });
      } else if (
        this.$route.query.type !== undefined &&
        this.$route.query.type !== ""
      ) {
        await this.handleBlock("account", "empty", "");
      }
    },
  },
};
</script>
