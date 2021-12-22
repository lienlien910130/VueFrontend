<template>
  <div class="editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :md="24" :lg="6">
        <div class="block-wrapper">
          <h3>基本資料</h3>
          <Form v-on:handleBuildingInfo="handleBuildingInfo" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="18">
        <div class="block-wrapper">
          <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="管委會" name="MC">
              <Block
                v-if="activeName == 'MC'"
                ref="block"
                :list-query-params.sync="listQueryParams"
                v-bind="blockAttrs"
                v-on="ManagementListblockEvent"
              >
              </Block>
            </el-tab-pane>
            <el-tab-pane label="廠商資料" name="Vender">
              <Block
                v-if="activeName == 'Vender'"
                ref="block"
                :list-query-params.sync="listQueryParams"
                v-bind="blockAttrs"
                v-on="ContactunitListblockEvent"
              >
              </Block>
            </el-tab-pane>
            <el-tab-pane label="消防安全設備檢修專業機構" name="Professional">
              <Block
                v-if="activeName == 'Professional'"
                ref="block"
                :list-query-params.sync="listQueryParams"
                v-bind="blockAttrs"
                v-on="ContactunitListblockEvent"
              >
              </Block>
            </el-tab-pane>
            <el-tab-pane label="大樓相關資料" name="BOT">
              <Upload
                v-if="activeName == 'BOT'"
                v-bind="buildingUploadAttrs"
                v-on:handleFilesUpload="handleFilesUpload"
              ></Upload>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="6">
        <div :class="floorwrapper">
          <h3>大樓樓層</h3>
          <Range
            v-on:handleBuildingFloorSelect="handleBuildingFloorSelect"
          ></Range>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="18">
        <div class="block-wrapper">
          <el-tabs v-model="activeFloor" type="border-card">
            <el-tab-pane label="大樓住戶資料" name="US">
              <Block
                ref="downblock"
                :list-query-params.sync="downlistQueryParams"
                v-bind="downBlockAttrs"
                v-on="UserblockEvent"
              ></Block>
            </el-tab-pane>
            <el-tab-pane label="樓層門牌資料" name="IN" :disabled="!isChoose">
              <Block
                v-if="activeFloor == 'IN' && isChoose"
                ref="downblock"
                :list-query-params.sync="downlistQueryParams"
                v-bind="downBlockAttrs"
                v-on="FloorblockEvent"
              ></Block>
            </el-tab-pane>
            <el-tab-pane label="樓層平面圖" name="IM" :disabled="!isChoose">
              <FloorImage
                v-if="activeFloor == 'IM' && isChoose"
                v-bind="floorImageAttrs"
              ></FloorImage>
            </el-tab-pane>
            <el-tab-pane label="樓層相關資料" name="OT" :disabled="!isChoose">
              <Upload
                ref="floorsupload"
                v-if="activeFloor == 'OT' && isChoose"
                v-bind="floorUploadAttrs"
                v-on:handleFilesUpload="handleFilesUpload"
              ></Upload>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <!-- <Dialog
                ref="dialog"
                v-bind="dialogAttrs"
                :files="floorFiles"
                v-on:handleDialog="handleDialog"></Dialog> -->

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
        :isP="activeName == 'Professional'"
      ></DialogExcel>
    </el-row>
  </div>
</template>

