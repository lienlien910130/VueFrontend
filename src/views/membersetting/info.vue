<template>
  <div class="editor-container">
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
            <!-- <el-tab-pane label="身體狀態" name="characterStatus">
                  <Block
                    ref="block"
                    :list-query-params.sync="listQueryParams"
                    v-bind="blockAttrs"
                    v-on="blockEvent"
                  ></Block>
                </el-tab-pane> -->
            <el-tab-pane label="訂閱" name="subscription">訂閱</el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <DialogForm
      ref="dialogform"
      v-if="innerVisible === true"
      v-bind="dialogAttrs"
      v-on:handleUser="handleUser"
      v-on:handleDialog="handleDialog"
    ></DialogForm>

    <el-dialog :title="dTitle" :visible.sync="dialogFormVisible" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <template v-if="formType === 'password'">
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
        </template>
        <template v-else>
          <el-form-item label="帳號" prop="account">
            <el-input
              v-model="ruleForm.account"
              autocomplete="off"
              maxlength="10"
              show-word-limit
            ></el-input>
          </el-form-item>
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
        </template>
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
import { Account, Files } from "@/object";
import { dialogmixin } from "@/mixin/index";

export default {
  mixins: [dialogmixin],
  components: {
    UserCard: () => import("./components/UserCard.vue"),
  },
  computed: {
    ...Vuex.mapGetters(["id", "floorOfHouse_record", "buildingfloorOfHouse"]),
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
    id: {
      handler: async function () {
        await this.init();
      },
      immediate: true,
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
      user: {},
      previewPath: "",
      dialogFormVisible: false,
      ruleForm: {},
      rules: {},
      dTitle: "",
      formType: "",
      validatePass: validatePass,
      validatePass2: validatePass2,
    };
  },
  methods: {
    async init() {
      await this.getUser();
      await this.getUserPhoto(this.user.headShotFileId);
    },
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
        this.dialogConfig[0].isEdit = false; //大頭貼
        this.dialogConfig[9].isEdit = false; //門牌
        this.dialogTitle = "account";
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "update" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
      } else if (index == "password") {
        this.dTitle = "更改密碼";
        this.formType = index;

        this.ruleForm = {
          password: "",
          password2: "",
        };
        this.rules = {
          password: [{ validator: this.validatePass, trigger: "blur" }],
          password2: [{ validator: this.validatePass2, trigger: "blur" }],
        };
        this.dialogFormVisible = true;
      } else if (index == "upgrade") {
        this.dTitle = "申請正式帳號";
        this.formType = index;
        this.ruleForm = {
          account: "",
          usageOfFloor: null,
        };
        this.rules = {
          account: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
          usageOfFloor: [
            { required: true, message: "請選擇門牌", trigger: "change" },
          ],
        };
        this.dialogFormVisible = true;
      }
    },
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
            : data.totalPageCount !== 0 && data.result[0].getID() == content.id
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
      } else {
        this.innerVisible = false;
        this.excelVisible = false;
        this.$refs.block.clearSelectArray();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.formType === "password") {
            var temp = { id: this.id, password: this.ruleForm.password };
            var isOk = await Account.updateData("/settings/account", temp);
            if (isOk) {
              this.$message("更新成功");
              this.resetForm("ruleForm");
            } else {
              this.$message.error("更新失敗，請洽水星服務人員");
            }
          } else {
            var temp = {
              id: this.id,
              account: this.ruleForm.account,
              usageOfFloor: this.ruleForm.usageOfFloor,
            };
            var isOk = await Account.updateData("/settings/account", temp);
            if (isOk) {
              this.$message("提交成功，待管理人審核");
              this.resetForm("ruleForm");
              await this.getUser();
            } else {
              this.$message.error("提交失敗，請洽水星服務人員");
            }
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
