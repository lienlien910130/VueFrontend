<template>
  <div class="editor-container">
    <el-tabs tab-position="left" v-model="activeName">
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
  </div>
</template>

<script>
// const Vuex = require('vuex')

import Setting from "@/object/setting";
export default {
  components: {
    SettingBlock: () => import("./components/SettingBlock.vue"),
  },
  data() {
    return {
      options: [],
      temp: [],
      activeName: "building",
    };
  },
  async mounted() {
    await this.getOptions();
    if (this.$route.query.type == "mp") {
      this.activeName = "maintain";
    } else if (this.$route.query.type == "la") {
      this.activeName = "report";
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
          await this.UpdateData(content);
          break;
        case "delete":
          await this.DeleteData(content);
          break;
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
            ? content.value.toString()
            : index == "InspectionTimeOptions" ||
              index == "PublicSafeTimeOptions"
            ? content.value
            : null,
        sort: 99,
        Checked: false,
        systemUse: false,
      };
      var result = await Setting.postOption(temp);
      if (Object.keys(result).length !== 0) {
        this.$socket.sendMsg("setting", "create", result);
        this.$message("新增成功");
        this.options = await Setting.getAllOption();
      } else {
        this.$message.error("該名稱已存在，請重新輸入");
      }
    },
    async UpdateData(content) {
      content.value =
        content.classType == "InspectionTypeOfTime" ||
        content.classType == "PublicSafeTypeOfTime"
          ? content.value.toString()
          : content.value;
      var temp = Array.isArray(content) ? content : new Array(content);
      var result = await Setting.updateOption(temp);
      if (Object.keys(result).length !== 0) {
        this.$message("更新成功");
        this.$socket.sendMsg("setting", "update", result);
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
  },
};
</script>
