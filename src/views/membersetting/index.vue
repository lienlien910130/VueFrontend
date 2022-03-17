<template>
  <div class="editor-container">
    <el-tabs tab-position="left" v-model="activeName">
      <!-- <el-tab-pane label="個人資料" name="personal">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="6">
            <UserCard
              :user="user"
              :previewPath="previewPath"
              v-on:handleUpload="handleUpload"
              v-on:handleUser="handleUser"
            ></UserCard>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="18">
            <el-card>
              <el-tabs v-model="activeTab">
                 <el-tab-pane label="身體狀態" name="characterStatus">
                  <Block
                    ref="block"
                    :list-query-params.sync="listQueryParams"
                    v-bind="blockAttrs"
                    v-on="blockEvent"
                  ></Block>
                </el-tab-pane> 
                <el-tab-pane label="訂閱" name="subscription">訂閱</el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane> -->
      <!-- <el-tab-pane label="人物狀態" name="cStatusOptions">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="12">
            <SettingBlock
              ref="settingBlock"
              v-bind="settingAttrs('cStatusOptions')"
              v-on:handleButton="handleButton"
            ></SettingBlock>
          </el-col>
        </el-row>
      </el-tab-pane> -->
      <el-tab-pane label="建築物" name="building">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="12">
            <SettingBlock
              ref="settingBlock"
              v-bind="settingAttrs('ContactUnitOptions')"
              v-on:handleButton="handleButton"
            ></SettingBlock>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="維護保養" name="maintain">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="12">
            <SettingBlock
              ref="settingBlock"
              v-bind="settingAttrs('MaintainContentOptions')"
              v-on:handleButton="handleButton"
            ></SettingBlock>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12">
            <SettingBlock
              ref="settingBlock"
              v-bind="settingAttrs('MaintainProcessOptions')"
              v-on:handleButton="handleButton"
            ></SettingBlock>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12">
            <SettingBlock
              ref="settingBlock"
              v-bind="settingAttrs('MaintainTimeOptions')"
              v-on:handleButton="handleButton"
            ></SettingBlock>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="檢修申報" name="report">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="12">
            <SettingBlock
              ref="settingBlock"
              v-bind="settingAttrs('InspectionTypeOfTime')"
              v-on:handleButton="handleButton"
            ></SettingBlock>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12">
            <SettingBlock
              ref="settingBlock"
              v-bind="settingAttrs('InspectionTimeOptions')"
              v-on:handleButton="handleButton"
            ></SettingBlock>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="公安申報" name="reportPublic">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="12">
            <SettingBlock
              ref="settingBlock"
              v-bind="settingAttrs('LackStatusOptions')"
              v-on:handleButton="handleButton"
            ></SettingBlock>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12">
            <SettingBlock
              ref="settingBlock"
              v-bind="settingAttrs('PublicSafeTypeOfTime')"
              v-on:handleButton="handleButton"
            ></SettingBlock>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12">
            <SettingBlock
              ref="settingBlock"
              v-bind="settingAttrs('PublicSafeTimeOptions')"
              v-on:handleButton="handleButton"
            ></SettingBlock>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!-- <DialogForm
      ref="dialogform"
      v-if="innerVisible === true"
      v-bind="dialogAttrs"
      v-on:handleUser="handleUser"
      v-on:handleDialog="handleDialog"
    ></DialogForm> -->

    <DialogExcel
      ref="dialogexcel"
      v-if="excelVisible === true"
      v-bind="excelAttrs"
      v-on:handleDialog="handleDialog"
    ></DialogExcel>

    <!-- <el-dialog title="更改密碼" :visible.sync="dialogFormVisible" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="密碼" prop="password">
          <el-input
            v-model="ruleForm.password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="確認密碼" prop="password2">
          <el-input
            v-model="ruleForm.password2"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >確認</el-button
        >
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
// const Vuex = require('vuex')
import { blockmixin, dialogmixin, excelmixin, sharemixin } from "@/mixin/index";
import Setting from "@/object/setting";
import { Account, Files, User } from "@/object";
export default {
  mixins: [dialogmixin, blockmixin, excelmixin, sharemixin],
  components: {
    SettingBlock: () => import("./components/SettingBlock.vue"),
    UserCard: () => import("./components/UserCard.vue"),
  },
  computed: {
    blockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getAccountCharacterStatus,
        resetlistQueryParams: this.resetlistQueryParams,
      };
    },
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("請輸入密碼"));
      } else {
        if (this.ruleForm.password2 !== "") {
          this.$refs.ruleForm.validateField("password2");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("請再次輸入密碼"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("再次輸入不一致，請重新輸入"));
      } else {
        callback();
      }
    };
    return {
      options: [],
      temp: [],
      activeName: "building",
      user: {},
      previewPath: "",
      dialogFormVisible: false,
      ruleForm: {
        password: "",
        password2: "",
      },
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        password2: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  async mounted() {
    if (this.$route.query.type == "bu") {
      this.activeName = "building";
    } else if (this.$route.query.type == "ma") {
      this.activeName = "maintain";
    } else if (this.$route.query.type == "in") {
      this.activeName = "report";
    } else if (this.$route.query.type == "pu") {
      this.activeName = "reportPublic";
    }
    // else if (this.$route.query.type == "cs") {
    //   this.activeName = "cStatusOptions";
    // }
  },
  methods: {
    async init() {
      //this.tableConfig = CharacterStatus.getTableConfig();
      await this.getOptions();
      // await this.getUser();
      // await this.getUserPhoto(this.user.headShotFileId);
      // await this.getAccountCharacterStatus();
    },
    async changeTable(value) {
      this.isTable = value;
    },
    settingAttrs(data) {
      return {
        title: data,
        option: this.optionsFilter(data),
      };
    },
    // settingMaintainTimeOptions(data) {
    //   let array = this.options.filter(
    //     (item, index) =>
    //       item.classType == "MaintainTimeOptions" && item.value == "current"
    //   );
    //   return {
    //     title: data,
    //     option: this.optionsFilter(data),
    //     radio: array[0] !== undefined ? array[0].id : "",
    //   };
    // },
    async getUser() {
      this.user = await Account.getOfID(this.id);
      console.log(this.user);
    },
    async getUserPhoto(headShotFileId) {
      var file = await Files.getOfID(headShotFileId);
      var filename = file.getExtName();
      var fileType = filename == "png" ? "image/png" : "image/jpeg";
      var data = await Files.getImage(headShotFileId);
      let url = URL.createObjectURL(new Blob([data], { type: fileType }));
      this.previewPath = url;
    },
    async getOptions() {
      //取得大樓的所有分類
      this.options = await Setting.getAllOption();
      this.$store.dispatch("building/setoptions", this.options);
      if (this.setting_record == 0) {
        this.$store.dispatch("record/saveSettingRecord", 1);
      }
    },
    optionsFilter(title) {
      let data = this.options.filter((item, index) => item.classType == title);
      if (
        title == "PublicSafeTimeOptions" ||
        title == "InspectionTimeOptions"
      ) {
        data = data.sort(function (x, y) {
          var _data1 = new Date(x.textName);
          var _data2 = new Date(y.textName);
          return _data2 - _data1;
        });
      }
      return data;
    },
    async handleButton(index, operation, content) {
      console.log(index, operation, content);
      switch (operation) {
        case "create":
          await this.PostData(index, content);
          break;
        case "update":
          await this.UpdateData(content, true);
          break;
        case "delete":
          await this.DeleteData(content);
          break;
        case "checked":
          await this.UpdateData(content, false);
        default:
          break;
      }
    },
    async PostData(index, content) {
      var temp = {
        classType: index,
        textName: content.textName,
        value:
          index == "InspectionTypeOfTime" || index == "PublicSafeTypeOfTime"
            ? content.value.join("-")
            : index == "InspectionTimeOptions" ||
              index == "PublicSafeTimeOptions" ||
              index == "MaintainTimeOptions"
            ? content.value
            : null,
        sort: 99,
        Checked: false,
        systemUse: false,
      };
      var result = await Setting.postOption(temp);
      if (result !== undefined) {
        this.$socket.sendMsg("setting", "create", result);
        this.$message("新增成功");
        this.options = await Setting.getAllOption();
      } else {
        this.$message.error("該名稱已存在，請重新輸入");
      }
    },
    async UpdateData(content, hasCheck) {
      content.value =
        content.classType == "InspectionTypeOfTime" ||
        content.classType == "PublicSafeTypeOfTime"
          ? content.value.join("-")
          : content.value;
      var temp = Array.isArray(content) ? content : new Array(content);
      var result = await Setting.updateOption(temp, hasCheck);
      if (result.result.length !== 0) {
        this.$message("更新成功");
        this.$socket.sendMsg("setting", "update", result.result);
        this.options = await Setting.getAllOption();
      } else {
        this.$message.error("該名稱已存在，請重新輸入");
      }
    },
    async DeleteData(content) {
      var isOk = await Setting.deleteOption(content);
      if (isOk) {
        this.$message("刪除成功");
        this.$socket.sendMsg("setting", "delete", content);
        this.options = await Setting.getAllOption();
      }
    },
    async handleUpload(content) {
      const formData = new FormData();
      content.forEach((item) => {
        formData.append("file", item.raw);
      });
      var result = await Account.postPhoto(
        this.id,
        formData,
        "/settings/account"
      );
      if (result !== null) {
        this.$message("上傳成功");
        await this.getUserPhoto(result);
      } else {
        this.$message.error("上傳失敗");
      }
    },
    async handleUser(title, index, content) {
      console.log("handleUser", index, JSON.stringify(content));
      if (index == "open") {
        this.dialogData = [];
        this.dialogData.push(content);
        this.dialogConfig = Account.getUserTableConfig();
        this.dialogConfig[0].isEdit = false;
        this.dialogTitle = "account";
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "update" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
      } else if (index == "password") {
        this.dialogFormVisible = true;
      }
    },
    // async resetlistQueryParams() {
    //   this.listQueryParams = {
    //     pageIndex: 1,
    //     pageSize: 12,
    //     total: 0,
    //   };
    //   await this.getAccountCharacterStatus();
    // },
    // async getAccountCharacterStatus() {
    //   var data = await CharacterStatus.getSearchPage(
    //     "settings",
    //     this.id,
    //     this.listQueryParams
    //   );
    //   this.blockData = data.result;
    //   this.listQueryParams.total = data.totalPageCount;
    // },
    // async handleBlock(title, index, content) {
    //   console.log(title, index, JSON.stringify(content));
    //   this.dialogData = [];
    //   this.dialogTitle = "characterStatus";
    //   this.dialogButtonsName = [];
    //   this.dialogConfig = this.tableConfig;
    //   if (index === "open") {
    //     this.dialogData.push(content);
    //     this.dialogButtonsName = [
    //       { name: "儲存", type: "primary", status: "update" },
    //       { name: "取消", type: "info", status: "cancel" },
    //     ];
    //     this.dialogConfig = this.tableConfig;
    //     this.innerVisible = true;
    //     this.dialogStatus = "update";
    //   } else if (index === "delete" || index === "deleteMany") {
    //     var isDelete = false;
    //     if (index === "delete") {
    //       isDelete = await content.delete("settings");
    //     } else {
    //       var deleteArray = [];
    //       content.forEach((item) => {
    //         deleteArray.push(item.id);
    //       });
    //       isDelete = await CharacterStatus.deleteMany(
    //         "settings",
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
    //     this.dialogConfig = this.tableConfig;
    //     this.innerVisible = true;
    //     this.dialogStatus = "create";
    //   } else if (index === "exportExcel") {
    //     this.exportExcelData = this.blockData;
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
    async handleDialog(title, index, content) {
      //Dialog相關操作
      console.log(title, index, JSON.stringify(content));
      if (
        index === "update" ||
        index === "create" ||
        index === "uploadExcelSave" ||
        index === "updateManySave" ||
        index === ""
      ) {
        if (title === "account") {
          //更新
          var data = await Account.getSearchPage("/settings/account", {
            identityCard: "{LIKE}" + content.identityCard,
            pageIndex: 1,
            pageSize: 12,
            total: 0,
          });
          var canSave =
            data.totalPageCount == 0
              ? true
              : data.totalPageCount !== 0 &&
                data.result[0].getID() == content.id
              ? true
              : false;
          if (canSave) {
            var result = await content.update("/settings/account");
            if (Object.keys(result).length !== 0) {
              this.$socket.sendMsg("account", index, result);
              this.$message("更新成功");
              this.$store.dispatch("building/setCommittee");
              await this.getUser();
              this.innerVisible = false;
            } else {
              this.$message.error("該姓名已存在，請重新輸入");
            }
          } else {
            this.$message.error("該身份證已存在，請重新輸入");
          }
        }
        // else {
        //   var result =
        //     index === "update" || index === "updateManySave"
        //       ? await content.update("settings")
        //       : index === "create"
        //       ? await content.create("settings", this.id)
        //       : await CharacterStatus.postMany("settings", this.id, content);
        //   var condition =
        //     index !== "uploadExcelSave"
        //       ? Object.keys(result).length !== 0
        //       : result.result.length !== 0;
        //   if (condition) {
        //     index === "update" || index === "updateManySave"
        //       ? this.$message("更新成功")
        //       : this.$message("新增成功");
        //     await this.getAccountCharacterStatus();
        //   } else {
        //     this.$message.error("系統錯誤");
        //   }
        //   if (index !== "updateManySave") {
        //     this.innerVisible = false;
        //   } else {
        //     this.dialogData.forEach((item, index) => {
        //       if (item.id == content.id) {
        //         this.dialogData.splice(index, 1, content);
        //       }
        //     });
        //   }
        //   this.excelVisible = false;
        // }
      } else {
        this.innerVisible = false;
        this.excelVisible = false;
        this.$refs.block.clearSelectArray();
      }
    },
    // submitForm(formName) {
    //   this.$refs[formName].validate(async (valid) => {
    //     if (valid) {
    //       var temp = { id: this.id, password: this.ruleForm.password };
    //       var isOk = await Account.updateData("/settings/account", temp);
    //       if (isOk) {
    //         this.$message("更新成功");
    //         this.resetForm("ruleForm");
    //       } else {
    //         this.$message.error("更新失敗");
    //       }
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    //   this.dialogFormVisible = false;
    // },
  },
};
</script>