<script>
import { blockmixin, dialogmixin, sharemixin, excelmixin } from "@/mixin/index";
import {
  Files,
  Committee,
  UsageOfFloor,
  Setting,
  User,
  Contactunit,
  Building,
  Floors,
  Account,
} from "@/object/index";
export default {
  name: "Tab",
  mixins: [sharemixin, blockmixin, dialogmixin, excelmixin],
  components: {
    Form: () => import("./components/Form"),
    FloorImage: () => import("./components/Floor"),
    Range: () => import("./components/Range"),
  },
  computed: {
    floorwrapper() {
      if (this.$store.state.app.device === "mobile") {
        return "floorMobile";
      } else {
        return "floornotMobile";
      }
    },
    floorImageAttrs() {
      return {
        imageSrc: this.imageSrc,
        loading: this.loading,
      };
    },
    buildingUploadAttrs() {
      return {
        files: this.buildingFiles,
        title: "buildingFiles",
        isneed: true,
      };
    },
    uploadAttrs() {
      return {
        visible: this.uploadVisible,
        title: "floorOfHouse",
        files: this.floorFiles,
      };
    },
    floorUploadAttrs() {
      return {
        specialId: this.floorImageId,
        files: this.floorFiles,
        title: "floorFiles",
        isneed: true,
      };
    },
    downBlockAttrs() {
      return {
        blockData: this.downData,
        config: this.downConfig,
        title: this.downTitle,
        isTable: this.isTable,
        buttonsName: this.downButtonsName,
        headerButtonsName: this.downheaderButtonsName,
      };
    },
    ManagementListblockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getManagementList,
        resetlistQueryParams: this.resetlistQueryParams,
      };
    },
    ContactunitListblockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getContactunitList,
        resetlistQueryParams: this.resetlistQueryParams,
      };
    },
    FloorblockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getFloorOfHouseList,
        resetlistQueryParams: this.resetdownlistQueryParams,
        searchEvent: this.getFloorOfHouseListSearch,
      };
    },
    UserblockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getUserList,
        resetlistQueryParams: this.resetdownlistQueryParams,
      };
    },
  },
  data() {
    return {
      activeName: "MC",
      activeFloor: "US",
      selectFloor: null,
      isChoose: false,
      usageOfFloorSelectList: [],
      floorofhouse: "",
      building: null,
      //Buildingupload
      buildingFiles: [],
      //FloorImage
      loading: false,
      imageSrc: "",
      //Floorupload
      floorImageId: "",
      floorFiles: [],
      //block
      downTitle: "",
      downData: [],
      downConfig: [],
      downButtonsName: [
        { name: "刪除", icon: "el-icon-delete", status: "delete" },
        { name: "編輯", icon: "el-icon-edit", status: "open" },
      ],
      downheaderButtonsName: [],
      downlistQueryParams: {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
      },
      uploadVisible: false,
    };
  },
  watch: {
    buildinginfo: {
      handler: async function () {
        this.building = this.buildinginfo;
      },
      immediate: true,
    },
    async activeFloor(val) {
      this.downData = [];
      this.downButtonsName = [
        { name: "刪除", icon: "el-icon-delete", status: "delete" },
        { name: "編輯", icon: "el-icon-edit", status: "open" },
      ];
      this.downheaderButtonsName = [
        { name: "多筆刪除", icon: "el-icon-delete", status: "deleteMany" },
        { name: "多筆更新", icon: "el-icon-edit", status: "updateMany" },
        {
          name: "新增資料",
          icon: "el-icon-circle-plus-outline",
          status: "empty",
        },
        { name: "匯出檔案", icon: "el-icon-download", status: "exportExcel" },
        { name: "匯入檔案", icon: "el-icon-upload2", status: "uploadExcel" },
      ];
      if (this.$refs.downblock !== undefined)
        this.$refs.downblock.clearSelectArray();
      if (val == "US") {
        this.downTitle = "user";
        this.downConfig = Account.getUserTableConfig();
        await this.resetdownlistQueryParams();
        this.downButtonsName = [
          { name: "編輯", icon: "el-icon-edit", status: "open" },
        ];
        this.downheaderButtonsName = [
          { name: "匯出檔案", icon: "el-icon-download", status: "exportExcel" },
          { name: "多筆更新", icon: "el-icon-edit", status: "updateMany" },
        ];
      }
      if (this.selectFloor !== null) {
        if (val == "IN") {
          this.downTitle = "floorOfHouse";
          this.downConfig = UsageOfFloor.getTableConfig();
          await this.resetdownlistQueryParams();
          this.downButtonsName = [
            { name: "刪除", icon: "el-icon-delete", status: "delete" },
            { name: "編輯", icon: "el-icon-edit", status: "open" },
            {
              name: "檔案",
              icon: "el-icon-folder-opened",
              status: "openfiles",
            },
          ];
        } else if (val == "IM") {
          this.downTitle = "floorImage";
          this.getFloorImage();
        } else if (val == "OT") {
          this.downTitle = "floorFiles";
          this.floorFiles = await this.selectFloor.files();
        }
      }
    },
    async activeName(val) {
      this.blockData = [];
      this.usageOfFloorSelectList = [];
      this.selectSetting = [];
      if (this.$refs.block !== undefined) this.$refs.block.clearSelectArray();
      if (val == "MC") {
        this.title = "committee";
        this.tableConfig = Committee.getTableConfig();
      } else if (val == "Vender") {
        this.title = "contactUnit";
        this.tableConfig = Contactunit.getTableConfig();
      } else if (val == "Professional") {
        this.title = "contactUnit";
        this.tableConfig = Contactunit.getProfessionalTableConfig();
      } else {
        //BOT
        this.title = "buildingFiles";
        this.buildingFiles = await this.building.files();
      }
      await this.resetlistQueryParams();
    },
  },
  methods: {
    async init() {
      this.title = "committee";
      this.downTitle = "user";
      this.tableConfig = Committee.getTableConfig();
      this.downConfig = Account.getUserTableConfig();
      this.downButtonsName = [
        { name: "編輯", icon: "el-icon-edit", status: "open" },
      ];
      this.downheaderButtonsName = [
        { name: "匯出檔案", icon: "el-icon-download", status: "exportExcel" },
        { name: "多筆更新", icon: "el-icon-edit", status: "updateMany" },
      ];
      await this.getManagementList();
      await this.getUserList();
    },
    async resetlistQueryParams() {
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
      };
      if (this.activeName == "MC") {
        await this.getManagementList();
      } else if (
        this.activeName == "Vender" ||
        this.activeName == "Professional"
      ) {
        await this.getContactunitList();
      }
    },
    async resetdownlistQueryParams() {
      this.downlistQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
      };
      if (this.activeFloor == "US") {
        await this.getUserList();
      } else {
        await this.getFloorOfHouseList();
      }
    },
    async getFloorImage() {
      //載入平面圖
      if (this.floorImageId == null) {
        this.imageSrc = -1;
      } else {
        this.loading = true;
        this.imageSrc = await this.selectFloor.getImage();
        this.loading = false;
      }
    },
    async getManagementList() {
      //取得管委會
      var data = await Committee.getSearchPage(this.listQueryParams);
      this.blockData = data.result;
      this.listQueryParams.total = data.totalPageCount;
    },
    async getContactunitList() {
      //取得廠商資料
      if (this.activeName == "Professional") {
        this.listQueryParams.governmentApproval = true;
      }
      var data = await Contactunit.getSearchPage(this.listQueryParams);
      this.blockData = data.result;
      this.listQueryParams.total = data.totalPageCount;
    },
    async getFloorOfHouseList() {
      //取得樓層門牌資料
      var data = await UsageOfFloor.getSearchPage(
        this.selectFloor.getID(),
        this.downlistQueryParams
      );
      this.downData = data.result;
      this.downlistQueryParams.total = data.totalPageCount;
    },
    async getFloorOfHouseListSearch() {
      //取得樓層門牌資料
      var data = await UsageOfFloor.getSearch(this.downlistQueryParams);
      this.downData = data.result;
      this.downlistQueryParams.total = data.totalPageCount;
    },
    async getUserList() {
      //取得大樓住戶資料
      this.downlistQueryParams.linkBuildings = [{ id: this.buildingid }];
      this.downlistQueryParams.usageOfFloor = "{IsNotNull}";
      var data = await Account.getUserSearchPage(this.downlistQueryParams);
      this.downData = data.result;
      this.downlistQueryParams.total = data.totalPageCount;
    },
    async handleBuildingInfo(index, content) {
      //轉接口
      console.log("handleBuildingInfo", index, content);
      if (index == "openUser") {
        await this.handleBlock("user", "updateMany", content);
      } else if (index == "open") {
        this.dialogData = [];
        this.dialogTitle = "buildingInfo";
        this.dialogConfig = Building.getUpdateConfig();
        this.dialogData.push(content);
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "update" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
        this.dialogStatus = "update";
      } else if (index == "openfloorofhouse") {
        await this.handleBlock("floorOfHouse", "open", content);
      }
    },
    async handleBuildingFloorSelect(content) {
      //選擇樓層後的操作-儲存樓層&儲存樓層平面圖ID
      this.isChoose = true;
      this.selectFloor = content;
      this.floorImageId =
        content.floorPlanID == null ? null : content.getImageID();
      if (this.activeFloor == "IN") {
        this.downTitle = "floorOfHouse";
        this.changeTable(this.isTable);
        await this.resetdownlistQueryParams();
      } else if (this.activeFloor == "IM") {
        this.downTitle = "floorImage";
        this.getFloorImage();
      } else if (this.activeFloor == "OT") {
        this.downTitle = "floorFiles";
        this.floorFiles = await this.selectFloor.files();
      }
    },
    async handleFilesUpload(index, title, content) {
      //檔案上傳操作
      console.log(index, title, JSON.stringify(content));
      var isOk = false;
      if (index === "createfile") {
        const formData = new FormData();
        content.forEach((item) => {
          formData.append("file", item.raw);
        });
        isOk =
          title === "buildingFiles"
            ? await this.building.createfiles(formData)
            : title === "floorFiles"
            ? await this.selectFloor.createfiles(formData)
            : await this.floorofhouse.createfiles(formData);
      } else if (index === "deletefile") {
        var data = { id: content.toString() };
        isOk = await Files.delete(data);
      } else {
        //設定平面圖
        this.selectFloor.setFloorPlanID(parseInt(content));
        var result = await this.selectFloor.update(this.buildingid);
        if (Object.keys(result).length !== 0) {
          isOk = true;
          this.floorImageId = content;
          // this.$store.dispatch("building/setFloors");
          this.$socket.sendMsg("floor", "update", result);
        } else {
          this.$message.error("系統錯誤");
        }
      }
      if (isOk) {
        index === "createfile"
          ? this.$message("上傳成功")
          : index === "deletefile"
          ? this.$message("刪除成功")
          : this.$message("更新成功");
        title === "buildingFiles"
          ? (this.buildingFiles = await this.building.files())
          : title === "floorFiles"
          ? (this.floorFiles = await this.selectFloor.files())
          : (this.floorFiles = await this.floorofhouse.files());
      } else {
        this.$message.error("系統錯誤");
      }
    },
    async handleBlock(title, index, content) {
      //管委會、廠商資料、樓層門牌相關操作
      console.log(title, index, JSON.stringify(content));
      var empty = [];
      var exportdata = [];
      this.dialogData = [];
      this.dialogSelect = [];
      this.dialogTitle = title;
      this.dialogConfig = [];
      this.dialogButtonsName = [];
      var constructor = null;
      switch (title) {
        case "committee":
          this.dialogConfig = Committee.getTableConfig();
          empty = Committee.empty();
          exportdata = this.blockData;
          constructor = Committee;
          break;
        case "contactUnit":
          this.dialogConfig = Contactunit.getTableConfig();
          empty = Contactunit.empty();
          exportdata = this.blockData;
          constructor = Contactunit;
          break;
        case "floorOfHouse":
          this.dialogConfig = UsageOfFloor.getTableConfig();
          empty = UsageOfFloor.empty();
          exportdata = this.downData;
          constructor = UsageOfFloor;
          break;
        case "user":
          this.dialogConfig = Account.getUserTableConfig();
          // empty = User.empty();
          exportdata = this.downData;
          constructor = User;
          break;
      }
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
          isDelete = await constructor.deleteMany(deleteArray.toString());
        }
        if (isDelete) {
          this.$message("刪除成功");
          switch (title) {
            case "committee":
            case "contactUnit":
              this.$socket.sendMsg(
                title,
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
              if (this.activeName == "MC") {
                await this.getManagementList();
              } else if (
                this.activeName == "Vender" ||
                this.activeName == "Professional"
              ) {
                await this.getContactunitList();
              }
              this.$refs.block.clearSelectArray();
              break;
            // case "floorOfHouse":
            //   this.$socket.sendMsg(
            //     "floorOfHouse",
            //     "delete",
            //     index === "delete" ? content.getID() : deleteArray.toString()
            //   );
            // case "user": //刪除user時重整建築物資料(可能會更改到所有權人&防火管理人的資料)&管委會資料(有關聯住戶)
            //   var data = await Building.getInfo();
            //   this.$store.dispatch("building/setBuildingInfo", data);
            //   this.$socket.sendMsg("building", "info", data);
            //   this.$store.dispatch("building/setHouseHolders");
            //   this.$socket.sendMsg(
            //     "houseHolder",
            //     "delete",
            //     index === "delete" ? content.getID() : deleteArray.toString()
            //   );
            // case "user":
            case "floorOfHouse":
              this.$socket.sendMsg(
                "floorOfHouse",
                "delete",
                index === "delete" ? content.getID() : deleteArray.toString()
              );
              var length = content.length !== undefined ? content.length : 1;
              var page = Math.ceil(
                (this.downlistQueryParams.total - length) /
                  this.downlistQueryParams.pageSize
              );
              if (this.downlistQueryParams.pageIndex > page) {
                this.downlistQueryParams.pageIndex = page;
              }
              if (this.activeFloor == "US") {
                await this.getUserList();
              } else {
                await this.getFloorOfHouseList();
              }
              if (this.activeName == "MC") {
                //重整管委會
                await this.getManagementList();
              }
              this.$refs.downblock.clearSelectArray();
              break;
          }
        } else {
          this.$message.error("系統錯誤");
        }
      } else if (index === "empty") {
        this.dialogData.push(empty);
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "create" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
        this.dialogStatus = "create";
      } else if (index == "openuser") {
        //打開住戶資訊
        await this.handleBuildingInfo("openUser", content);
      } else if (index === "openfiles") {
        //門牌檔案
        this.floorofhouse = content;
        this.floorFiles = await content.files();
        this.uploadVisible = true;
      } else if (index === "openfloorofhouse") {
        //管委會關聯門牌
        await this.handleBuildingInfo("openfloorofhouse", content);
      } else if (index === "exportExcel") {
        this.exportExcelData = exportdata;
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
      if (index === "cancel") {
        this.innerVisible = false;
        this.excelVisible = false;
        this.uploadVisible = false;
        if (title == "committee" || title == "contactUnit") {
          this.$refs.block.clearSelectArray();
        } else {
          this.$refs.downblock.clearSelectArray();
        }
      } else {
        switch (title) {
          case "user":
            this.onUserActions(index, content);
            break;
          case "committee":
            this.onCommitteeActions(index, content);
            break;
          case "contactUnit":
            this.onContactUnitActions(index, content);
            break;
          case "floorOfHouse":
            this.onFloorOfHouseActions(index, content);
            break;
          case "buildingInfo":
            this.onBuildingActions(index, content);
            break;
        }
      }
    },
    async onCommitteeActions(index, content) {
      var result =
        index === "update" || index === "updateManySave"
          ? await content.update()
          : index === "create"
          ? await content.create()
          : await Committee.postMany(content);
      var condition =
        index !== "uploadExcelSave"
          ? Object.keys(result).length !== 0
          : result.result.length !== 0;
      if (condition) {
        index === "update" || index === "updateManySave"
          ? this.$message("更新成功")
          : this.$message("新增成功");
        this.$store.dispatch("building/setCommittee");
        this.$socket.sendMsg(
          "committee",
          index,
          index !== "uploadExcelSave" ? result : result.result
        );
        await this.getManagementList();
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
        this.$message.error("系統錯誤");
      }
    },
    async onContactUnitActions(index, content) {
      console.log(index, content);
      var result =
        index === "update" || index === "updateManySave"
          ? await content.update()
          : index === "create"
          ? await content.create()
          : await Contactunit.postMany(content, this.activeName);
      var condition =
        index !== "uploadExcelSave"
          ? Object.keys(result).length !== 0
          : result.result.length !== 0;
      if (condition) {
        index === "update" || index === "updateManySave"
          ? this.$message("更新成功")
          : this.$message("新增成功");
        // this.$store.dispatch("building/setContactunit");
        this.$socket.sendMsg(
          "contactUnit",
          index,
          index !== "uploadExcelSave" ? result : result.result
        );
        await this.getContactunitList();
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
        if (index !== "uploadExcelSave") {
          this.$message.error("該公司名稱已存在，請重新輸入");
        }
      }
      if (index == "uploadExcelSave" && result.repeatDataList !== undefined) {
        var list = [];
        result.repeatDataList.forEach((item) => {
          list.push(item.name);
        });
        this.$message.error(
          "【" + list.toString() + "】公司名稱已存在，請重新上傳"
        );
      }
    },
    async onFloorOfHouseActions(index, content) {
      if (
        index === "update" ||
        index === "create" ||
        index === "uploadExcelSave" ||
        index === "updateManySave"
      ) {
        var result =
          index === "update" || index === "updateManySave"
            ? await content.update(
                this.selectFloor !== null ? this.selectFloor.getID() : null
              )
            : index === "create"
            ? await content.create(this.selectFloor.getID())
            : await UsageOfFloor.postMany(this.selectFloor.getID(), content);
        var condition =
          index !== "uploadExcelSave"
            ? Object.keys(result).length !== 0
            : result.result.length !== 0;
        if (condition) {
          index === "update" || index === "updateManySave"
            ? this.$message("更新成功")
            : this.$message("新增成功");
          this.$store.dispatch(
            "building/setBuildingInfo",
            await Building.getInfo()
          );
          this.$socket.sendMsg(
            "floorOfHouse",
            index,
            index !== "uploadExcelSave" ? result : result.result
          );
          if (index !== "updateManySave") {
            this.innerVisible = false;
          } else {
            this.dialogData.forEach((item, index) => {
              if (item.id == content.id) {
                this.dialogData.splice(index, 1, content);
              }
            });
          }
          if (this.selectFloor !== null && this.activeFloor == "IN") {
            await this.getFloorOfHouseList();
          }
          if (this.activeName == "MC" && index === "update") {
            //重整管委會
            await this.getManagementList();
          }
        } else {
          if (index !== "uploadExcelSave") {
            this.$message.error("戶號已存在，請重新輸入");
          }
        }
        if (index == "uploadExcelSave" && result.repeatDataList !== undefined) {
          var list = [];
          result.repeatDataList.forEach((item) => {
            list.push(item.houseNumber);
          });
          this.$message.error(
            "【" + list.toString() + "】戶號已存在，請重新上傳"
          );
        }
      } else if (index === "createfile") {
        await this.handleFilesUpload("createfile", "floorOfHouse", content);
      } else if (index == "deletefile") {
        await this.handleFilesUpload("deletefile", "floorOfHouse", content);
      }
    },
    async onUserActions(index, content) {
      //只剩下更新&多筆更新&匯出檔案的功能
      if (index == "create" || index == "update" || index == "updateManySave") {
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
          var result =
            index === "update" || index == "updateManySave"
              ? await content.updateP()
              : await content.create();
          if (Object.keys(result).length !== 0) {
            this.$socket.sendMsg("account", index, result);
            if (index === "update" || index == "updateManySave") {
              this.$message("更新成功");
              this.$store.dispatch("building/setCommittee");
              var data = await Building.getInfo();
              //this.$store.dispatch("building/setBuildingInfo", data);
              this.$socket.sendMsg("building", "info", data);
              if (this.activeName == "MC") {
                //重整管委會
                await this.getManagementList();
              }
              if (this.activeFloor == "US") {
                await this.getUserList();
              } else if (this.activeFloor == "IN") {
                await this.getFloorOfHouseList();
              }
            } else {
              this.$message("新增成功");
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
          } else {
            this.$message.error("該姓名已存在，請重新輸入");
          }
        } else {
          this.$message.error("該身份證已存在，請重新輸入");
        }
      }
      // else if (index === "uploadExcelSave") {
      //   var result = await User.postMany(content);
      //   if (result.result.length !== 0) {
      //     this.$message("新增成功");
      //     this.$store.dispatch("building/setHouseHolders");
      //     this.$socket.sendMsg("houseHolder", index, result.result);
      //     await this.getUserList();
      //     this.excelVisible = false;
      //   }
      //   if (result.repeatDataList !== undefined) {
      //     var list = [];
      //     result.repeatDataList.forEach((item) => {
      //       list.push(item.name);
      //     });
      //     this.$message.error(
      //       "【" + list.toString() + "】姓名已存在，請重新上傳"
      //     );
      //   }
      // }
    },
    async onBuildingActions(index, content) {
      if (index == "update") {
        var result = await content.update();
        if (Object.keys(result).length !== 0) {
          this.$message("更新成功");
          this.$socket.sendMsg("building", "info", result);
          // if (this.buildingid == content.getID()) {
          //   this.$store.dispatch(
          //     "building/setBuildingInfo",
          //     await Building.getInfo()
          //   );
          // }
          this.innerVisible = false;
        } else {
          this.$message.error("系統錯誤");
        }
      }
      // else if(index == 'selectData'){
      //   this.$store.dispatch('building/setbuildingusers',await User.get())
      // }
      else {
        this.innerVisible = false;
      }
    },
    async changeTable(value) {
      this.isTable = value;
      //內部轉頁面
      if (
        this.$route.params.target !== undefined &&
        this.$route.params.target !== ""
      ) {
        if (
          typeof this.$route.params.target == "object" &&
          this.$route.params.type == "user"
        ) {
          await this.handleBuildingInfo("openUser", this.$route.params.target);
        } else if (
          typeof this.$route.params.target == "object" &&
          this.$route.params.type == "contactunit"
        ) {
          this.activeName = "Vender";
          this.title = "contactUnit";
          this.tableConfig = Contactunit.getTableConfig();
          await this.resetlistQueryParams();
          this.$nextTick(async () => {
            await this.handleBlock(
              "contactUnit",
              "updateMany",
              this.$route.params.target
            );
          });
        } else if (
          typeof this.$route.params.target == "object" &&
          this.$route.params.type == "committee"
        ) {
          this.$nextTick(async () => {
            await this.handleBlock(
              "committee",
              "updateMany",
              this.$route.params.target
            );
          });
        }
      } else if (
        this.$route.query.type !== undefined &&
        this.$route.query.type !== ""
      ) {
        //外部轉頁面
        if (this.$route.query.type == "user") {
          await this.handleBlock(this.$route.query.type, "empty", "");
        } else if (this.$route.query.type == "contactunit") {
          this.activeName = "Vender";
          this.title = "contactUnit";
          this.tableConfig = Contactunit.getTableConfig();
          await this.resetlistQueryParams();
          this.$nextTick(async () => {
            await this.handleBlock("contactUnit", "empty", "");
          });
        } else if (this.$route.query.type == "committee") {
          this.$nextTick(async () => {
            await this.handleBlock("committee", "empty", "");
          });
        } else {
          this.$message.error("請先選擇樓層再進行門牌新增");
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.block-wrapper {
  background: #fff;
  padding: 15px 15px;
  margin-bottom: 20px;
  height: 780px !important;
}

// .floornotMobile {
//   background: #fff;
//   padding: 10px;
//   margin-bottom: 32px;
//   height: 720px;
//   overflow-x: hidden;
//   overflow-y: auto;
// }

.floorMobile {
  background: #fff;
  padding: 0px 16px 15px;
  margin-bottom: 32px;
  height: 100px;
  p {
    padding-top: 10px;
  }
}

.files {
  max-height: 200px;
  overflow: auto;
  .filesdiv {
    line-height: 40px;
    .del {
      cursor: pointer;
    }
    .el-link {
      display: inline;
    }
  }
}
</style>
