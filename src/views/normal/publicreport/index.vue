<template>
  <div class="editor-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="16">
        <div class="chart-wrapper">
          <div class="verticalhalfdiv">
            <div class="label">場所類別：</div>
            <div class="content">
              <span class="report">
                {{ remind.category }}
              </span>
            </div>
          </div>
          <div class="verticalhalfdiv">
            <div class="label">
              <i class="el-icon-edit">
                <a @click="openWindows" style="color: #66b1ff">
                  下次申報區間：</a
                >
              </i>
            </div>
            <div class="content">
              <span class="report">
                {{ remind.checkDate }}
              </span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8">
        <div class="right-wrapper">
          <PanelGroup
            :panelList="panelList"
            v-on:handleSetLineChartData="handleSetLineChartData"
          ></PanelGroup>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
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
    </el-row>

    <DialogForm
      ref="dialogform"
      v-if="innerVisible === true"
      v-bind="dialogAttrs"
      v-on:handleDialog="handleDialog"
    ></DialogForm>

    <DialogTable
      ref="dialogtable"
      v-if="tableVisible === true"
      v-bind="tableAttrs"
      v-on="tableEvent"
    ></DialogTable>

    <DialogUpload
      ref="dialogupload"
      v-if="uploadVisible === true"
      v-bind="uploadAttrs"
      v-on:handleDialog="handleDialog"
    ></DialogUpload>

    <DialogExcel
      ref="dialogexcel"
      v-if="excelVisible === true"
      v-bind="excelAttrs"
      v-on:handleDialog="handleDialog"
    ></DialogExcel>
  </div>
</template>
<script>
import {
  blockmixin,
  dialogmixin,
  sharemixin,
  tablemixin,
  excelmixin,
} from "@/mixin/index";
import { Files, PublicSafe, PublicSafeLack, Setting } from "@/object/index";

