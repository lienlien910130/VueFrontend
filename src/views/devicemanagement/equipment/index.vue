<template>
  <div class="editor-container">
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
    <!-- <Dialog
        ref="dialog"
        v-if="innerVisible === true"
        v-bind="dialogAttrs"
        :formtableData="formtableData"
        :formtableconfig="formtableconfig"
        :listQueryParams="maintainlistQueryParams"
        v-on:handleDialog="handleDialog"></Dialog> -->

    <DialogForm
      ref="dialogform"
      v-if="innerVisible === true"
      v-bind="dialogAttrs"
      v-on:handleDialog="handleDialog"
      v-on:handleChangeConfig="handleChangeConfig"
    ></DialogForm>

    <DialogTable
      ref="dialogtable"
      v-if="tableVisible === true"
      v-bind="tableAttrs"
      :searchType="searchType"
      v-on="tableEvent"
    ></DialogTable>

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
import {
  Device,
  DeviceType,
  Contactunit,
  Setting,
  DeviceAddressManagement,
  MaintainManagement,
} from "@/object/index";

export default {
  name: "Device",
  mixins: [sharemixin, blockmixin, dialogmixin, tablemixin, excelmixin],
  computed: {
    blockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getBuildingDevicesManage,
        resetlistQueryParams: this.resetlistQueryParams,
      };
    },
    tableEvent() {
      return {
        handleTableClick: this.handleTableClick,
        clickPagination: this.handleTableClick,
        searchChange: this.searchChange,
      };
    },
  },
  data() {
    return {
      selectdevice: null,
      searchType: "fire",
    };
  },
  methods: {
    async init() {
      this.title = "equipment";
      this.buttonsName = [
        { name: "刪除", icon: "el-icon-delete", status: "delete" },
        { name: "編輯", icon: "el-icon-edit", status: "open" },
        { name: "維保紀錄", icon: "el-icon-document", status: "openmaintain" },
        { name: "點位", icon: "el-icon-setting", status: "openaddress" },
      ];
      this.tableConfig = Device.getTableConfig();
      this.dialogSelect = await DeviceType.get();
      await this.getBuildingDevicesManage();
    },
    async resetlistQueryParams() {
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
      };
      await this.getBuildingDevicesManage();
    },
    async resettablelistQueryParams(isMaintain) {
      this.tablelistQueryParams = {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      };
      if (isMaintain) {
        await this.getDevicesManageMaintain();
      } else {
        await this.getDevicesAddress(this.tableVisible);
      }
    },
    async getBuildingDevicesManage() {
      var data = await Device.getSearchPage(this.listQueryParams);
      this.blockData = data.result;
      this.listQueryParams.total = data.totalPageCount;
    },
    async getDevicesManageMaintain() {
      var data = await this.selectdevice.getMaintain(
        this.selectdevice.getID(),
        this.tablelistQueryParams
      );
      this.tableTitle = "devicemaintain";
      this.isHasHeaderButtons = false;
      this.dialogtableConfig =
        MaintainManagement.getDeviceOfMaintainTableConfig();
      this.tableData = data.result;
      this.tablelistQueryParams.total = data.totalPageCount;
      this.tablebuttonsName = [
        { name: "檢視", icon: "el-icon-view", status: "openmaintain" },
      ];
    },
    async getDevicesAddress(tableVisible = true) {
      var data = {};
      var tabledata = [];
      data = await this.selectdevice.getDeviceAddresss(
        this.tablelistQueryParams,
        this.searchType
      );
      tabledata = data.result;
      if (!tableVisible && data.totalPageCount == undefined) {
        var plcaddress = await this.selectdevice.getDeviceAddresss(
          this.tablelistQueryParams,
          "plc"
        );
        if (plcaddress.totalPageCount !== undefined) {
          this.searchType = "plc";
          data = plcaddress;
          tabledata = plcaddress.result;
        }
      }

      this.tableTitle = "deviceaddress";
      this.isHasHeaderButtons = false;
      this.dialogtableConfig =
        this.searchType == "fire"
          ? DeviceAddressManagement.getTableConfig()
          : DeviceAddressManagement.getPLCTableConfig();
      this.dialogtableConfig.shift();
      this.tableData = tabledata;
      this.tablelistQueryParams.total = data.totalPageCount;
      this.tablebuttonsName = [
        { name: "檢視", icon: "el-icon-view", status: "openaddress" },
      ];
    },
    handleChangeConfig(isMandatory) {
      this.dialogConfig[2].mandatory = isMandatory;
    },
    async handleBlock(title, index, content) {
      //設備
      console.log(title, index, JSON.stringify(content));
      this.dialogData = [];
      this.dialogConfig = Device.getTableConfig();
      this.dialogTitle = this.title;
      this.dialogButtonsName = [];
      if (index === "open") {
        this.dialogStatus = "update";
        if (content.length !== undefined) {
          //代表不是外傳近來的
          content.forEach((item) => {
            this.dialogData.push(item);
          });
        } else {
          this.dialogData.push(content);
        }
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "update" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
      } else if (index === "delete" || index === "deleteMany") {
        var isDelete = false;
        if (index === "delete") {
          isDelete = await content.delete();
        } else {
          var deleteArray = [];
          content.forEach((item) => {
            deleteArray.push(item.id);
          });
          isDelete = await Device.deleteMany(deleteArray.toString());
        }
        if (isDelete) {
          this.$message("刪除成功");
          // this.$store.dispatch('building/setDevice')
          this.$socket.sendMsg(
            "device",
            "delete",
            index === "delete" ? content.getID() : deleteArray.toString()
          );
          var length = content.length !== undefined ? content.length : 1;
          var page = Math.ceil(
            (this.listQueryParams.total - length) /
              this.listQueryParams.pageSize
          );
          if (this.listQueryParams.pageIndex > page) {
            this.listQueryParams.pageIndex = page;
          }
          await this.getBuildingDevicesManage();
          this.$refs.block.clearSelectArray();
        } else {
          this.$message.error("系統錯誤");
        }
      } else if (index === "empty") {
        this.dialogData.push(Device.empty());
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "create" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
        this.dialogStatus = "create";
      } else if (index === "openmaintain") {
        this.selectdevice = content;
        await this.resettablelistQueryParams(true);
        this.tableVisible = true;
      } else if (index === "exportExcel") {
        this.exportExcelData = this.blockData;
        this.excelVisible = true;
        this.excelType = "exportExcel";
      } else if (index === "uploadExcel") {
        this.excelVisible = true;
        this.excelType = "uploadExcel";
      } else if (index === "openaddress") {
        this.selectdevice = content;
        await this.resettablelistQueryParams(false);
        this.tableVisible = true;
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
    async handleDialog(resetLink, index, content) {
      //Dialog相關操作
      console.log(index, JSON.stringify(content));
      if (
        index === "update" ||
        index === "create" ||
        index === "uploadExcelSave" ||
        index === "updateManySave"
      ) {
        if (content.internetNumber == "") {
          content.internetNumber = null;
        }
        var result =
          index === "update" || index === "updateManySave"
            ? await content.update(resetLink)
            : index === "create"
            ? await content.create()
            : await Device.postMany(content);
        var condition =
          index !== "uploadExcelSave"
            ? Object.keys(result).length !== 0
            : result.result.length !== 0;
        if (condition) {
          index === "update" || index === "updateManySave"
            ? this.$message("更新成功")
            : this.$message("新增成功");
          // this.$store.dispatch('building/setDevice')
          this.$socket.sendMsg(
            "device",
            index,
            index !== "uploadExcelSave" ? result : result.result
          );
          if (index === "create" || index === "updateManySave") {
            this.$alert("需要接訊號請洽水星服務人員", "提醒", {
              confirmButtonText: "確定",
            });
          }
          await this.getBuildingDevicesManage();
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
          this.$message.error("網路編號已存在，請重新輸入");
          // if(index !== 'uploadExcelSave'){
          //     this.$message.error('網路編號已存在，請重新輸入')
          // }
        }
        // if(index == 'uploadExcelSave' && result.repeatDataList !== undefined){
        //     var list = []
        //     result.repeatDataList.forEach(item=>{
        //         list.push(item.name)
        //     })
        //     this.$message.error('【'+list.toString()+'】設備的網路編號已存在，請重新上傳')
        // }
      } else {
        this.innerVisible = false;
        this.excelVisible = false;
        this.$refs.block.clearSelectArray();
      }
    },
    async handleTableClick(index, content) {
      console.log(index, JSON.stringify(content));
      if (index == "openmaintain") {
        var routeData = this.$router.resolve({
          path: "/normal/maintenance",
          query: { type: "maintain", obj: content.getID() },
        });
        window.open(routeData.href, "_blank");
      } else if (index == "openaddress") {
        var routeData = this.$router.resolve({
          path: "/deviceaddress/index",
          query: { type: "address", obj: content.getID() },
        });
        window.open(routeData.href, "_blank");
      } else if (index == "openplcaddress") {
        var routeData = this.$router.resolve({
          path: "/deviceaddress/plc",
          query: { type: "plc", obj: content.getID() },
        });
        window.open(routeData.href, "_blank");
      } else if (index == "clickPagination") {
        this.tablelistQueryParams = content;
        if (this.tableTitle == "devicemaintain") {
          await this.getDevicesManageMaintain();
        } else {
          await this.getDevicesAddress();
        }
      } else {
        this.tableVisible = false;
        this.searchType = "fire";
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
          await this.handleBlock(
            "equipment",
            "updateMany",
            this.$route.params.target
          );
        }
      } else if (
        this.$route.query.type !== undefined &&
        this.$route.query.type == "device"
      ) {
        await this.handleBlock("", "empty", "");
      }
    },
    async searchChange(index) {
      this.searchType = index;
      await this.resettablelistQueryParams(false);
      this.tablebuttonsName = [
        { name: "檢視", icon: "el-icon-view", status: "openplcaddress" },
      ];
    },
  },
};
</script>
