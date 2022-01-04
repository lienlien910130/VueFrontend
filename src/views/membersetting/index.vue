<template>
  <div class="editor-container">
    <el-tabs tab-position="left" v-model="activeName">
      <el-tab-pane label="個人資料" name="personal">
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
                <el-tab-pane label="訂閱" name="subscription"> </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
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
              v-bind="settingMaintainTimeOptions('MaintainTimeOptions')"
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

    <DialogForm
      ref="dialogform"
      v-if="innerVisible === true"
      v-bind="dialogAttrs"
      v-on:handleDialog="handleUser"
    ></DialogForm>
  </div>
</template>

<script>
// const Vuex = require('vuex')
import { dialogmixin } from "@/mixin/index";
import Setting from "@/object/setting";
import { Account, Files, User } from "@/object";
export default {
  mixins: [dialogmixin],
  components: {
    SettingBlock: () => import("./components/SettingBlock.vue"),
    UserCard: () => import("./components/UserCard.vue"),
  },
  computed: {
    ...Vuex.mapGetters(["id"]),
  },
  data() {
    return {
      options: [],
      temp: [],
      activeName: "personal",
      user: {},
      previewPath: "",
      activeTab: "subscription",
    };
  },
  async mounted() {
    await this.getOptions();
    await this.getUser();
    await this.getUserPhoto(this.user.headShotFileId);
    if (this.$route.query.type == "bu") {
      this.activeName = "building";
    } else if (this.$route.query.type == "ma") {
      this.activeName = "maintain";
    } else if (this.$route.query.type == "in") {
      this.activeName = "report";
    } else if (this.$route.query.type == "pu") {
      this.activeName = "reportPublic";
    }
  },
  methods: {
    settingAttrs(data) {
      return {
        title: data,
        option: this.optionsFilter(data),
        // type: this.type,
        // current: this.current,
      };
    },
    settingMaintainTimeOptions(data) {
      let array = this.options.filter(
        (item, index) =>
          item.classType == "MaintainTimeOptions" && item.value == "current"
      );
      return {
        title: data,
        option: this.optionsFilter(data),
        // type: this.type,
        // current: this.current,
        radio: array[0] !== undefined ? array[0].id : "",
      };
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
              index == "PublicSafeTimeOptions"
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
      var result = await Account.postPhoto(this.id, formData);
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
        this.dialogConfig = User.getTableConfig();
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "update" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
      } else if (index == "password") {
      } else if (index == "update") {
        var data = await Account.getSearchPage({
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
          var result = await content.updateP();
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
      }
    },
  },
};
</script>
