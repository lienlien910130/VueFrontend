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
    ></DialogForm>

    <DialogExcel
      ref="dialogexcel"
      v-if="excelVisible === true"
      v-bind="excelAttrs"
      v-on:handleDialog="handleDialog"
    ></DialogExcel>
  </div>
</template>
<script>
import { blockmixin, dialogmixin, sharemixin, excelmixin } from "@/mixin/index";
import { DeviceAddressManagement } from "@/object/index";

export default {
  name: "DeviceAddressManagement",
  mixins: [sharemixin, blockmixin, dialogmixin, excelmixin],
  computed: {
    blockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getBuildingDeviceAddressManagement,
        resetlistQueryParams: this.resetlistQueryParams,
        setDeviceIdSelect: this.setDeviceIdSelect,
      };
    },
  },
  data() {
    return {
      deviceId: null,
    };
  },
  methods: {
    async init() {
      this.title = "deviceAddressManagement";
      this.headerButtonsName = [
        { name: "多筆刪除", icon: "el-icon-delete", status: "deleteMany" },
        { name: "多筆更新", icon: "el-icon-edit", status: "updateMany" },
        {
          name: "多筆新增地址點位",
          icon: "el-icon-document",
          status: "manyempty",
        },
        {
          name: "單筆新增",
          icon: "el-icon-circle-plus-outline",
          status: "empty",
        },
        { name: "設定樓層", icon: "el-icon-position", status: "setfloors" },
        { name: "匯出檔案", icon: "el-icon-download", status: "exportExcel" },
        { name: "匯入檔案", icon: "el-icon-upload2", status: "uploadExcel" },
      ];
      this.tableConfig = DeviceAddressManagement.getTableConfig();
    },
    async resetlistQueryParams() {
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
        internet: this.listQueryParams.internet,
      };
      await this.getBuildingDeviceAddressManagement();
    },
    async getBuildingDeviceAddressManagement() {
      var data = await DeviceAddressManagement.getSearchPage(
        this.listQueryParams
      );
      this.blockData = data.result;
      this.listQueryParams.total = data.totalPageCount;
    },
    async handleBlock(title, index, content) {
      //設備
      console.log(title, index, JSON.stringify(content));
      this.dialogConfig = _.cloneDeep(DeviceAddressManagement.getTableConfig());
      this.dialogData = [];
      if (index === "delete" || index === "deleteMany") {
        var isDelete = await this.handleBlockMixin(
          title,
          index,
          content,
          DeviceAddressManagement
        );
        if (isDelete) {
          await this.getBuildingDeviceAddressManagement();
        }
      } else if (index === "manyempty") {
        this.dialogConfig = DeviceAddressManagement.getManyEmptyTableConfig();
        this.dialogData.push(DeviceAddressManagement.empty());
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "createmany" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
        this.dialogStatus = "create";
      } else if (index === "setfloors") {
        var array = [];
        array.push(this.dialogConfig[1]);
        this.dialogConfig = array;
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "floorsupdate" },
          { name: "取消", type: "info", status: "cancelfloor" },
        ];
        this.dialogStatus = "update";
        this.innerVisible = true;
        this.selectArray = _.cloneDeep(content);
      } else {
        if (index === "open" || index === "updateMany") {
          this.dialogConfig.shift();
        }
        await this.handleBlockMixin(
          title,
          index,
          content,
          DeviceAddressManagement
        );
      }
    },
    async handleDialog(title, index, content) {
      //Dialog相關操作
      console.log(title, index, JSON.stringify(content));
      if (index == "createmany") {
        var deviceId = content.linkAssignDevices[0].getID();
        delete content.linkDevices;
        delete content.systemUsed;
        delete content.status;
        var result = await DeviceAddressManagement.batchInsert(
          deviceId,
          content
        );
        if (result) {
          this.$message("新增成功");
          this.$socket.sendMsg("deviceAddressManagement", index, result);
          await this.getBuildingDeviceAddressManagement();
          this.innerVisible = false;
        } else {
          this.$message.error("點位已存在，請重新輸入");
        }
      } else if (index == "floorsupdate") {
        var updateData = [];
        this.selectArray.forEach((item) => {
          updateData.push({
            id: item.id,
            floorsId: content.floorsId,
          });
        });
        var result = await DeviceAddressManagement.updateMany(
          this.deviceId,
          updateData
        );
        if (Object.keys(result).length !== 0) {
          this.$message("更新成功");
          this.$socket.sendMsg("deviceAddressManagement", index, result);
          await this.getBuildingDeviceAddressManagement();
          this.innerVisible = false;
          this.$refs.block.clearSelectArray();
        } else {
          this.$message.error("樓層更新錯誤");
        }
      } else if (
        index == "create" ||
        index == "update" ||
        index == "updateManySave" ||
        index === "uploadExcelSave"
      ) {
        var deviceId = null;
        if (index == "create") {
          deviceId = content.linkAssignDevices[0].getID();
        } else if (index == "update" || index == "updateManySave") {
          delete content.linkAssignDevices;
        }
        const { object, isSuccess } = await this.handleDialogMixin(
          title,
          index,
          content,
          DeviceAddressManagement,
          { deviceId: this.deviceId, resetLink: false, isPLC: false },
          { deviceId: deviceId, isPLC: false },
          { deviceId: this.deviceId, content: content, isPLC: false }
        );
        if (isSuccess) {
          await this.getBuildingDeviceAddressManagement();
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
            this.$message.error("該點位已存在，請重新輸入");
          }
        }

        if (object.repeatDataList !== undefined) {
          var list = [];
          object.repeatDataList.forEach((item) => {
            var str = [
              item.internet,
              item.system,
              item.address,
              item.number,
              item.memeryLoc,
            ];
            str = str.filter(Boolean).join("-");
            list.push(str);
          });
          this.$message.error(
            "【" + list.toString() + "】點位已存在，請重新上傳"
          );
        }
      } else {
        this.closeAll();
      }
    },
    setDeviceIdSelect(deviceId) {
      this.deviceId = deviceId;
    },
    async changeTable(value) {
      this.isTable = value;
      await this.openDialogWindows();
    },
  },
};
</script>
