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
    </el-row>
    <el-row :gutter="32" id="parent" style="margin-top: 20px">
      <el-col :xs="24" :sm="24" :md="24" :lg="6">
        <div :class="floorwrapper" id="rangeDiv">
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
      :isP="activeName == 'Professional'"
    ></DialogExcel>

    <el-dialog
      :title="dialogVisibletTitle"
      :width="dialogVisibletWidth"
      :visible.sync="dialogFormVisible"
      center
      :close-on-click-modal="false"
      @close="handleDistributed('cancel', '')"
    >
      <template v-if="dialogFormType == 'cert'">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="門牌" prop="usageOfFloor">
            <el-select
              v-model="ruleForm.usageOfFloor"
              filterable
              placeholder="請選擇"
              style="width: 100%"
            >
              <el-option
                v-for="(obj, index) in houseList"
                :key="index"
                :label="obj.label"
                :value="obj.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >確認</el-button
          >
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </div>
      </template>
      <template v-else>
        <el-tabs v-model="distributedName" @tab-click="handleDistributedTab">
          <el-tab-pane label="以人為分佈" name="PE"></el-tab-pane>
          <el-tab-pane label="以戶為分佈" name="USAG"></el-tab-pane>
        </el-tabs>
        <div style="float: right">
          <el-button size="mini" @click="handleDistributed('exportExcel', '')"
            >匯出檔案</el-button
          >
          <el-button
            v-if="!hasDistributedButton"
            size="mini"
            @click="handleDistributed('return', '')"
            >返回上一層</el-button
          >
        </div>
        <el-table
          :data="distributedData"
          style="width: 100%"
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{ 'text-align': 'center' }"
          :show-summary="hasDistributedButton ? true : false"
          :summary-method="getSummaries()"
          sum-text="總人數"
        >
          <el-table-column fixed type="index" width="150"> </el-table-column>
          <el-table-column
            v-for="(item, index) in distributedConfig"
            align="left"
            :label="item.label"
            :key="index"
            :prop="item.prop"
            header-align="center"
            :column-key="item.prop"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span v-if="item.formType == 'date'" style="width: 150px">
                {{ dataStr(scope.row, item.format, item.prop) }}
              </span>
              <span v-else-if="item.formType == 'boolean'">
                <template
                  v-if="
                    item.format == 'improvedBoolean' &&
                    scope.row['declareResult']
                  "
                >
                  -
                </template>
                <template v-else>
                  {{ scope.row[item.prop] | changeBoolean(item.format) }}
                </template>
              </span>
              <span v-else-if="item.formType == 'selectString'">
                {{ changeShowFormatString(item.format, scope.row, item.prop) }}
              </span>

              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="hasDistributedButton" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleDistributed('view', scope.row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  blockmixin,
  dialogmixin,
  sharemixin,
  excelmixin,
  computedmixin,
} from "@/mixin/index";
import {
  Files,
  Committee,
  UsageOfFloor,
  User,
  Contactunit,
  Building,
  Account,
} from "@/object/index";
export default {
  name: "Tab",
  mixins: [sharemixin, blockmixin, dialogmixin, excelmixin, computedmixin],
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
      distributedName: "PE",
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
      account: null,
      dialogFormVisible: false,
      dialogFormType: "",
      distributedConfig: [
        {
          label: "種類",
          prop: "type",
        },
        {
          label: "範圍",
          prop: "range",
        },
        {
          label: "人數",
          prop: "peopleCount",
        },
      ],
      distributedData: [],
      ruleForm: { usageOfFloor: null },
      rules: {
        usageOfFloor: [
          { required: true, message: "請選擇門牌", trigger: "change" },
        ],
      },
      distributedAllList: null,
      hasDistributedButton: true,
      dialogVisibletTitle: "",
      dialogVisibletWidth: "",
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
          { name: "驗證住戶", icon: "el-icon-circle-check", status: "verify" },
        ];
        this.downheaderButtonsName = [
          { name: "匯出檔案", icon: "el-icon-download", status: "exportExcel" },
          { name: "多筆更新", icon: "el-icon-edit", status: "updateMany" },
          {
            name: "多筆驗證",
            icon: "el-icon-circle-check",
            status: "multipleVerify",
          },
          {
            name: "人員屬性分布",
            icon: "el-icon-pie-chart",
            status: "distributed",
          },
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
        { name: "驗證住戶", icon: "el-icon-circle-check", status: "verify" },
      ];
      this.downheaderButtonsName = [
        { name: "匯出檔案", icon: "el-icon-download", status: "exportExcel" },
        { name: "多筆更新", icon: "el-icon-edit", status: "updateMany" },
        {
          name: "多筆驗證",
          icon: "el-icon-circle-check",
          status: "multipleVerify",
        },
        {
          name: "人員屬性分布",
          icon: "el-icon-pie-chart",
          status: "distributed",
        },
      ];
      await this.getManagementList();
      await this.getUserList();
      this.$nextTick(() => {
        document.getElementById("rangeDiv").style.height =
          document.getElementById("parent").clientHeight + "px";
      });
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
      var data = await Account.getSearchPage(
        "/basic/accountSetting",
        this.downlistQueryParams
      );
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
          exportdata = this.downData;
          constructor = User;
          if (index === "open" || index === "empty" || index === "updateMany") {
            this.dialogConfig[2].label = "生日";
          }
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
        if (title === "user") {
          this.account = content;
        }
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
      } else if (index === "verify") {
        if (
          content.usageOfFloor !== undefined &&
          content.usageOfFloor !== null &&
          content.usageOfFloor !== ""
        ) {
          //已有設定過門牌可直接進行升級的動作
          var result = await Account.upgrade(
            "/basic/accountSetting",
            content.id
          );
          if (result.result.length !== 0) {
            this.$message("認證成功，若要取消認證，請洽水星服務人員");
            result.result.forEach((item) => {
              this.$socket.sendMsg("account", "update", item);
            });
            await this.getUserList();
          } else {
            this.$message.error("認證失敗，請洽水星服務人員");
          }
        } else {
          //跳出可以選擇門牌的視窗
          this.account = content;
          this.dialogVisibletTitle = "住戶認證";
          this.dialogVisibletWidth = "50%";
          this.dialogFormType = "cert";
          this.dialogFormVisible = true;
        }
      } else if (index === "multipleVerify") {
        var accountArray = [];
        content.forEach((item) => {
          accountArray.push(item.id);
        });
        var result = await Account.upgrade(
          "/basic/accountSetting",
          accountArray.toString()
        );
        if (result.result.length !== 0) {
          this.$message("認證成功，若要取消認證，請洽水星服務人員");
          result.result.forEach((item) => {
            this.$socket.sendMsg("account", "update", item);
          });
          await this.getUserList();
          this.$refs.downblock.clearSelectArray();
        } else {
          this.$message.error("認證失敗，請洽水星服務人員");
        }
      } else if (index === "distributed") {
        this.dialogFormType = "dist";
        this.dialogVisibletTitle = "住戶分布狀況";
        this.dialogVisibletWidth = "80%";
        this.dialogFormVisible = true;
        var result = await Account.getDistributed("PE", 1);
        this.distributedData = result;
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
          case "photo":
            await this.onUserActions(index, content);
            break;
          case "committee":
            await this.onCommitteeActions(index, content);
            break;
          case "contactUnit":
            await this.onContactUnitActions(index, content);
            break;
          case "floorOfHouse":
            await this.onFloorOfHouseActions(index, content);
            break;
          case "buildingInfo":
            await this.onBuildingActions(index, content);
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
          // this.$store.dispatch(
          //   "building/setBuildingInfo",
          //   await Building.getInfo()
          // );
          this.$socket.sendMsg(
            "floorOfHouse",
            index,
            index !== "uploadExcelSave" ? result : result.result
          );
          if (this.selectFloor !== null && this.activeFloor == "IN") {
            await this.getFloorOfHouseList();
          }
          if (index === "update" || index == "updateManySave") {
            if (this.activeName == "MC" && index === "update") {
              //重整管委會
              await this.getManagementList();
            }
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
        var data = await Account.getSearchPage("/basic/accountSetting", {
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
              ? await content.update("/basic/accountSetting")
              : await content.create();
          if (Object.keys(result).length !== 0) {
            this.$socket.sendMsg("account", index, result);
            if (index === "update" || index == "updateManySave") {
              this.$message("更新成功");
              this.$store.dispatch("building/setCommittee");
              var data = await Building.getInfo();
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
      } else if (index === "photo") {
        const formData = new FormData();
        content.forEach((item) => {
          formData.append("file", item.raw);
        });
        var result = await Account.postPhoto(
          this.account.getID(),
          formData,
          "/basic/accountSetting"
        );
        if (result !== null) {
          this.$message("上傳成功");
          this.dialogData[0]["headShotFileId"] = result;
        } else {
          this.$message.error("上傳失敗");
        }
      } else if (index === "removePhoto") {
        var temp = { id: content, headShotFileId: "" };
        var result = await Account.updateData("/basic/accountSetting", temp);
        if (result) {
          this.$message("刪除成功");
          this.dialogData[0]["headShotFileId"] = "";
        } else {
          this.$message.error("刪除失敗");
        }
      }
    },
    async onBuildingActions(index, content) {
      if (index == "update") {
        var result = await content.update();
        if (Object.keys(result).length !== 0) {
          this.$message("更新成功");
          this.$socket.sendMsg("building", "info", result);
          this.innerVisible = false;
        } else {
          this.$message.error("系統錯誤");
        }
      } else {
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
          console.log(this.$route.params.target);
          this.$nextTick(async () => {
            await this.handleBlock(
              "committee",
              "updateMany",
              this.$route.params.target
            );
          });
        } else if (
          typeof this.$route.params.target == "object" &&
          this.$route.params.type == "floorOfHouse"
        ) {
          this.$message.error("錯誤");
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
    async handleDistributedTab(reset = true) {
      if (this.distributedName === "PE") {
        var result = await Account.getDistributed("PE", 1);
        this.distributedData = result;
        this.distributedConfig = [
          {
            label: "種類",
            prop: "type",
          },
          {
            label: "範圍",
            prop: "range",
          },
          {
            label: "人數",
            prop: "peopleCount",
          },
        ];
      } else {
        var result = await Account.getDistributed("USAG", 1);
        // result = result.sort((a,b)=>{
        //   let reg = /[a-zA-Z0-9]/
        //   let x = a.houseNumber
        //   let y = b.houseNumber
        //   if(reg.test(x) || reg.test(y)){
        //     if(x>y){
        //       return 1
        //     }else if(x<y){
        //       return -1
        //     }else{
        //       return 0
        //     }
        //   }else{
        //     return x.localeCompare(y)
        //   }
        // });
        this.distributedData = result.sort((x, y) => {
          x.houseNumberId - y.houseNumberId;
        });
        this.distributedConfig = [
          {
            label: "戶號",
            prop: "houseNumber",
          },
          {
            label: "居住人數",
            prop: "livePeople",
          },
          {
            label: "避難弱者",
            prop: "refugeTheWeak",
          },
        ];
      }
      this.hasDistributedButton = true;
      if (reset) {
        this.distributedAllList = null;
      }
    },
    async handleDistributed(index, content) {
      if (index === "cancel") {
        this.dialogFormVisible = false;
        this.distributedAllList = null;
        this.distributedData = [];
        this.distributedName = "PE";
        this.distributedConfig = [
          {
            label: "種類",
            prop: "type",
          },
          {
            label: "範圍",
            prop: "range",
          },
          {
            label: "人數",
            prop: "peopleCount",
          },
        ];
      } else if (index === "exportExcel") {
        this.dialogConfig = Account.getUserDistributedTableConfig();
        if (!this.hasDistributedButton) {
          this.exportExcelData = this.distributedData;
        } else {
          // 匯出全部資料
          var list = await Account.getDistributed(this.distributedName, 2);
          var exportArray = [];
          if (this.distributedName == "PE") {
            this.dialogConfig.splice(0, 0, {
              label: "種類",
              prop: "type",
              isExport: true,
            });
            exportArray.push({ type: "小孩" });
            exportArray = exportArray.concat(list.linkChild);
            exportArray.push({ type: "老人" });
            exportArray = exportArray.concat(list.linkElder);
            exportArray.push({ type: "行動不便者" });
            exportArray = exportArray.concat(list.linkMoveWithDifficulty);
            exportArray.push({ type: "其他" });
            exportArray = exportArray.concat(list.linkOtherUsers);
            this.exportExcelData = exportArray;
          } else {
            this.dialogConfig.splice(7, 1);
            this.dialogConfig.splice(0, 0, {
              label: "避難弱者",
              prop: "refugeTheWeak",
              isExport: true,
            });
            this.dialogConfig.splice(0, 0, {
              label: "居住人數",
              prop: "livePeople",
              isExport: true,
            });
            this.dialogConfig.splice(0, 0, {
              label: "戶號",
              prop: "houseNumber",
              isExport: true,
            });
            list.forEach((item) => {
              var firstData = {
                houseNumber: item.houseNumber,
                livePeople: item.livePeople,
                refugeTheWeak: item.refugeTheWeak,
              };
              if (
                item.linkReportAgeDistributionInUsageOfFloorList.length == 0
              ) {
                exportArray.push(firstData);
              } else {
                item.linkReportAgeDistributionInUsageOfFloorList.forEach(
                  (peo, index) => {
                    if (index === 0) {
                      var o = Object.assign(firstData, peo);
                      exportArray.push(o);
                    } else {
                      exportArray.push(peo);
                    }
                  }
                );
              }
            });
            this.exportExcelData = exportArray;
          }
        }

        this.excelVisible = true;
        this.excelType = "exportExcel";
      } else if (index === "return") {
        await this.handleDistributedTab(false);
      } else {
        //查看細項
        this.hasDistributedButton = false; //關閉操作欄位
        if (this.distributedAllList == null) {
          this.distributedAllList = await Account.getDistributed(
            this.distributedName,
            2
          );
        }
        this.distributedConfig = Account.getUserDistributedTableConfig();
        if (this.distributedName === "PE") {
          switch (content.type) {
            case "小孩":
              this.distributedData = this.distributedAllList.linkChild;
              break;
            case "老人":
              this.distributedData = this.distributedAllList.linkElder;
              break;
            case "行動不便者":
              this.distributedData =
                this.distributedAllList.linkMoveWithDifficulty;
              break;
            case "其他":
              this.distributedData = this.distributedAllList.linkOtherUsers;
              break;
          }
        } else {
          this.distributedData = this.distributedAllList.filter((item) => {
            return item.houseNumberId == content.houseNumberId;
          })[0].linkReportAgeDistributionInUsageOfFloorList;
        }
      }
    },
    getSummaries(param) {
      if (param == undefined) {
        return false;
      }
      console.log(param);
      const { columns, data } = param;
      const len = columns.length;
      // const count = this.distributedName == 'PE' ? len -2 :
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "總和";
          return;
        } else if (index == len - 2) {
          //顯示人數總和
          const values = data.map((item) => Number(item[column.property]));
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += " 人";
          } else {
            sums[index] = "N/A";
          }
        }
      });

      return sums;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          var temp = {
            id: this.account.getID(),
            usageOfFloor: this.ruleForm.usageOfFloor,
          };
          var isOk = await Account.updateData("/basic/accountSetting", temp);
          if (isOk) {
            var result = await Account.upgrade(
              "/basic/accountSetting",
              this.account.getID()
            );
            if (result.result.length !== 0) {
              this.$message("認證成功，若要取消認證，請洽水星服務人員");
              result.result.forEach((item) => {
                this.$socket.sendMsg("account", "update", item);
              });
              await this.getUserList();
              this.dialogFormVisible = false;
            } else {
              this.$message.error("認證失敗，請洽水星服務人員");
            }
          } else {
            this.$message.error("認證失敗，請洽水星服務人員");
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.block-wrapper {
  background: #fff;
  padding: 15px 15px;

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
