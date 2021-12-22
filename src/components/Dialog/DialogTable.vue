<template>
  <div>
    <el-dialog
      class="dialogtable"
      top="5vh"
      :width="dialogWidth"
      :title="textMap[title]"
      :visible="visible"
      :close-on-click-modal="false"
      append-to-body
      @close="handleTableClick('cancel', '')"
      center
    >
      <keep-alive>
        <el-row>
          <el-tabs
            v-if="title == 'deviceaddress'"
            v-model="activeName"
            type="card"
            @tab-click="tabChange"
          >
            <el-tab-pane label="火警總機" name="fire"></el-tab-pane>
            <el-tab-pane label="PLC" name="plc"></el-tab-pane>
          </el-tabs>
          <el-table
            :key="Math.random()"
            :data="tableData"
            border
            highlight-current-row
            style="width: 100%"
            empty-text="暫無資料"
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
            :height="600"
          >
            <el-table-column reserve-selection type="selection" width="40">
            </el-table-column>

            <el-table-column fixed type="index"> </el-table-column>

            <el-table-column
              v-for="(item, index) in tableconfigs"
              align="left"
              :label="item.label"
              :key="index"
              :prop="item.prop"
              :column-key="item.prop"
              sortable="custom"
              header-align="center"
            >
              <template slot-scope="scope">
                <div
                  v-if="scope.column.property == 'lackContent'"
                  v-html="stringToBr(scope.row[scope.column.property])"
                ></div>

                <span v-else-if="item.formType == 'date'" style="width: 150px">
                  {{ dataStr(scope.row[item.prop], "YYYY-MM-DD") }}
                </span>

                <span v-else-if="item.formType == 'selectSetting'">
                  {{ changeOptionName(scope.row[item.prop]) }}
                </span>

                <!-- <span
                  v-else-if="
                    item.formType == 'select' || item.formType == 'singleChoice'
                  "
                >
                  {{ changeShowFormat(item.format, scope.row, item.prop) }}
                </span> -->

                <span
                  v-else-if="
                    item.formType == 'select' || item.formType == 'singleChoice'
                  "
                  @click="
                    clickMessageBox(
                      item.label,
                      item.format,
                      scope.row[item.prop]
                    )
                  "
                  style="color: #66b1ff; cursor: pointer"
                >
                  {{ changeShowFormat(item.format, scope.row, item.prop) }}
                </span>

                <span
                  v-else-if="
                    item.formType == 'selectString' ||
                    item.formType == 'addressStr'
                  "
                >
                  {{
                    changeShowFormatString(item.format, scope.row, item.prop)
                  }}
                </span>

                <span v-else-if="item.formType == 'boolean'">
                  {{ scope.row[item.prop] | changeBoolean(item.format) }}
                </span>

                <span v-else-if="item.formType == 'image'">
                  <i
                    v-if="
                      scope.row[scope.column.property] !== null &&
                      scope.row[scope.column.property] !== ''
                    "
                    class="el-icon-picture-outline"
                    @click="handleTableClick('image', scope.row)"
                    style="cursor: pointer; font-size: 25px"
                  ></i>
                </span>

                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作">
              <template v-if="isHasHeaderButtons" slot="header">
                <span v-for="(button, index) in headerButtonsName" :key="index">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="button.name"
                    placement="top"
                  >
                    <i
                      :class="button.icon"
                      @click="handleTableClick(button.status, '')"
                      style="cursor: pointer; font-size: 25px; float: right"
                    ></i>
                  </el-tooltip>
                </span>
              </template>
              <template slot-scope="scope">
                <span v-for="(button, index) in buttonsName" :key="index">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="button.name"
                    placement="top"
                  >
                    <i
                      :class="button.icon"
                      @click="handleTableClick(button.status, scope.row)"
                      style="cursor: pointer; font-size: 25px; float: right"
                    ></i>
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="hasPagination" class="pagination-container">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="page"
              :page-sizes="[10, 30, 50, 100]"
              :page-size="limit"
              :total="total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
          </div>
        </el-row>
      </keep-alive>
    </el-dialog>
  </div>
</template>

<script>
import computedmixin from "@/mixin/computedmixin";