export default {
  mixins: [sharemixin, blockmixin, dialogmixin, tablemixin, excelmixin],
  data() {
    return {
      publicSafe: "",
      isUpdate: false,
      //dialog額外的參數
      files: [],
      uploadVisible: false,
      panelList: [],
      lacksQueryParams: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      lacksShow: false,
      excludeId: null,
      remind: {},
    };
  },
  computed: {
    blockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getBuildingPublicSafeReport,
        resetlistQueryParams: this.resetlistQueryParams,
      };
    },
    tableEvent() {
      return {
        handleTableClick: this.handleTableClick,
        clickPagination: this.handleTableClick,
      };
    },
    uploadAttrs() {
      return {
        visible: this.uploadVisible,
        title: this.title,
        files: this.files,
      };
    },
  },
  methods: {
    async init() {
      this.title = "reportPublicSafe";
      this.tableConfig = PublicSafe.getTableConfig();
      await this.getPublic();
      await this.getBuildingPublicSafeReport();
      await this.getProfessName();
      this.buttonsName = [
        { name: "刪除", icon: "el-icon-delete", status: "delete" },
        { name: "編輯", icon: "el-icon-edit", status: "open" },
        { name: "缺失內容", icon: "el-icon-document", status: "openlacks" },
        { name: "檔案", icon: "el-icon-folder-opened", status: "openfiles" },
      ];
      this.remind = await PublicSafe.getRemind();
      console.log(this.remind);
      this.remind.checkDate =
        moment(this.remind.startDate).format("YYYY-MM-DD") +
        "~" +
        moment(this.remind.endDate).format("YYYY-MM-DD");
    },
    async resetlistQueryParams() {
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
      };
      await this.getBuildingPublicSafeReport();
    },
    async getProfessName() {
      var data = await PublicSafe.getColumn({
        professName: "{IsNotNull}",
      });
      this.dialogSelect = data.map((item) => {
        return { value: item.professName };
      });
    },
    async getBuildingPublicSafeReport() {
      var data = await PublicSafe.getSearchPage(this.listQueryParams);
      this.blockData = data.result;
      this.listQueryParams.total = data.totalPageCount;
    },
    async getPublicSafeLack() {
      //取得缺失內容
      var data = await PublicSafeLack.getSearchPage(
        this.publicSafe.getID(),
        this.tablelistQueryParams
      );
      this.tableTitle = "publicsafelack";
      this.dialogtableConfig = PublicSafeLack.getTableConfig();
      this.tableData = data.result;
      this.tablelistQueryParams.total = data.totalPageCount;
    },
    async getPublic() {
      //取得公安申報 合格申報false & 改善狀況:未改善
      var data = await PublicSafe.getSearchPage({
        isImproved: false,
        declareResult: false,
        pageIndex: 1,
        pageSize: 10,
      });
      if (this.setting_record == 0) {
        await this.$store.dispatch("building/setoptions");
        this.$store.dispatch("record/saveSettingRecord", 1);
      }
      let _array = this.buildingoptions.filter((item) => {
        return (
          item.classType == "LackStatusOptions" &&
          item.textName == "已改善" &&
          item.systemUse == true
        );
      });
      console.log(_array);
      var lacks = null;
      if (_array.length) {
        this.excludeId = _array[0].id;
        this.lacksQueryParams.status = "{!=}" + _array[0].id;
        lacks = await PublicSafeLack.getAllSearchPage(
          "/reportPublicSafe",
          this.lacksQueryParams
        );
      }
      this.panelList = [
        {
          label: "缺失申報未改善",
          count: data.totalPageCount,
          svgIcon: "inspection",
          type: "publicsafe",
        },
        {
          label: "缺失項目未改善",
          count: lacks !== null ? lacks.totalPageCount : 0,
          svgIcon: "inspection",
          type: "lacks",
        },
      ];
    },
    async getlacksSearchPage() {
      this.lacksQueryParams.status = "{!=}" + this.excludeId;
      var lack = await PublicSafeLack.getAllSearchPage(
        "/reportPublicSafe",
        this.lacksQueryParams
      );
      this.tableData = lack.result;
      this.tablelistQueryParams.total = lack.totalPageCount;
    },
    async handleBlock(title, index, content) {
      //公安申報的操作
      console.log(title, index, JSON.stringify(content));
      this.dialogData = [];
      this.dialogTitle = this.title;
      this.dialogButtonsName = [];
      this.dialogConfig = this.tableConfig;
      if (index === "open") {
        this.dialogData.push(content);
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "update" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.dialogConfig = this.tableConfig;
        this.innerVisible = true;
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
          isDelete = await PublicSafe.deleteMany(deleteArray.toString());
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
          await this.getBuildingPublicSafeReport();
          this.$refs.block.clearSelectArray();
        } else {
          this.$message.error("系統錯誤");
        }
      } else if (index === "empty") {
        this.dialogData.push(PublicSafe.empty());
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "create" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.dialogConfig = this.tableConfig;
        this.innerVisible = true;
        this.dialogStatus = "create";
      } else if (index === "openfiles") {
        this.publicSafe = content;
        this.files = await content.files();
        this.uploadVisible = true;
      } else if (index === "openlacks") {
        this.publicSafe = content;
        this.tablelistQueryParams = { pageIndex: 1, pageSize: 10, total: 0 };
        await this.getPublicSafeLack();
        this.tableVisible = true;
      } else if (index === "exportExcel") {
        this.exportExcelData = this.blockData;
        this.excelVisible = true;
        this.excelType = "exportExcel";
      } else if (index === "uploadExcel") {
        this.excelVisible = true;
        this.excelType = "uploadExcel";
      } else if (index === "updateMany") {
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
    },
    async handleDialog(title, index, content) {
      //Dialog相關操作
      console.log(title, index, JSON.stringify(content));
      var isOk = false;
      if (title === "reportPublicSafe") {
        if (
          index === "update" ||
          index === "create" ||
          index === "uploadExcelSave" ||
          index === "updateManySave"
        ) {
          isOk =
            index === "update" || index === "updateManySave"
              ? await content.update()
              : index === "create"
              ? await content.create()
              : await PublicSafe.postMany(content);
          if (isOk) {
            index === "update" || index === "updateManySave"
              ? this.$message("更新成功")
              : this.$message("新增成功");
            await this.getBuildingPublicSafeReport();
          } else {
            this.$message.error("系統錯誤");
          }
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
        } else if (index === "createfile") {
          const formData = new FormData();
          content.forEach((item) => {
            formData.append("file", item.raw);
          });
          isOk = await this.publicSafe.createfiles(formData);
          if (isOk) {
            this.$message("上傳成功");
            this.files = await this.publicSafe.files();
          } else {
            this.$message.error("系統錯誤");
          }
        } else if (index === "deletefile") {
          var data = { id: content.toString() };
          isOk = await Files.delete(data);
          if (isOk) {
            this.$message("刪除成功");
            this.files = await this.publicSafe.files();
          } else {
            this.$message.error("系統錯誤");
          }
        } else {
          if (this.isUpdate) {
            await this.getBuildingPublicSafeReport();
            this.isUpdate = false;
          }
          this.innerVisible = false;
          this.excelVisible = false;
          this.uploadVisible = false;
          this.$refs.block.clearSelectArray();
        }
      } else {
        if (index === "updateLackManySave") {
          var isOk = await content.update();
          if (isOk) {
            this.$message("更新成功");
            await this.getPublicSafeLack();
            this.dialogData.forEach((item, index) => {
              if (item.id == content.id) {
                this.dialogData.splice(index, 1, content);
              }
            });
          }
        } else {
          await this.handleLackDialog(title, index, content);
        }
      }
    },
    async handleLackDialog(title, index, content) {
      //LackDialog相關操作
      this.dialogData = [];
      this.dialogTitle = "publicsafelack";
      if (index === "createlack" || index === "updatelack") {
        var isOk =
          index === "createlack"
            ? await content.create(this.publicSafe.getID())
            : await content.update();
        if (isOk) {
          index === "createlack"
            ? this.$message("新增成功")
            : this.$message("更新成功");
          if (index === "createlack") this.isUpdate = true;
          await this.getPublicSafeLack();
          this.innerVisible = false;
        } else {
          this.$message.error("系統錯誤");
        }
      } else if (index === "cancel") {
        this.innerVisible = false;
        this.excelVisible = false;
      } else if (index === "cancellack") {
        this.innerVisible = false;
      } else if (index === "uploadExcelSave") {
        var isOk = await PublicSafeLack.postMany(
          this.publicSafe.getID(),
          content
        );
        if (isOk) {
          this.$message("新增成功");
          this.isUpdate = true;
          await this.getPublicSafeLack();
          this.excelVisible = false;
        } else {
          this.$message.error("系統錯誤");
        }
      }
    },
    async handleTableClick(index, content) {
      console.log(index, JSON.stringify(content));
      this.dialogData = [];
      this.dialogTitle = "publicsafelack";
      this.dialogConfig = this.dialogtableConfig;
      if (index === "empty") {
        this.dialogData.push(PublicSafeLack.empty());
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "createlack" },
          { name: "返回", type: "info", status: "cancellack" },
        ];
        this.innerVisible = true;
        this.dialogStatus = "create";
      } else if (index === "delete" || index === "deleteMany") {
        var isDelete = false;
        if (index === "delete") {
          isDelete = await content.delete();
        } else {
          var deleteArray = [];
          content.forEach((item) => {
            deleteArray.push(item.id);
          });
          isDelete = await PublicSafeLack.deleteMany(deleteArray.toString());
        }
        if (isDelete) {
          this.$message("刪除成功");
          if (
            this.tablelistQueryParams.pageIndex !== 1 &&
            this.tableData.length == 1
          ) {
            this.tablelistQueryParams.pageIndex =
              this.tablelistQueryParams.pageIndex - 1;
          }
          await this.getPublicSafeLack();
          this.$refs.dialogtable.clearSelectArray();
          this.isUpdate = true;
        } else {
          this.$message.error("系統錯誤");
        }
      } else if (index === "open") {
        this.dialogData.push(content);
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "updatelack" },
          { name: "取消", type: "info", status: "cancellack" },
        ];
        this.innerVisible = true;
        this.dialogStatus = "update";
      } else if (index === "exportExcel") {
        this.exportExcelData = this.tableData;
        this.excelVisible = true;
        this.excelType = "exportExcel";
      } else if (index === "uploadExcel") {
        this.excelVisible = true;
        this.excelType = "uploadExcel";
      } else if (index === "updateMany") {
        this.dialogStatus = "updateMany";
        content.forEach((item) => {
          var obj = _.cloneDeep(item);
          this.dialogData.push(obj);
        });
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "updateLackManySave" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
      } else if (index === "clickPagination") {
        if (this.lacksShow) {
          this.lacksQueryParams = content;
          await this.getlacksSearchPage();
        } else {
          this.tablelistQueryParams = content;
          await this.getPublicSafeLack();
        }
      } else {
        if (this.isUpdate) {
          await this.getBuildingPublicSafeReport();
          this.isUpdate = false;
        }
        this.tableVisible = false;
        this.lacksShow = false;
        this.lacksQueryParams = { pageIndex: 1, pageSize: 10, total: 0 };
      }
    },
    async handleSetLineChartData(type) {
      console.log("handleSetLineChartData", type);
      if (type == "publicsafe") {
        this.listQueryParams.isImproved = false;
        this.listQueryParams.declareResult = false;
        await this.getBuildingPublicSafeReport();
      } else {
        this.tableTitle = "publicsafelack";
        this.dialogtableConfig = PublicSafeLack.getTableConfig();
        this.tableheaderButtonsName = [
          { name: "匯出檔案", icon: "el-icon-download", status: "exportExcel" },
        ];
        this.tablebuttonsName = [];
        await this.getlacksSearchPage();
        this.lacksShow = true;
        this.tableVisible = true;
      }
    },
    async changeTable(value) {
      this.isTable = value;
      //  if(this.$route.params.target !== undefined && this.$route.params.target !== ''){
      //   if(typeof this.$route.params.target == 'object'){
      //     await this.handleBlock('','open',this.$route.params.target)
      //   }
      // }
    },
    openWindows() {
      var routeData = this.$router.resolve({
        path: "/membersetting/index",
        query: { type: "pu" },
      });
      if (window.child && window.child.open && !window.child.closed) {
        window.child.close();
      }
      window.child = window.open(routeData.href, "_blank");
    },
  },
};
</script>
<style lang="scss" scoped>
.chart-wrapper {
  background: #fff;
  padding: 10px 10px;
  margin-bottom: 30px;
  height: 150px;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .verticalhalfdiv {
    width: 100%;
    min-height: 50%;
    .label {
      min-width: 20%;
      display: inline-block;
      text-align: center;
      font-size: 20px;
    }
    .content {
      min-width: 70%;
      display: inline-block;
      font-size: 30px;
    }
  }

  .report {
    font-size: 50px;
    color: red;
  }
}

.right-wrapper {
  padding: 10px 10px;
  margin-bottom: 30px;
  height: 150px;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
  .right-wrapper {
    padding: 8px;
  }
  .left {
    float: none;
    width: 100%;
  }
  .right {
    float: none;
    width: 100%;
    padding-left: 0px;
  }
}
</style>
