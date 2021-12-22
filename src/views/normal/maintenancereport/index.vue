<template>
  <div class="editor-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="16">
        <div class="chart-wrapper">
          <div class="verticalhalfdiv">
            <div class="label">
              <i class="el-icon-edit">
                <a @click="openWindows('sys-Setting')" style="color: #66b1ff">
                  下次申報日期：</a
                >
              </i>
            </div>
            <div class="content">
              <span class="report">
                {{ TimeOptions("InspectionTimeOptions") }}
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
import { Files, Inspection, InspectionLacks } from "@/object/index";

export default {
  mixins: [sharemixin, blockmixin, dialogmixin, tablemixin, excelmixin],
  data() {
    return {
      inspection: "",
      isUpdate: false,
      //dialog額外的參數
      lackFileId: "", //缺失檔案id
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
    };
  },
  computed: {
    blockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getBuildingMaintenanceReport,
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
        specialId: this.lackFileId,
        files: this.files,
      };
    },
  },
  methods: {
    async init() {
      this.title = "reportInspectio";
      this.tableConfig = Inspection.getTableConfig();
      await this.getInspection();
      await this.getBuildingMaintenanceReport();
      await this.getProfessName();
      this.buttonsName = [
        { name: "刪除", icon: "el-icon-delete", status: "delete" },
        { name: "編輯", icon: "el-icon-edit", status: "open" },
        { name: "缺失內容", icon: "el-icon-document", status: "openlacks" },
        { name: "檔案", icon: "el-icon-folder-opened", status: "openfiles" },
      ];
    },
    async resetlistQueryParams() {
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
      };
      await this.getBuildingMaintenanceReport();
    },
    async resettablelistQueryParams() {
      this.tablelistQueryParams = {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      };
      await this.getInspectionLack();
    },
    async getProfessName() {
      var data = await Inspection.getColumn({
        professName: "{IsNotNull}",
      });
      this.dialogSelect = data.map((item) => {
        return { value: item.professName };
      });
    },
    async getBuildingMaintenanceReport() {
      //取得檢修申報
      var data = await Inspection.getSearchPage(this.listQueryParams);
      this.blockData = data.result;
      this.listQueryParams.total = data.totalPageCount;
    },
    async getInspectionLack() {
      //取得缺失內容
      var data = await InspectionLacks.getSearchPage(
        this.inspection.getID(),
        this.tablelistQueryParams
      );
      this.tableTitle = "inspectionlack";
      this.dialogtableConfig = InspectionLacks.getTableConfig();
      this.tableData = data.result;
      this.tablelistQueryParams.total = data.totalPageCount;
    },
    async getInspection() {
      //取得檢修申報 合格申報false & 改善狀況:未改善
      var data = await Inspection.getSearchPage({
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
          item.classType == "MaintainProcessOptions" &&
          item.textName == "已保養" &&
          item.systemUse == true
        );
      });
      var lacks = null;
      if (_array.length) {
        this.excludeId = _array[0].id;
        this.lacksQueryParams.status = "{!=}" + _array[0].id;
        lacks = await InspectionLacks.getAllSearchPage(this.lacksQueryParams);
      }
      this.panelList = [
        {
          label: "缺失申報未改善",
          count: data.totalPageCount,
          svgIcon: "inspection",
          type: "inspection",
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
      var lack = await InspectionLacks.getAllSearchPage(this.lacksQueryParams);
      this.tableData = lack.result;
      this.tablelistQueryParams.total = lack.totalPageCount;
    },
    async handleBlock(title, index, content) {
      //檢修申報的操作
      console.log(index, JSON.stringify(content));
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
          isDelete = await Inspection.deleteMany(deleteArray.toString());
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
          await this.getBuildingMaintenanceReport();
          this.$refs.block.clearSelectArray();
        } else {
          this.$message.error("系統錯誤");
        }
      } else if (index === "empty") {
        this.dialogData.push(Inspection.empty());
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "create" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
        this.dialogStatus = "create";
      } else if (index === "openfiles") {
        this.inspection = content;
        this.files = await content.files();
        this.lackFileId = await content.getlackfileID();
        this.uploadVisible = true;
      } else if (index === "openlacks") {
        this.inspection = content;
        this.tablelistQueryParams = { pageIndex: 1, pageSize: 10, total: 0 };
        await this.getInspectionLack();
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
      if (title === "reportInspectio") {
        if (
          index === "update" ||
          index === "create" ||
          index === "uploadExcelSave" ||
          index === "updateManySave"
        ) {
          var isOk =
            index === "update" || index === "updateManySave"
              ? await content.update()
              : index === "create"
              ? await content.create()
              : await Inspection.postMany(content);
          if (isOk) {
            index === "update" || index === "updateManySave"
              ? this.$message("更新成功")
              : this.$message("新增成功");
            await this.getBuildingMaintenanceReport();
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
          isOk = await this.inspection.createfiles(formData);
          if (isOk) {
            this.$message("上傳成功");
            this.files = await this.inspection.files();
          } else {
            this.$message.error("系統錯誤");
          }
        } else if (index === "deletefile") {
          var data = { id: content.toString() };
          isOk = await Files.delete(data);
          if (isOk) {
            this.$message("刪除成功");
            this.files = await this.inspection.files();
          } else {
            this.$message.error("系統錯誤");
          }
        } else if (index !== "cancel") {
          //更換缺失內容檔案
          var autoCreate = false;
          await this.$confirm("是否要同步建立維保資料?", "提示", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              autoCreate = true;
            })
            .catch(() => {
              autoCreate = false;
            });
          isOk = await this.inspection.settinglackfile(
            autoCreate,
            parseInt(content),
            index === "changeAgain" ? true : false
          );
          if (isOk) {
            this.$message("更新成功");
            this.lackFileId = content;
          } else {
            this.$message.error("檔案格式有誤，請重新設定");
          }
        } else {
          if (this.isUpdate) {
            await this.getBuildingMaintenanceReport();
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
            await this.getInspectionLack();
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
      this.dialogTitle = "inspectionlack";
      if (index === "createlack" || index === "updatelack") {
        var isOk =
          index === "createlack"
            ? await content.create(this.inspection.getID())
            : await content.update();
        if (isOk) {
          index === "createlack"
            ? this.$message("新增成功")
            : this.$message("更新成功");
          if (index === "createlack") this.isUpdate = true;
          await this.getInspectionLack();
          this.innerVisible = false;
        } else {
          this.$message.error("系統錯誤");
        }
      } else if (index === "cancellack") {
        this.innerVisible = false;
      } else if (index === "cancel") {
        this.innerVisible = false;
        this.excelVisible = false;
      } else if (index === "uploadExcelSave") {
        var isOk = await InspectionLacks.postMany(
          this.inspection.getID(),
          content
        );
        if (isOk) {
          this.$message("新增成功");
          this.isUpdate = true;
          await this.getInspectionLack();
          this.excelVisible = false;
        } else {
          this.$message.error("系統錯誤");
        }
      }
    },
    async handleTableClick(index, content) {
      console.log(index, JSON.stringify(content));
      this.dialogData = [];
      this.dialogTitle = "inspectionlack";
      this.dialogConfig = InspectionLacks.getTableConfig();
      if (index === "empty") {
        this.dialogData.push(InspectionLacks.empty());
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
          isDelete = await InspectionLacks.deleteMany(deleteArray.toString());
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
          await this.getInspectionLack();
          this.$refs.dialogtable.clearSelectArray();
          this.isUpdate = true;
        } else {
          this.$message.error("系統錯誤");
        }
      } else if (index === "open") {
        if (content.length !== undefined) {
          //代表不是外傳近來的
          content.forEach((item) => {
            this.dialogData.push(item);
          });
        } else {
          this.dialogData.push(content);
        }
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
      } else if (index === "clickPagination") {
        if (this.lacksShow) {
          this.lacksQueryParams = content;
          await this.getlacksSearchPage();
        } else {
          this.tablelistQueryParams = content;
          await this.getInspectionLack();
        }
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
      } else {
        if (this.isUpdate) {
          await this.getBuildingMaintenanceReport();
          this.isUpdate = false;
        }
        this.tableVisible = false;
        this.lacksShow = false;
        this.lacksQueryParams = { pageIndex: 1, pageSize: 10, total: 0 };
      }
    },
    async changeTable(value) {
      this.isTable = value;
      if (
        this.$route.params.target !== undefined &&
        this.$route.params.target.length !== 0 &&
        this.$route.params.type == "open"
      ) {
        if (typeof this.$route.params.target == "object") {
          if (this.$route.params.type == "open") {
            await this.handleTableClick("open", this.$route.params.target);
          }
        }
      } else if (
        this.$route.query.type !== undefined &&
        this.$route.query.type == "inspection"
      ) {
        await this.handleBlock("", "empty", "");
        this.$message("請先建立新的檢修申報後進行缺失項目的檔案設定");
      }
    },
    async handleSetLineChartData(type) {
      console.log("handleSetLineChartData", type);
      if (type == "inspection") {
        this.listQueryParams.isImproved = false;
        this.listQueryParams.declareResult = false;
        await this.getBuildingMaintenanceReport();
      } else {
        this.tableTitle = "inspectionlack";
        this.dialogtableConfig = InspectionLacks.getTableConfig();
        this.tableheaderButtonsName = [
          { name: "匯出檔案", icon: "el-icon-download", status: "exportExcel" },
        ];
        this.tablebuttonsName = [];
        await this.getlacksSearchPage();
        this.lacksShow = true;
        this.tableVisible = true;
      }
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