export default {
  name: "DialogTable",
  mixins: [computedmixin],
  props: {
    title: {
      type: String,
    },
    searchType: {
      type: String,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    headerButtonsName: {
      type: Array,
      default: function () {
        return [
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
      },
    },
    buttonsName: {
      type: Array,
      default: function () {
        return [
          { name: "刪除", icon: "el-icon-delete", status: "delete" },
          { name: "編輯", icon: "el-icon-edit", status: "open" },
        ];
      },
    },
    isHasHeaderButtons: {
      type: Boolean,
      default: true,
    },
    tableData: {
      type: Array,
    },
    config: {
      type: Array,
      required: true,
    },
    tablelistQueryParams: {
      type: Object,
    },
    hasPagination: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    dialogWidth() {
      if (this.$store.state.app.device === "mobile") {
        return "90%";
      } else {
        if (this.title == "floor" || this.title == "contingencyProcess") {
          return "700px";
        }
        return "1400px";
      }
    },
    page: function () {
      return this.tablelistQueryParams.pageIndex || 1;
    },
    limit: function () {
      return this.tablelistQueryParams.pageSize || 10;
    },
    total: function () {
      return this.tablelistQueryParams.total || 0;
    },
  },
  watch: {
    searchType: {
      handler: function (newValue, oldValue) {
        if (this.activeName !== this.searchType) {
          this.activeName = this.searchType;
        }
      },
      immediate: true,
    },
    config: {
      handler: async function () {
        this.tableconfigs = this.config.filter(
          (item, index) => item.isHidden == false
        );
      },
      immediate: true,
    },
  },

  data() {
    return {
      textMap: {
        //缺失 點位 維保 樓層
        devicemaintain: "維護保養紀錄",
        deviceaddress: "設備關聯點位",
        inspectionlack: "檢修申報缺失項目",
        publicsafelack: "公安申報缺失項目",
        listOfMaintain: "維護保養細項",
        floor: "樓層",
        listOfMgmt: "班別",
        contingencyProcess: "流程圖",
      },
      activeName: "fire",
      //更新多筆&刪除多筆使用
      selectArray: [],
      tableconfigs: [],
    };
  },
  methods: {
    handleTableClick(index, row) {
      if (index === "delete") {
        this.$confirm("是否確定刪除該筆資料?", "提示", {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        })
          .then(() => {
            this.$emit("handleTableClick", index, row);
          })
          .catch(() => {});
      } else if (index === "deleteMany") {
        if (this.selectArray.length == 0) {
          this.$message.error("請勾選要刪除的資料列");
        } else {
          this.$confirm("是否確定刪除所勾選的資料?", "提示", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning",
            center: true,
          })
            .then(() => {
              console.log(this.selectArray);
              this.$emit("handleTableClick", index, this.selectArray);
            })
            .catch(() => {});
        }
      } else if (index === "updateMany") {
        if (this.selectArray.length == 0) {
          this.$message.error("請勾選要更新的資料列");
        } else {
          this.$emit("handleTableClick", index, this.selectArray);
        }
      } else {
        if (this.title == "contingencyProcess" && index == "update") {
          this.$emit("handleTableClick", index, this.tableData);
        } else {
          this.$emit("handleTableClick", index, row);
        }
      }
    },
    // 改變翻頁組件中每頁數據總數
    handleSizeChange(val) {
      this.tablelistQueryParams.pageSize = val;
      this.tablelistQueryParams.pageIndex = 1; // 改變翻頁數目，將頁面=1
      this.$emit(
        "clickPagination",
        "clickPagination",
        this.tablelistQueryParams
      );
    },
    // 跳到當前是第幾頁
    handleCurrentChange(val) {
      this.tablelistQueryParams.pageIndex = val;
      this.$emit(
        "clickPagination",
        "clickPagination",
        this.tablelistQueryParams
      );
    },
    handleSelectionChange(val) {
      this.selectArray = val;
    },
    clearSelectArray() {
      this.selectArray = [];
      this.$refs.tableData.clearSelection();
    },
    tabChange() {
      //設備查看點位那邊才會用到
      this.$emit("searchChange", this.activeName);
    },
  },
};
</script>

<style scoped>
@media (max-width: 1024px) {
  .dialogtable {
    width: 80%;
    margin: auto;
  }
}
</style>
