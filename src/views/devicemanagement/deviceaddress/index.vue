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
        v-on:handleDialog="handleDialog"></Dialog> -->

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
      //await this.getBuildingDeviceAddressManagement()
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
      this.dialogData = [];
      this.dialogConfig = _.cloneDeep(DeviceAddressManagement.getTableConfig());
      this.dialogTitle = this.title;
      this.dialogButtonsName = [];
      if (index === "open") {
        this.dialogConfig.shift();
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
          isDelete = await DeviceAddressManagement.deleteMany(
            deleteArray.toString()
          );
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
          this.$socket.sendMsg(
            "deviceAddress",
            "delete",
            index === "delete" ? content.getID() : deleteArray.toString()
          );
          await this.getBuildingDeviceAddressManagement();
          this.$refs.block.clearSelectArray();
        } else {
          this.$message.error("系統錯誤");
        }
      } else if (index === "empty") {
        this.dialogData.push(DeviceAddressManagement.empty());
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "create" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
        this.dialogStatus = "create";
      } else if (index === "exportExcel") {
        this.exportExcelData = this.blockData;
        this.excelVisible = true;
        this.excelType = "exportExcel";
      } else if (index === "uploadExcel") {
        this.excelVisible = true;
        this.excelType = "uploadExcel";
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
      } else if (index === "updateMany") {
        this.dialogConfig.shift();
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
      if (index == "createmany" || index == "create") {
        var deviceId = content.linkAssignDevices[0].getID();
        //delete content.linkAssignDevices
        if (index == "createmany") {
          delete content.linkDevices;
          delete content.systemUsed;
          delete content.status;
        }
        var result =
          index === "create"
            ? await content.create(deviceId)
            : await DeviceAddressManagement.batchInsert(deviceId, content);
        if (Object.keys(result).length !== 0 || result == true) {
          this.$message("新增成功");
          this.$socket.sendMsg("deviceAddress", index, result);
          await this.getBuildingDeviceAddressManagement();
          this.innerVisible = false;
        } else {
          this.$message.error("點位已存在，請重新輸入");
        }
      } else if (index == "update" || index == "updateManySave") {
        delete content.linkAssignDevices;
        var result = await content.update(this.deviceId, false);
        if (Object.keys(result).length !== 0) {
          this.$message("更新成功");
          this.$socket.sendMsg("deviceAddress", index, result);
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
          this.$socket.sendMsg("deviceAddress", index, result);
          await this.getBuildingDeviceAddressManagement();
          this.innerVisible = false;
          this.$refs.block.clearSelectArray();
        } else {
          this.$message.error("樓層更新錯誤");
        }
      } else if (index === "uploadExcelSave") {
        var result = await DeviceAddressManagement.postMany(
          this.deviceId,
          content
        );
        if (result.result.length !== 0) {
          this.$message("新增成功");
          this.$socket.sendMsg("deviceAddress", index, result.result);
          await this.getBuildingDeviceAddressManagement();
          this.excelVisible = false;
        }
        if (result.repeatDataList !== undefined) {
          var list = [];
          result.repeatDataList.forEach((item) => {
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
        this.innerVisible = false;
        this.excelVisible = false;
        this.$refs.block.clearSelectArray();
      }
    },
    setDeviceIdSelect(deviceId) {
      this.deviceId = deviceId;
    },
    async changeTable(value) {
      this.isTable = value;
      if (
        this.$route.query.type !== undefined &&
        this.$route.query.type == "address" &&
        this.$route.query.obj !== ""
      ) {
        var data = await DeviceAddressManagement.getOfID(this.$route.query.obj);
        await this.handleBlock("", "open", data);
      }
    },
  },
};
</script>
