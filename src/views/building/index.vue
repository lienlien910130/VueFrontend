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

    <DialogTable
      ref="dialogtable"
      v-if="tableVisible === true"
      v-bind="tableAttrs"
      v-on="tableEvent"
    ></DialogTable>

    <el-dialog
      top="5vh"
      :title="previewTitle"
      :visible.sync="previewVisible"
      width="80%"
      append-to-body
      center
    >
      <div style="text-align: center">
        <img :src="previewPath" :class="imgClass" @click="downloadImage" />
      </div>
    </el-dialog>
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
import { Files, Building, Floors } from "@/object/index";
import QRCode from "qrcode";

export default {
  mixins: [sharemixin, blockmixin, dialogmixin, tablemixin, excelmixin],
  computed: {
    blockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getAllBuilding,
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
        title: this.filesTitle,
        specialId: this.floorImageId,
        files: this.files,
      };
    },
    imgClass() {
      if (this.previewType == "floorImage") {
        return "previewImg";
      } else {
        return "qrcodeImg";
      }
    },
  },
  async created() {
    await this.initBuilding();
  },
  data() {
    return {
      uploadVisible: false,
      floorsArray: [],
      building: null,
      floor: null,
      files: [],
      filesTitle: "",
      floorImageId: "",
      //平面圖
      previewVisible: false,
      previewPath: "",
      previewTitle: "",
      previewType: "",
      options: {
        errorCorrectionLevel: "H",
        type: "image/jpeg",
        quality: 0.3,
        margin: 1,
        color: {
          dark: "#010599FF",
          light: "#FFBF60FF",
        },
      }
    };
  },
  methods: {
    async init() {},
    async initBuilding() {
      this.title = "building";
      this.tableConfig = Building.getTableConfig();
      await this.getAllBuilding();
      this.buttonsName = [
        { name: "刪除", icon: "el-icon-delete", status: "delete" },
        { name: "編輯", icon: "el-icon-edit", status: "open" },
        { name: "樓層", icon: "el-icon-position", status: "openfloors" },
        { name: "檔案", icon: "el-icon-folder-opened", status: "openfiles" },
        {
          name: "產生QRcode",
          icon: "el-icon-picture-outline-round",
          status: "qrcode",
        },
      ];
    },
    async resetlistQueryParams() {
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
      };
      await this.getAllBuilding();
    },
    async resettablelistQueryParams() {
      this.tablelistQueryParams = {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        orderBy: "sort",
      };
      await this.getFloorList();
    },
    async getAllBuilding() {
      this.blockData = [];
      var data = await Building.getSearchPage(this.listQueryParams);
      this.blockData = data.result;
      this.listQueryParams.total = data.totalPageCount;
    },
    async getFloorList() {
      var data = await Floors.getSearchPage(
        this.building.getID(),
        this.tablelistQueryParams
      );
      this.tableTitle = "floor";
      this.dialogtableConfig = Floors.getTableConfig();
      this.tableData = data.result;
      this.tablelistQueryParams.total = data.totalPageCount;
    },
    async crefloor(index, val, bid) {
      const length = this.floorsArray.length;
      for (var i = 1; i <= val; i++) {
        var str =
          index == "up" ? i.toString() + "F" : "地下" + i.toString() + "F";
        var sor = index == "up" ? i * 10 : (length + i) * 10;
        var isUnderground = index !== "up";
        var floor = {
          floor: str,
          sort: sor,
          parentId: bid,
          isUnderground: isUnderground,
        };
        await this.floorsArray.push(floor);
      }
    },
    async postFloor(buildingId) {
      var isOk = await Floors.create(buildingId, this.floorsArray);
      return isOk;
    },
    async handleBlock(title, index, content) {
      console.log(title, index, JSON.stringify(content));
      this.dialogData = [];
      this.dialogSelect = [];
      this.building = null;
      this.dialogConfig = Building.getTableConfig();
      if (index === "open") {
        this.building = content;
        this.dialogConfig[4].isEdit = false;
        this.dialogConfig[5].isEdit = false;
        await this.handleBlockMixin(title, index, content, Building);
      } else if (
        index === "empty" ||
        index === "exportExcel" ||
        index === "uploadExcel" ||
        index === "updateMany"
      ) {
        if (index === "updateMany"){
          this.dialogConfig[4].isEdit = false;
          this.dialogConfig[5].isEdit = false;
        }
        await this.handleBlockMixin(title, index, content, Building);
      }else if (index === "delete" || index === "deleteMany") {
        var hasThisBuilding = index === 'delete' ?
          this.buildingid == content.getID() :
          content.findIndex((item)=>{ return item.id === this.buildingid}) !== -1
        if(hasThisBuilding){
          this.$message.error("請勿刪除正在選取的建築物");
          return false;
        }
        var isDelete = await this.handleBlockMixin(
          title,
          index,
          content,
          Building
        );
        if (isDelete) {
          await this.getAllBuilding();
          this.$store.dispatch(
            "building/setBuildingList",
            await Building.get()
          );
        }
        // var isDelete = false;
        // if (index === "delete") {
        //   if (this.buildingid == content.getID()) {
        //     this.$message.error("請勿刪除正在選取的建築物");
        //     return false;
        //   }
        //   isDelete = await content.delete();
        // } else {
        //   var deleteArray = [];
        //   content.forEach((item) => {
        //     deleteArray.push(item.id);
        //   });
        //   var indexBuilding = deleteArray.findIndex(
        //     (item) => item == this.buildingid
        //   );
        //   if (indexBuilding !== -1) {
        //     this.$message.error("請勿刪除正在選取的建築物");
        //     deleteArray = deleteArray.filter((item) => {
        //       return item !== this.buildingid;
        //     });
        //   }
        //   isDelete = await Building.deleteMany(deleteArray.toString());
        // }
        // if (isDelete) {
        //   this.$message("刪除成功");
        //   var length = content.length !== undefined ? content.length : 1;
        //   var page = Math.ceil(
        //     (this.listQueryParams.total - length) /
        //       this.listQueryParams.pageSize
        //   );
        //   if (this.listQueryParams.pageIndex > page) {
        //     this.listQueryParams.pageIndex = page;
        //   }
        //   await this.getAllBuilding();
        //   this.$store.dispatch(
        //     "building/setBuildingList",
        //     await Building.get()
        //   );
        //   this.$socket.sendMsg(
        //     "building",
        //     "delete",
        //     index === "delete" ? content.getID() : deleteArray.toString()
        //   );
        //   this.$refs.block.clearSelectArray();
        // } else {
        //   this.$message.error("系統錯誤");
        // }
      } else if (index === "openfloors") {
        this.building = content;
        this.filesTitle = "building";
        this.tablelistQueryParams = {
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          orderBy: "sort",
        };
        await this.getFloorList();
        this.tableVisible = true;
        this.tablebuttonsName = [
          { name: "編輯", icon: "el-icon-edit", status: "open" },
          { name: "檔案", icon: "el-icon-folder-opened", status: "openfiles" },
        ];
        this.tableheaderButtonsName = [
          { name: "多筆更新", icon: "el-icon-edit", status: "updateMany" },
          { name: "匯出檔案", icon: "el-icon-download", status: "exportExcel" },
        ];
      } else if (index === "openfiles") {
        this.filesTitle = "building";
        this.building = content;
        await this.handleUpload(this.building, index, content);
      } else if (index === "qrcode") {
        this.previewTitle = content.buildingName + " QRcode 註冊";
        this.previewType = "qrcode";
        var _this = this;
        QRCode.toDataURL(
          "https://demo.mercuryfire.com.tw/register?bID=" + content.id,
          this.options,
          function (err, url) {
            if (err) throw err;
            _this.previewPath = url;
          }
        );
        this.previewVisible = true;
      }
    },
    async handleTableClick(index, content) {
      console.log(index, JSON.stringify(content));
      this.dialogData = [];
      this.dialogTitle = "floor";
      this.dialogConfig = Floors.getTableConfig();
      this.dialogButtonsName = [];
      if (index === "open") {
        this.dialogData.push(content);
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "updatefloor" },
          { name: "取消", type: "info", status: "cancelfloor" },
        ];
        this.innerVisible = true;
        this.dialogStatus = "update";
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
      } else if (index === "exportExcel") {
        this.exportExcelData = this.tableData;
        this.excelVisible = true;
        this.excelType = "exportExcel";
      } else if (index === "openfiles") {
        this.filesTitle = "floorFiles";
        this.floor = content;
        this.floorImageId =
          content.floorPlanID == null ? null : content.getImageID();
        await this.handleUpload(this.floor, index, content);
      } else if (index === "clickPagination") {
        this.tablelistQueryParams = content;
        await this.getFloorList();
      } else if (index === "image") {
        var _temp = await content.getImage();
        this.previewPath = _temp;
        this.previewTitle = content.getName() + "平面圖";
        this.previewType = "floorImage";
        this.previewVisible = true;
      } else {
        this.tableVisible = false;
      }
    },
    async handleDialog(title, index, content) {
      console.log(title, index, JSON.stringify(content));
      if (title === "building") {
        if (index === "create") {
          var result = await content.create();
          if (Object.keys(result).length !== 0) {
            this.floorsArray = [];
            await this.crefloor(
              "up",
              content.floorsOfAboveGround,
              result.getID()
            );
            await this.crefloor(
              "down",
              content.floorsOfUnderground,
              result.getID()
            );
            var isOk = await this.postFloor(result.getID());
            isOk == true
              ? this.$message("新增成功")
              : this.$message.error("新增樓層有誤");
            this.$socket.sendMsg("building", "create", result);
            await this.getAllBuilding();
            this.innerVisible = false;
          } else {
            this.$message.error("該建築物名稱已存在，請重新輸入");
          }
        } else if (index === "update" || index === "updateManySave") {
          var result = await content.update();
          if (Object.keys(result).length !== 0) {
            this.$message("更新成功");
            this.$socket.sendMsg("building", "update", result, result.getID());
            this.$socket.sendMsg("building", "info", result, result.getID());
            await this.getAllBuilding();
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
            this.$message.error("該建築物名稱已存在，請重新輸入");
          }
        } else if (index === "uploadExcelSave") {
          var result = await Building.postMany(content);
          if (result.result.length !== 0) {
            var isOk;
            var updateList = [];
            for (let item of result.result) {
              this.floorsArray = [];
              await this.crefloor("up", item.floorsOfAboveGround, item.id);
              await this.crefloor("down", item.floorsOfUnderground, item.id);
              isOk = await this.postFloor(item.id);
              if (isOk == false) {
                updateList.push(item.buildingName);
              }
            }
            this.$message("新增成功");
            this.$store.dispatch(
              "building/setBuildingList",
              await Building.get()
            );
            this.$socket.sendMsg("building", "set", await Building.get());
            await this.getAllBuilding();
            this.innerVisible = false;
            if (updateList.length !== 0) {
              this.$message.error(
                "【" + updateList.toString() + "】建築物的樓層新增有誤"
              );
            }
          }
          if (result.repeatDataList !== undefined) {
            var list = [];
            result.repeatDataList.forEach((item) => {
              list.push(item.buildingName);
            });
            this.$message.error(
              "【" + list.toString() + "】建築物名稱已存在，請重新上傳"
            );
          }
        } else if (index === "createfile" || index === "deletefile") {
          await this.handleUpload(this.building, index, content);
        } else {
          this.innerVisible = false;
          this.excelVisible = false;
          this.uploadVisible = false;
          this.$refs.block.clearSelectArray();
        }
      } else {
        if (index === "updateManySave") {
          var result = await content.update(this.building.getID());
          if (Object.keys(result).length !== 0) {
            this.$message("更新成功");
          }
          if (this.buildingid == this.building.getID()) {
            this.$store.dispatch("building/setFloors");
          }
          this.$socket.sendMsg("floor", index, result, this.building.getID());
          await this.getFloorList();
          this.dialogData.forEach((item, index) => {
            if (item.id == content.id) {
              this.dialogData.splice(index, 1, content);
            }
          });
        } else {
          await this.handleFloor(index, content);
        }
      }
    },
    async handleFloor(index, content) {
      this.dialogData = [];
      this.dialogTitle = "floor";
      this.dialogConfig = Floors.getTableConfig();
      this.dialogButtonsName = [];
      if (index === "updatefloor") {
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "updatefloor" },
          { name: "取消", type: "info", status: "cancelfloor" },
        ];
        var floorsArray = [];
        floorsArray.push(content);
        var result = await content.update(this.building.getID());
        if (Object.keys(result).length !== 0) {
          index === "updatefloor"
            ? this.$message("更新成功")
            : this.$message("新增成功");
          if (this.buildingid == this.building.getID()) {
            this.$store.dispatch("building/setFloors");
          }
          this.$socket.sendMsg(
            "floor",
            "update",
            result,
            this.building.getID()
          );
          await this.getFloorList();
          this.innerVisible = false;
        } else {
          this.$message.error("該樓層名稱已存在，請重新輸入");
        }
      } else if (index === "createfile" || index === "deletefile") {
        await this.handleUpload(this.floor, index, content);
      } else if (index === "cancelfloor" || index == "cancel") {
        this.innerVisible = false;
        this.uploadVisible = false;
        this.excelVisible = false;
      } else if (index === "clickPagination") {
        this.tablelistQueryParams = content;
        await this.getFloorList();
      } else if (index === "exportExcel") {
        this.exportExcelData = this.tableData;
        this.excelVisible = true;
        this.excelType = "exportExcel";
      } else if (index === "change") {
        this.dialogTitle = "floorFiles";
        this.floor.setFloorPlanID(parseInt(content));
        var result = await this.floor.update(this.building.getID());
        if (Object.keys(result).length !== 0) {
          this.$message("更新成功");
          this.floorImageId = content;
          if (this.buildingid == this.building.getID()) {
            this.$store.dispatch("building/setFloors");
          }
          this.$socket.sendMsg(
            "floor",
            "update",
            result,
            this.building.getID()
          );
        } else {
          this.$message.error("系統錯誤");
        }
      }
    },
    //打開檔案&上傳檔案&刪除檔案
    async handleUpload(type, index, content) {
      var isOk;
      if (index == "openfiles") {
        this.files = await content.files();
        this.uploadVisible = true;
      } else if (index === "createfile") {
        const formData = new FormData();
        content.forEach((item) => {
          formData.append("file", item.raw);
        });
        isOk = await type.createfiles(formData);
        if (isOk) {
          this.$message("上傳成功");
          this.files = await type.files();
        } else {
          this.$message.error("系統錯誤");
        }
      } else {
        var data = { id: content.toString() };
        isOk = await Files.delete(data);
        if (isOk) {
          this.$message("刪除成功");
          this.files = await type.files();
        } else {
          this.$message.error("系統錯誤");
        }
      }
    },
    downloadImage() {
      let link = document.createElement("a");
      link.href = this.previewPath;
      link.download = this.previewTitle;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
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
            "building",
            "updateMany",
            this.$route.params.target
          );
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.line {
  text-align: center;
}

.previewImg {
  width: 100%;
  height: auto;
  cursor: pointer;
}

.qrcodeImg {
  height: 200px;
  width: auto;
  cursor: pointer;
}
</style>
