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

     <DialogContact
      ref="dialogcontact"
      v-if="contactVisible === true"
      v-bind="contactAttrs"     
      v-on:handleDialog="handleDialog"      
    ></DialogContact>

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

    <el-dialog title="住戶認證" :visible.sync="dialogFormVisible" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="門牌" prop="usageOfFloor">
          <el-select
            v-model="ruleForm.usageOfFloor"
            filterable
            placeholder="請選擇"
            style="width: 100%"
          >
            <el-option
              v-for="(obj, index) in houseList"
              :key="index"
              :label="obj.label"
              :value="obj.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >確認</el-button
        >
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { blockmixin, dialogmixin, sharemixin, excelmixin } from "@/mixin/index";
import { Menu, Account } from "@/object/index";

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
    houseList() {
      if (this.floorOfHouse_record == 0) {
        this.$store.dispatch("building/setFloorOfHouse");
        this.$store.dispatch("record/saveFloorOfHouseRecord", 1);
      }
      return this.buildingfloorOfHouse.map((v) => {
        this.$set(v, "id", v.id);
        this.$set(v, "label", v.houseNumber);
        this.$set(v, "value", v.id);
        return v;
      });
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
  mounted() {
    console.log('mounted-dialog',this.dialogAttrs)
    console.log("class",this.menu)
  },
  data() {
    return {
      roleAccessAuthority: [],
      treeData: [],
      accessAuthority: [],
      authorityVisible: false,
      account: null,
      contactVisible : true,
      dialogFormVisible: false,
      ruleForm: { usageOfFloor: null },
      rules: {
        usageOfFloor: [
          { required: true, message: "請選擇門牌", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    async init() {
      this.title = "account";
      this.tableConfig = Account.getTableConfig();
      await this.getAllAccount();
      this.headerButtonsName = [
        { name: "多筆刪除", icon: "el-icon-delete", status: "deleteMany" },
        { name: "多筆更新", icon: "el-icon-edit", status: "updateMany" },
        {
          name: "新增資料",
          icon: "el-icon-circle-plus-outline",
          status: "empty",
        },
        { name: "匯出檔案", icon: "el-icon-download", status: "exportExcel" },
        { name: "匯入檔案", icon: "el-icon-upload2", status: "uploadExcel" },
        {
          name: "多筆驗證",
          icon: "el-icon-circle-check",
          status: "multipleVerify",
        },
      ];
      this.buttonsName = [
        { name: "刪除", icon: "el-icon-delete", status: "delete" },
        { name: "編輯", icon: "el-icon-edit", status: "open" },
        { name: "查看權限", icon: "el-icon-view", status: "distribution" },
        { name: "聯絡方式", icon: "el-icon-phone-outline", status: "contact" },
        { name: "驗證住戶", icon: "el-icon-circle-check", status: "verify" },
      ];
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
      var data = await Account.getSearchPage(
        "/accountSetting",
        this.listQueryParams
      );
      this.blockData = data.result;
      this.listQueryParams.total = data.totalPageCount;
    },
    async handleBlock(title, index, content) {
      console.log(title, index, JSON.stringify(content));
      this.dialogConfig = Account.getTableConfig();
      this.dialogData = [];
      this.dialogSelect = this.accessAuthority;
      if (index === "open") {
        this.dialogConfig[6].label = "生日";
        this.dialogConfig[2].isEdit = false;
        this.dialogConfig[2].mandatory = false;
        this.account = content;
        await this.handleBlockMixin(title, index, content, Account);
      } else if (index === "delete" || index === "deleteMany") {
        var isDelete = await this.handleBlockMixin(
          title,
          index,
          content,
          Account
        );
        if (isDelete) {
          this.$store.dispatch("building/setCommittee");
          await this.getAllAccount();
        }
      } else if (index === "empty") {
        this.dialogConfig[6].label = "生日";
        await this.handleBlockMixin(title, index, content, Account);
      } else if (
        index === "exportExcel" ||
        index === "uploadExcel" ||
        index === "updateMany"
      ) {
        if (index === "updateMany") this.dialogConfig[6].label = "生日";
        await this.handleBlockMixin(title, index, content, Account);
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
      } else if (index === "verify") {
        if (
          content.usageOfFloor !== undefined &&
          content.usageOfFloor !== null &&
          content.usageOfFloor !== ""
        ) {
          //已有設定過門牌可直接進行升級的動作
          var result = await Account.upgrade("/accountSetting", content.id);
          console.log(JSON.stringify(result));
          if (result.result.length !== 0) {
            this.$message("認證成功，若要取消認證，請洽水星服務人員");
            result.result.forEach((item) => {
              this.$socket.sendMsg("account", "update", item);
            });
            await this.getAllAccount();
          } else {
            this.$message.error("認證失敗，請洽水星服務人員");
          }
        } else {
          //跳出可以選擇門牌的視窗
          this.account = content;
          this.dialogFormVisible = true;
        }
      } else if (index === "multipleVerify") {
        var accountArray = [];
        content.forEach((item) => {
          accountArray.push(item.id);
        });
        var result = await Account.upgrade(
          "/accountSetting",
          accountArray.toString()
        );
        if (result.result.length !== 0) {
          this.$message("認證成功，若要取消認證，請洽水星服務人員");
          result.result.forEach((item) => {
            this.$socket.sendMsg("account", "update", item);
          });
          await this.getAllAccount();
          this.$refs.block.clearSelectArray();
        } else {
          this.$message.error("認證失敗，請洽水星服務人員");
        }
      } else if (index === "contact") {  
        this.account = content;
        await this.handleBlockMixin(title, index, content, Account); 
        // this.contactVisible = true;   
        
        
      }
    },
    async handleDialog(title, index, content) {
      //Dialog相關操作
      console.log(123,title, index, content,);
      
      if (index !== "cancel") {
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
            var result = await Account.updateData("/accountSetting", temp);
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
          const { object, isSuccess } = await this.handleDialogMixin(
            title,
            index,
            content,
            Account,
            "/accountSetting"
          );

          // var result =
          //   index === "update" || index === "updateManySave"
          //     ? await content.update("/accountSetting")
          //     : index === "create"
          //     ? await content.create()
          //     : await Account.postMany(content);
          // var condition =
          //   index !== "uploadExcelSave"
          //     ? Object.keys(result).length !== 0
          //     : result.result.length !== 0;

          if (isSuccess) {
            if (index === "create" && _p !== null) {
              const formData = new FormData();
              _p.forEach((item) => {
                formData.append("file", item.raw);
              });
              var _result = await Account.postPhoto(
                object.id,
                formData,
                "/accountSetting"
              );
              console.log(_result);
            }
            if (index === "update" || index == "updateManySave") {
              this.$store.dispatch("building/setCommittee");
            }
            // this.$socket.sendMsg(
            //   "account",
            //   index,
            //   index !== "uploadExcelSave" ? object : object.result
            // );
            await this.getAllAccount();

            // if (index !== "updateManySave") {
            //   this.innerVisible = false;
            // } else {
            //   this.dialogData.forEach((item, index) => {
            //     if (item.id == content.id) {
            //       this.dialogData.splice(index, 1, content);
            //     }
            //   });
            // }
            // this.excelVisible = false;
          }
          // else {
          //   if (index !== "uploadExcelSave") {
          //     this.$message.error("該帳號已存在，請重新輸入");
          //   }
          // }
          await this.handleDialogMixin_common(
            Account,
            isSuccess,
            index,
            content,
            object
          );
          // if (
          //   index == "uploadExcelSave" &&
          //   result.repeatDataList !== undefined
          // ) {
          //   var list = [];
          //   result.repeatDataList.forEach((item) => {
          //     list.push(item.account);
          //   });
          //   this.$message.error(
          //     "【" + list.toString() + "】帳號已存在，請重新上傳"
          //   );
          // }
        }
      } else {
        // this.innerVisible = false;
        // this.excelVisible = false;
        // this.authorityVisible = false;
        // this.$refs.block.clearSelectArray();
        this.closeAll();
      }
    },
    async changeTable(value) {
      this.isTable = value;
      await this.openDialogWindows();
      //需處理
      // if (
      //   this.$route.params.target !== undefined &&
      //   this.$route.params.target !== ""
      // ) {
      //   this.$nextTick(async () => {
      //     await this.handleBlock(
      //       "account",
      //       "updateMany",
      //       this.$route.params.target
      //     );
      //   });
      // } else if (
      //   this.$route.query.type !== undefined &&
      //   this.$route.query.type !== ""
      // ) {
      //   await this.handleBlock("account", "empty", "");
      // }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          var temp = {
            id: this.account.getID(),
            usageOfFloor: this.ruleForm.usageOfFloor,
          };
          var isOk = await Account.updateData("/accountSetting", temp);
          if (isOk) {
            var result = await Account.upgrade(
              "/accountSetting",
              this.account.getID()
            );
            if (result.result.length !== 0) {
              this.$message("認證成功，若要取消認證，請洽水星服務人員");
              result.result.forEach((item) => {
                this.$socket.sendMsg("account", "update", item);
              });
              await this.getAllAccount();
              this.dialogFormVisible = false;
            } else {
              this.$message.error("認證失敗，請洽水星服務人員");
            }
          } else {
            this.$message.error("認證失敗，請洽水星服務人員");
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
  },
};
</script>
