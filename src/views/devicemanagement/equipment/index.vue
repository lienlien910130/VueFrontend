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
  DeviceAddressManagement,
  MaintainManagement,
} from "@/object/index";
import { changeDefaultFullType } from "@/utils";

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
      isUpdate: false,
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
    async resettablelistQueryParams(index) {
      this.tablelistQueryParams = {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      };
      if (index === "openmaintain") {
        await this.getDevicesManageMaintain();
      } else if (index === "openaddress") {
        await this.getDevicesAddress(this.tableVisible);
      } else {
        await this.getDevicesTypes();
      }
    },
    async getBuildingDevicesManage() {
      var data = await Device.getSearchPage(this.listQueryParams);
      this.blockData = data.result;
      this.listQueryParams.total = data.totalPageCount;
    },
    async getDevicesTypes() {
      var data = await DeviceType.getSearchPage(this.tablelistQueryParams);
      this.tableTitle = "deviceTypes";
      this.isHasHeaderButtons = true;
      this.dialogtableConfig = DeviceType.getTableConfig();
      this.tableData = data.result;
      this.tablelistQueryParams.total = data.totalPageCount;
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
      this.tablebuttonsName =
        this.searchType == "fire"
          ? [{ name: "檢視", icon: "el-icon-view", status: "openaddress" }]
          : [{ name: "檢視", icon: "el-icon-view", status: "openplcaddress" }];
    },
    handleChangeConfig(isMandatory) {
      this.dialogConfig[2].mandatory = isMandatory;
    },
    async handleBlock(title, index, content) {
      //設備
      console.log(title, index, JSON.stringify(content));
      this.dialogData = [];
      this.dialogConfig = Device.getTableConfig();
      if (index === "delete" || index === "deleteMany") {
        var isDelete = await this.handleBlockMixin(
          title,
          index,
          content,
          Device
        );
        if (isDelete) {
          await this.getBuildingDevicesManage();
        }
      } else if (index === "openmaintain" || index === "openaddress") {
        this.selectdevice = content;
        await this.resettablelistQueryParams(index);
        this.tableVisible = true;
      } else if (index === "opendeviceType") {
        await this.resettablelistQueryParams(index);
        this.tableVisible = true;
      } else {
        await this.handleBlockMixin(title, index, content, Device);
      }
    },
    async handleDialog(options, index, content) {
      //Dialog相關操作
      console.log(options, index, JSON.stringify(content));
      if (options == "devicetype") {
        if (index === "updatedeviceTypeManySave") {
          var isOk = await content.update();
          if (isOk) {
            this.$message("更新成功");
            await this.getDevicesTypes();
            this.isUpdate = true;
            this.dialogData.forEach((item, index) => {
              if (item.id == content.id) {
                this.dialogData.splice(index, 1, content);
              }
            });
          }
        } else {
          await this.handleDeviceTypeDialog(index, content);
        }
      } else {
        if (
          index === "update" ||
          index === "create" ||
          index === "uploadExcelSave" ||
          index === "updateManySave"
        ) {
          if (content.internetNumber == "") {
            content.internetNumber = null;
          }
          const { object, isSuccess } = await this.handleDialogMixin(
            this.title,
            index,
            content,
            Device,
            { resetLink: options }
          );
          if (isSuccess) {
            await this.getBuildingDevicesManage();
          }
          await this.handleDialogMixin_common(
            Device,
            isSuccess,
            index,
            content,
            object
          );
        } else {
          this.closeAll();
        }
      }
    },
    async handleDeviceTypeDialog(index, content) {
      this.dialogData = [];
      this.dialogTitle = "devicetype";
      if (index === "createdeviceType" || index === "updatedeviceType") {
        var array = changeDefaultFullType(content.fullType);
        content.setTypeName(array.label);
        var isOk =
          index === "createdeviceType"
            ? await content.create()
            : await content.update();
        if (isOk) {
          index === "createdeviceType"
            ? this.$message("新增成功")
            : this.$message("更新成功");
          if (index === "updatedeviceType") this.isUpdate = true;
          await this.getDevicesTypes();
          this.innerVisible = false;
        } else {
          this.$message.error("系統錯誤");
        }
      } else if (index === "canceldeviceType") {
        this.innerVisible = false;
      } else if (index === "cancel") {
        this.innerVisible = false;
        this.excelVisible = false;
      } else if (index === "uploadExcelSave") {
        var isOk = await DeviceType.postMany(content);
        if (isOk) {
          this.$message("新增成功");
          await this.getDevicesTypes();
          this.excelVisible = false;
        } else {
          this.$message.error("系統錯誤");
        }
      }
    },
    async handleTableClick(index, content) {
      console.log(index, JSON.stringify(content));
      var title = "devicetype";
      this.dialogData = [];
      this.dialogTitle = "devicetype";
      this.dialogConfig = DeviceType.getTableConfig();
      if (index == "openmaintain") {
        var routeData = this.$router.resolve({
          path: "/normal/maintenance",
          query: { type: "maintain", obj: content.getID() },
        });
        window.open(routeData.href, "_blank");
      } else if (index == "openaddress") {
        this.$router.push({
          name: "deviceAddressManagement",
          params: { target: new Array(content), type: "open" },
        });
      } else if (index == "openplcaddress") {
        this.$router.push({
          name: "devicePLCAddressManagement",
          params: { target: new Array(content), type: "open" },
        });
      } else if (index == "clickPagination") {
        this.tablelistQueryParams = content;
        if (this.tableTitle == "devicemaintain") {
          await this.getDevicesManageMaintain();
        } else if (this.tableTitle == "deviceaddress") {
          await this.getDevicesAddress();
        } else {
          await this.getDevicesTypes();
        }
      } else if (index === "delete" || index === "deleteMany") {
        var isDelete = await this.handleBlockMixin(
          title,
          index,
          content,
          DeviceType
        );
        if (isDelete) {
          await this.getDevicesTypes();
          this.$refs.dialogtable.clearSelectArray();
          this.isUpdate = true;
        }
      } else if (index === "open") {
        await this.handleBlockMixin(title, index, content, DeviceType);
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "updatedeviceType" },
          { name: "取消", type: "info", status: "canceldeviceType" },
        ];
      } else if (index === "updateMany") {
        await this.handleBlockMixin(title, index, content, DeviceType);
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "updatedeviceTypeManySave" },
          { name: "取消", type: "info", status: "cancel" },
        ];
      } else if (index === "empty") {
        await this.handleBlockMixin(title, index, content, DeviceType);
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "createdeviceType" },
          { name: "返回", type: "info", status: "canceldeviceType" },
        ];
      } else if (index === "exportExcel" || index === "uploadExcel") {
        await this.handleBlockMixin(title, index, content, DeviceType);
      } else {
        if (this.isUpdate) {
          await this.getBuildingDevicesManage();
          this.isUpdate = false;
        }
        this.tableVisible = false;
        this.searchType = "fire";
      }
    },
    async changeTable(value) {
      this.isTable = value;
      await this.openDialogWindows();
    },
    async searchChange(index) {
      this.searchType = index;
      await this.resettablelistQueryParams("openaddress");
      this.tablebuttonsName = [
        { name: "檢視", icon: "el-icon-view", status: "openplcaddress" },
      ];
    },
  },
};
</script>
