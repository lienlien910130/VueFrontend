<template>
  <div>
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24">
        <el-select
          v-if="
            title == 'deviceAddressManagement' ||
            title == 'devicePLCAddressManagement'
          "
          v-model="deviceIdSelect"
          filterable
          placeholder="請選擇設備"
          style="width: 500px; margin-bottom: 10px"
          value-key="id"
          @change="searchDevice"
        >
          <el-option
            v-for="(item, index) in deviceSelectArray"
            :key="index"
            :label="item.label"
            :value="item"
          >
          </el-option>
        </el-select>
        <template v-if="title == 'maintainList'">
          <el-button type="primary" @click="change"> 檢視及搜尋細項 </el-button>
          <el-button type="primary" @click="handleClickOption('empty', '')">
            新增
          </el-button>
        </template>
      </el-col>
    </el-row>
    <el-row v-if="hasSearch == true">
      <div style="margin-bottom: 50px">
        <template>
          <el-col :xs="24" :sm="24" :md="24" :lg="18">
            <div style="height: 105px; overflow-x: auto; overflow-y: auto">
              <el-form
                :inline="true"
                :model="searchForm"
                class="demo-form-inline"
                size="mini"
              >
                <el-form-item
                  v-for="(item, index) in canotSearch"
                  :key="index"
                  :label="item.label"
                >
                  <el-select
                    v-if="
                      item.formType !== 'date' && item.formType !== 'fullType'
                    "
                    v-model="searchForm.preset[index].searchValue"
                    :placeholder="item.placeholder"
                    clearable
                    multiple
                    :multiple-limit="item.formType == 'boolean' ? 1 : 0"
                    collapse-tags
                    filterable
                  >
                    <template
                      v-if="
                        item.formType == 'boolean' ||
                        item.formType == 'checkbox'
                      "
                    >
                      <el-option
                        v-for="(val, index) in [true, false]"
                        :key="index"
                        :value="val"
                        :label="val | changeBoolean(item.format)"
                      ></el-option>
                    </template>
                    <!-- <template v-else>
                      <el-option
                        v-for="(obj, index) in dataList"
                        :key="index"
                        :label="obj.label"
                        :value="obj.id"
                      >
                      </el-option>
                    </template> -->

                    <template
                      v-else-if="
                        item.formType == 'select' ||
                        item.formType == 'singleChoice' ||
                        item.formType == 'selectString'
                      "
                    >
                      <el-option
                        v-for="(obj, index) in selectfilter(
                          item.format == 'commitUserInfo'
                            ? 'userInfo'
                            : item.format
                        )"
                        :key="index"
                        :label="obj.label"
                        :value="obj.id"
                      >
                      </el-option>
                    </template>
                    <template v-else-if="item.formType == 'selectSetting'">
                      <el-option
                        v-for="(obj, index) in optionfilter(item.format)"
                        :key="index"
                        :label="obj.textName"
                        :value="obj.id"
                      >
                      </el-option>
                    </template>
                  </el-select>
                  <el-date-picker
                    v-else-if="item.formType == 'date'"
                    v-model="searchForm.preset[index].searchValue"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="開始日期"
                    end-placeholder="結束日期"
                  >
                  </el-date-picker>
                  <el-cascader
                    v-else
                    v-model="searchForm.preset[index].searchValue"
                    placeholder="請選擇"
                    :options="selectfilter('fullType')"
                    filterable
                    clearable
                  >
                  </el-cascader>
                </el-form-item>
                <br />
                <el-form-item
                  v-for="(condition, index) in searchForm.conditions"
                  :label="'條件' + (index + 1)"
                  :key="index"
                  :prop="'conditions.' + index + '.value'"
                >
                  <el-select
                    v-model="condition.prop"
                    clearable
                    @change="(val) => setConditionType(val, index)"
                  >
                    <el-option
                      v-for="(item, index) in inputSelectChange"
                      :key="index"
                      :label="item.label"
                      :value="item.prop"
                    >
                    </el-option>
                  </el-select>
                  <el-input
                    v-if="condition.type == 'input'"
                    v-model="condition.searchValue"
                    style="width: 35%"
                  ></el-input>
                  <el-date-picker
                    v-else
                    v-model="condition.searchValue"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="開始日期"
                    end-placeholder="結束日期"
                  >
                  </el-date-picker>
                  <el-button @click.prevent="removeCondition(condition)"
                    >删除</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="6">
            <el-button type="primary" @click="addCondition" size="mini"
              >新增條件</el-button
            >
            <el-button type="primary" @click="onSearch" size="mini"
              >查詢</el-button
            >
            <el-button @click="resetCondition(true)" size="mini"
              >清空</el-button
            >
            <el-button
              v-if="title == 'maintain'"
              type="primary"
              @click="change"
              size="mini"
              >檢視大項</el-button
            >
          </el-col>
        </template>
        <!-- <el-input
            v-if="hasSearch == true"
            placeholder="請輸入內容，多條件搜尋請依左側'勾選條件'依序輸入值並以'逗號'區隔"
            v-model="inputSearch"
            class="input-with-select"
            style="width: 42%; float: right"
            clearable
            @clear="clearInputSearch"
            @keyup.enter.native="handleSearchWord"
          >
            <el-select
              v-model="inputSelect"
              filterable
              multiple
              slot="prepend"
              value-key="id"
              placeholder="請選擇欄位"
              style="width: 170px"
              collapse-tags
              clearable
            >
              <el-option
                v-for="(item, index) in inputSelectChange"
                :key="index"
                :label="item.label"
                :value="item.prop"
              >
              </el-option>
            </el-select>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleSearchWord"
            ></el-button>
          </el-input> -->

        <!-- <el-button
            v-if="title == 'maintain' || title == 'maintainList'"
            class="filter-item"
            type="primary"
            @click="change"
          >
            <span> 檢視大項 </span>
          </el-button> -->
      </div>
    </el-row>
    <el-row :gutter="gutter">
      <div
        class="infinite-list-wrapper"
        :style="{ height: infiniteheight + 'px' }"
      >
        <div v-if="isTable == false">
          <div v-for="(item, index) in table" :key="index">
            <el-col :xs="24" :sm="12" :md="6" :lg="6">
              <div class="dashboard-wrapper" :style="FirstheightChange">
                <div class="wrapper" :style="heightChange">
                  <div
                    v-for="(option, index) in rowlabel"
                    :key="index"
                    width="100%"
                  >
                    <div
                      :style="{
                        display: 'inline-block',
                        'vertical-align': 'top',
                        'padding-top': '5px',
                        width: labelstyle,
                      }"
                    >
                      <span>{{ option.label }} :</span>
                    </div>
                    <div
                      :style="{
                        display: 'inline-block',
                        'word-break': 'break-all',
                        'padding-top': '5px',
                        width: itemstyle,
                      }"
                    >
                      <span
                        v-if="
                          (option.format == 'YYYY') |
                            (option.format === 'YYYY-MM-DD')
                        "
                      >
                        {{ dataStr(item[option.prop], option.format) }}
                      </span>

                      <span v-else-if="option.format == 'range'">
                        {{ dataStr(item["checkStartDate"], "YYYY-MM-DD") }}
                        <span v-if="item['checkStartDate'] !== null">~</span>
                        {{ dataStr(item["checkEndDate"], "YYYY-MM-DD") }}
                      </span>

                      <span v-else-if="option.format == 'fullType'">
                        {{ item.getType() }}
                      </span>

                      <span
                        v-else-if="
                          option.format == 'userInfo' ||
                          option.format == 'usageOfFloorUserInfo' ||
                          option.format == 'commitUserInfo'
                        "
                        @click="
                          clickMessageBox(
                            '住戶資料',
                            option.format,
                            item[option.prop]
                          )
                        "
                        style="color: #66b1ff; cursor: pointer"
                      >
                        {{ changeUserName(item[option.prop]) }}
                      </span>

                      <span
                        v-else-if="
                          option.format == 'accountStatusSelect' ||
                          option.format == 'removableSelect' ||
                          option.format == 'improvedBoolean' ||
                          option.format == 'collaborateBoolean' ||
                          option.format == 'systemUsedBoolean'
                        "
                      >
                        {{ item[option.prop] | changeBoolean(option.format) }}
                      </span>

                      <span
                        v-else-if="
                          option.format == 'MaintainContentOptions' ||
                          option.format == 'MaintainProcessOptions' ||
                          option.format == 'BrandOptions' ||
                          option.format == 'ContactUnitOptions' ||
                          option.format == 'DeviceStatusOptions'
                        "
                      >
                        {{ changeOptionName(item[option.prop]) }}
                      </span>

                      <span
                        v-else-if="option.format == 'floorOfHouseSelect'"
                        @click="
                          clickMessageBox(
                            '門牌資料',
                            option.format,
                            item[option.prop]
                          )
                        "
                        style="color: #66b1ff; cursor: pointer"
                      >
                        {{ item.getUsageOfFloorsName() }}
                      </span>
                      <!-- assignFireDeviceSelect -->
                      <span
                        v-else-if="
                          option.format == 'deviceSelect' ||
                          option.format == 'addressdeviceSelect'
                        "
                        @click="
                          clickMessageBox(
                            '設備資料',
                            option.format,
                            item[option.prop]
                          )
                        "
                        style="color: #66b1ff; cursor: pointer"
                      >
                        {{ item.getDevicesName() }}
                      </span>

                      <span v-else-if="option.format == 'floorSelect'">
                        {{ changeFloorName(item[option.prop]) }}
                      </span>

                      <span v-else-if="option.format == 'addressStr'">
                        {{ item.getAddressStr() }}
                      </span>

                      <span v-else-if="option.format == 'valueType'">
                        {{ item.getValueTypeName() }}
                      </span>

                      <span v-else-if="option.format == 'iconSelect'">
                        <template
                          v-if="
                            item[option.prop] !== '' &&
                            item[option.prop] !== undefined &&
                            item[option.prop] !== null
                          "
                        >
                          <svg-icon
                            :icon-class="'fire_' + item[option.prop]"
                            style="font-size: 30px"
                          />
                          <!-- <img class="avatar" :src="changeIcon(item[option.prop])"
                                        style="height:25px;width:25px;margin:auto;vertical-align:middle"> -->
                        </template>
                      </span>

                      <!-- <span v-else-if="option.format == 'nTypeChange' " >
                                    {{ changenType(item[option.prop]) }}
                                </span> -->

                      <span
                        v-else-if="option.format == 'deviceTypeSelect'"
                        @click="
                          clickMessageBox(
                            '設備種類',
                            option.format,
                            item[option.prop]
                          )
                        "
                        style="color: #66b1ff; cursor: pointer"
                      >
                        {{ item.getLinkType().getSelectName() }}
                      </span>

                      <span
                        v-else-if="option.format == 'contactunitSelect'"
                        @click="
                          clickMessageBox(
                            '廠商資料',
                            option.format,
                            item[option.prop]
                          )
                        "
                        style="color: #66b1ff; cursor: pointer"
                      >
                        {{ changeContainUnit(item[option.prop]) }}
                      </span>

                      <span
                        v-else-if="option.format == 'buildingSelect'"
                        @click="
                          clickMessageBox(
                            '建築物資料',
                            option.format,
                            item[option.prop]
                          )
                        "
                        style="color: #66b1ff; cursor: pointer"
                      >
                        {{ item.getBuildingsName() }}
                      </span>

                      <span
                        v-else-if="option.format == 'roleSelect'"
                        @click="
                          clickMessageBox(
                            '角色資料',
                            option.format,
                            item[option.prop]
                          )
                        "
                        style="color: #66b1ff; cursor: pointer"
                      >
                        {{ item.getRolesName() }}
                      </span>

                      <span
                        v-else-if="option.format == 'inspectionSelect'"
                        @click="
                          clickMessageBox(
                            '缺失內容',
                            option.format,
                            item[option.prop]
                          )
                        "
                        style="color: #66b1ff; cursor: pointer"
                      >
                        {{ item.getInspectionLackName() }}
                      </span>

                      <span v-else>{{ item[option.prop] }}</span>
                    </div>
                  </div>
                </div>
                <div class="footer">
                  <div
                    v-if="isHasButtons"
                    style="float: right; margin-top: 10px"
                  >
                    <span v-for="(button, index) in buttonsName" :key="index">
                      <el-button
                        :type="
                          button.type !== undefined
                            ? button.type
                            : button.status == 'open'
                            ? 'primary'
                            : button.status == 'delete'
                            ? 'info'
                            : button.status == 'openfiles'
                            ? 'danger'
                            : 'warning'
                        "
                        @click="handleClickOption(button.status, item)"
                        size="mini"
                        :disabled="
                          button.status == 'delete' &&
                          item.removable !== undefined &&
                          item.removable == false
                        "
                      >
                        <span>{{ button.name }}</span>
                      </el-button>
                    </span>
                  </div>
                </div>
              </div>
            </el-col>
          </div>
        </div>
        <div v-else>
          <el-table
            ref="tableData"
            class="table"
            :key="itemkey"
            :data="blockData"
            row-key="id"
            border
            highlight-current-row
            style="width: 100%; margin-top: 10px"
            empty-text="暫無資料"
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
            :header-cell-class-name="handleHeaderCellClass"
            :max-height="height"
          >
            <el-table-column
              v-if="title !== 'historyActions'"
              reserve-selection
              type="selection"
              width="40"
            >
            </el-table-column>

            <el-table-column fixed type="index"> </el-table-column>

            <el-table-column
              v-for="(item, index) in rowlabel"
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

                <span v-else-if="item.formType == 'range'">
                  {{ dataStr(scope.row, "YYYY-MM-DD", "checkStartDate") }}
                  <span
                    v-if="
                      scope.row['checkStartDate'] !== null &&
                      scope.row['checkStartDate'] !== undefined
                    "
                    >~<br
                  /></span>
                  {{ dataStr(scope.row, "YYYY-MM-DD", "checkEndDate") }}
                </span>

                <span v-else-if="item.formType == 'selectSetting'">
                  {{ changeOptionName(scope.row[item.prop]) }}
                </span>

                <span
                  v-else-if="
                    item.formType == 'boolean' || item.formType == 'checkbox'
                  "
                >
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

                <span v-else-if="item.formType == 'nTypeChange'">
                  {{ scope.row[item.prop] | changeNType }}
                </span>

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
                    item.formType == 'addressStr' ||
                    item.formType == 'fullType'
                  "
                >
                  <template v-if="item.format == 'iconSelect'">
                    <svg-icon
                      :icon-class="'fire_' + scope.row[item.prop]"
                      style="font-size: 30px"
                    />
                  </template>
                  <template v-else>
                    {{
                      changeShowFormatString(item.format, scope.row, item.prop)
                    }}
                  </template>
                </span>

                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              label="操作"
              v-if="headerButtonsName.length !== 0 && buttonsName.length !== 0"
              width="180px"
            >
              <template slot="header">
                <!-- 檔案上傳&檔案下載&新增資料 -->
                <span v-for="(button, index) in headerButtonsName" :key="index">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="button.name"
                    placement="top"
                  >
                    <i
                      :class="button.icon"
                      @click="handleClickOption(button.status, '')"
                      style="cursor: pointer; font-size: 25px; float: right"
                    >
                    </i>
                  </el-tooltip>
                </span>
              </template>
              <template slot-scope="scope">
                <!-- 檔案&缺失&查看/分配權限&編輯&刪除 -->
                <div style="float: right">
                  <span v-for="(button, index) in buttonsName" :key="index">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="button.name"
                      placement="top"
                    >
                      <i
                        :class="button.icon"
                        @click="handleClickOption(button.status, scope.row)"
                        style="cursor: pointer; font-size: 25px; float: right"
                      >
                      </i>
                    </el-tooltip>
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-row>
    <el-row>
      <div
        v-show="title !== 'mainMenu' && title !== 'accessAuthority'"
        class="pagination-container"
      >
        <template v-if="isMobile == 'null'">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="page"
            :page-sizes="pageSizeList"
            :page-size="limit"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          ></el-pagination>
        </template>
        <template v-else>
          <el-pagination
            small
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="limit"
            layout="total, prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </template>
      </div>
    </el-row>
    <!-- <el-row v-else-if="isTable == false" style="margin-left: -10px">
      <div class="pagination-container">
        <el-pagination
          small
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-size="limit"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-row> -->
  </div>
</template>

<script>
import { computedmixin } from "@/mixin/index";
const moment = require("moment");
import constant from "@/constant/index";
import { getUUID } from "@/utils";
import { getDevice } from "@/utils/auth";

export default {
  mixins: [computedmixin],
  name: "Block",
  props: {
    blockData: {
      type: Array,
      required: true,
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
    isHasButtons: {
      type: Boolean,
      default: true,
    },
    hasSearch: {
      type: Boolean,
      default: true,
    },
    config: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    selectData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    selectSetting: {
      type: Array,
    },
    listQueryParams: {
      type: Object,
    },
    pageSizeList: {
      type: Array,
      default: function () {
        return [12, 30, 50, 100];
      },
    },
    isTable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    canotSearch() {
      var data = this.config.filter((item) => item.selectFilter == true);
      this.searchForm.preset = _.cloneDeep(data).map((item) => {
        var i = {
          prop: item.prop,
          searchValue: "",
          islink: item.prop.indexOf("link") !== -1,
          type: item.formType,
        };
        return i;
      });
      var list = _.cloneDeep(data).map((obj) => {
        if (obj.format == "deviceTypeSelect") {
          obj.formType = "fullType";
          obj.format = "fullType";
        }
        return obj;
      });
      return list;
    },
    inputSelectChange() {
      return this.config.filter((item) => item.isSearch == true);
    },
    table() {
      var array = [];
      if (this.filterSearch.length) {
        for (let obj of this.filterSearch) {
          var i = this.blockData.filter((item) => {
            return item[obj[0]].indexOf(obj[1]) > -1;
          });
          if (i.length) {
            array.push(i[0]);
          }
        }
      }
      var temp = array.length !== 0 ? array : this.blockData;

      if (this.sortValue !== "" && this.sortOrder !== "") {
        var self = this;
        var sortvalue = this.sortValue;
        if (this.sortOrder == "descending") {
          temp = temp.sort(function (str1, str2) {
            var s1 = str1[sortvalue] == null ? "" : str1[sortvalue];
            var s2 = str2[sortvalue] == null ? "" : str2[sortvalue];
            return self.sortRule(s2, s1);
          });
        } else {
          temp = temp.sort(function (str1, str2) {
            var s1 = str1[sortvalue] == null ? "" : str1[sortvalue];
            var s2 = str2[sortvalue] == null ? "" : str2[sortvalue];
            return self.sortRule(s1, s2);
          });
        }
      }
      return temp;
    },
    labelstyle() {
      if (this.$store.state.app.device === "mobile") {
        return "30%";
      } else {
        return "30%";
      }
    },
    itemstyle() {
      if (this.$store.state.app.device === "mobile") {
        return "60%";
      } else {
        return "60%";
      }
    },
    heightChange() {
      if (this.title == "committee") {
        return { height: "120px" };
      } else if (this.title == "contactUnit") {
        return { height: "130px" };
      } else if (this.title == "floorOfHouse") {
        return { height: "185px" };
      } else if (this.title == "maintainList") {
        return { height: "130px" };
      } else if (this.title == "equipment") {
        return { height: "270px" };
      } else if (
        this.title == "reportInspectio" ||
        this.title == "reportPublicSafe"
      ) {
        return { height: "220px" };
      } else if (this.title == "devicetype") {
        return { height: "150px" };
      } else if (this.title == "mainMenu") {
        return { height: "120px" };
      } else if (this.title == "accessAuthority") {
        return { height: "120px" };
      } else if (this.title == "roles") {
        return { height: "60px" };
      } else if (this.title == "account") {
        return { height: "150px" };
      } else if (this.title == "building") {
        return { height: "345px" };
      } else if (this.title == "selfDefenseFireMarshalling") {
        return { height: "30px" };
      }
    },
    FirstheightChange() {
      if (this.title == "committee") {
        return { height: "180px" };
      } else if (this.title == "contactUnit") {
        return { height: "190px" };
      } else if (this.title == "floorOfHouse") {
        return { height: "245px" };
      } else if (this.title == "maintainList") {
        return { height: "190px" };
      } else if (this.title == "equipment") {
        return { height: "330px" };
      } else if (
        this.title == "reportInspectio" ||
        this.title == "reportPublicSafe"
      ) {
        return { height: "280px" };
      } else if (this.title == "devicetype") {
        return { height: "210px" };
      } else if (this.title == "mainMenu") {
        return { height: "180px" };
      } else if (this.title == "accessAuthority") {
        return { height: "180px" };
      } else if (this.title == "roles") {
        return { height: "120px" };
      } else if (this.title == "account") {
        return { height: "210px" };
      } else if (this.title == "building") {
        return { height: "405px" };
      } else if (this.title == "selfDefenseFireMarshalling") {
        return { height: "90px" };
      }
    },
    page: function () {
      return this.listQueryParams.pageIndex || 1;
    },
    limit: function () {
      return this.listQueryParams.pageSize || 12;
    },
    total: function () {
      return this.listQueryParams.total || 0;
    },
    isMobile: function () {
      return getDevice();
    },
  },
  watch: {
    isTable: {
      handler: async function () {
        this.isTable == true ? (this.gutter = 0) : (this.gutter = 32);
        if (this.isTable == true) {
          this.rowlabel = this.config.filter(
            (item, index) => item.isHidden == false
          );
        } else {
          this.rowlabel = this.config.filter(
            (item, index) => item.isBlock == true
          );
        }
      },
      immediate: true,
    },
    title: {
      handler: async function () {
        this.resetCondition();
        //點位的地方需要設定設備清單
        if (
          this.title == "deviceAddressManagement" ||
          this.title == "devicePLCAddressManagement"
        ) {
          if (this.device_record == 0) {
            await this.$store.dispatch("building/setDevice");
            this.$store.dispatch("record/saveDeviceRecord", 1);
          }
          var type =
            this.title == "deviceAddressManagement"
              ? "nDeviceTypeList.AE.AE_FireDetectorCentralControl"
              : "nDeviceTypeList.OE.OE_ProgrammableLogicController";
          this.deviceSelectArray = _.cloneDeep(
            this.buildingdevices
              .filter(
                (item) =>
                  item.getLinkType().getFullType() == type &&
                  item.getInternetNumber() !== null &&
                  item.getInternetNumber() !== "" &&
                  item.getInternetNumber() !== undefined
              )
              .map((v) => {
                this.$set(v, "value", v.getID());
                this.$set(
                  v,
                  "label",
                  "【網路編號：" +
                    v.getInternetNumber() +
                    "】" +
                    v.getOnlyName()
                );
                this.$set(v, "id", v.getID());
                return v;
              })
          );
          if (this.deviceSelectArray.length !== 0) {
            this.deviceIdSelect = this.deviceSelectArray[0];
            this.searchDevice();
          }
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      textMap: {
        update: "編輯",
        create: "新增",
      },
      temp: {},
      rowlabel: [],
      itemkey: Math.random(),
      gutter: 0,
      //updateArray: [],
      orderArray: [],
      inputSelect: null,
      inputSearch: "",
      //更新多筆&刪除多筆使用
      selectArray: [],
      //電腦版搜尋
      activeNames: ["1"],
      filterSearch: [],
      sortValue: "",
      sortOrder: "",
      deviceIdSelect: null,
      deviceSelectArray: [],
      searchForm: {
        preset: [],
        conditions: [
          {
            prop: "",
            searchValue: "",
            islink: false,
            type: "input",
          },
        ],
      },
      dataList: [],
    };
  },
  methods: {
    // async requestData(formType, format) {
    //   console.log("focus");
    //   this.dataList = [];
    //   if (formType == "selectSetting") {
    //     this.dataList = await this.optionfilter(format);
    //   } else {
    //     this.dataList = await this.selectfilter(
    //       format == "commitUserInfo" ? "userInfo" : format
    //     );
    //   }
    // },
    //區塊&表格&對外連結
    handleClickOption(status, row) {
      console.log("status=>", status, "row=>", row);
      if (status === "delete") {
        if (row.removable !== undefined && row.removable == false) {
          this.$message.error("該筆資料不可刪除");
        } else {
          this.$confirm("是否確定刪除該筆資料?", "提示", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning",
            center: true,
          })
            .then(() => {
              if (this.title == "maintain") {
                this.$emit("handleDialog", this.title, status, row);
              } else {
                this.$emit("handleBlock", this.title, status, row);
              }
            })
            .catch(() => {});
        }
      } else if (status === "updateMany") {
        if (this.selectArray.length == 0) {
          this.$message.error("請勾選要更新的資料列");
        } else {
          this.$emit("handleBlock", this.title, status, this.selectArray);
        }
      } else if (status === "deleteMany") {
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
              this.$emit("handleBlock", this.title, status, this.selectArray);
            })
            .catch(() => {});
        }
      } else if (status === "setfloors") {
        if (this.selectArray.length == 0) {
          this.$message.error("請勾選要設定的點位");
        } else {
          this.$emit("handleBlock", this.title, status, this.selectArray);
        }
      } else {
        if (this.title == "maintain") {
          this.$emit("handleDialog", this.title, status, row);
        } else {
          console.log(this.title, status, row);
          this.$emit("handleBlock", this.title, status, row);
        }
      }
    },
    //排序
    handleHeaderCellClass({ row, column, rowIndex, columnIndex }) {
      this.orderArray.forEach((element) => {
        if (column.property === element.prop) {
          column.order = element.order;
        }
      });
    },
    //選取列
    handleSelectionChange(val) {
      this.selectArray = val;
    },
    // 改變翻頁組件中每頁數據總數
    handleSizeChange(val) {
      this.listQueryParams.pageSize = val;
      this.listQueryParams.pageIndex = 1; // 改變翻頁數目，將頁面=1
      this.$emit("update:listQueryParams", this.listQueryParams);
      this.$emit("clickPagination");
    },
    // 跳到當前是第幾頁
    handleCurrentChange(val) {
      this.listQueryParams.pageIndex = val;
      this.$emit("update:listQueryParams", this.listQueryParams);
      this.$emit("clickPagination");
    },
    change() {
      this.$emit("changeTable", !this.isTable);
    },
    searchDevice() {
      this.listQueryParams.internet = this.deviceIdSelect.getInternetNumber();
      this.$emit("setDeviceIdSelect", this.deviceIdSelect.getID());
      this.$emit("update:listQueryParams", this.listQueryParams);
      this.$emit("clickPagination");
    },
    //舊版搜尋功能-清空selectArray
    clearInputSearch() {
      this.inputSelect = null;
      this.$emit("resetlistQueryParams");
    },
    handleSearchWord() {
      if (this.inputSelect == null || this.inputSelect.length == 0) {
        this.$message.error("請選擇搜尋欄位");
        return false;
      }
      var data = this.config.filter((config) => {
        if (this.inputSelect.findIndex((item) => item == config.prop) !== -1)
          return config;
      });
      if (this.inputSearch == "") {
        this.clearInputSearch();
      } else {
        var words = this.inputSearch.split(",");
        words = words.filter((item) => item !== "");
        data.forEach((item, index) => {
          if (words[index] !== undefined) {
            this.$set(this.listQueryParams, item.prop, "{LIKE}" + words[index]);
          }
        });
        this.listQueryParams.pageIndex = 1;
        this.$emit("update:listQueryParams", this.listQueryParams);
        this.$emit("clickPagination");
      }
    },
    clearSelectArray() {
      this.selectArray = [];
      this.$refs.tableData.clearSelection();
    },
    //新版搜尋功能-日期不能多個
    setConditionType(val, index) {
      if (val !== "") {
        var _index = this.searchForm.conditions.findIndex((item) => {
          return item.prop == val && item.type == "date";
        });
        if (_index !== -1 && _index !== index) {
          this.$message.error("日期區間不得多重搜尋");
          this.searchForm.conditions[index].prop = "";
          return false;
        }
        var obj = this.config.filter((item) => item.prop == val)[0];
        if (obj.formType == "date") {
          //日期格式
          this.searchForm.conditions[index].type = "date";
        } else {
          this.searchForm.conditions[index].type = "input";
        }
      }
    },
    removeCondition(item) {
      var index = this.searchForm.conditions.indexOf(item);
      if (index !== -1) {
        this.searchForm.conditions.splice(index, 1);
      }
    },
    addCondition() {
      this.searchForm.conditions.push({
        searchValue: "",
        prop: "",
        islink: false,
        type: "input",
      });
    },
    resetCondition(isSearch = false) {
      this.searchForm = {
        preset: [],
        conditions: [
          {
            prop: "",
            searchValue: "",
            islink: false,
            type: "input",
          },
        ],
      };
      if (isSearch) {
        this.onSearch();
      }
    },
    onSearch() {
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
      };
      var arr = this.searchForm.preset
        .filter((obj) => {
          return obj.searchValue.length !== 0;
        })
        .concat(this.searchForm.conditions)
        .filter((obj) => {
          return obj.searchValue !== "";
        });
      var reg = this.reorganization(arr);
      console.log(JSON.stringify(reg));
      reg.forEach((item) => {
        var cond =
          item.type == "date"
            ? "{<~>}"
            : item.type == "select" ||
              item.type == "boolean" ||
              item.type == "checkbox" ||
              item.type == "singleChoice" ||
              item.type == "selectSetting"
            ? ""
            : "{LIKE}";
        var data = item.data.join(",");
        if (item.type == "date") {
          var startDate = moment(item.data[0]).format("YYYY-MM-DD");
          var endDate = moment(item.data[1]).format("YYYY-MM-DD");
          data = startDate + "," + endDate;
        } else if (item.type == "fullType") {
          data = item.data.pop();
        } else if (item.type == "select" || item.type == "singleChoice") {
          var temp = [];
          item.data.forEach((con) => {
            temp.push({ id: con });
          });
          data = temp;
          if (item.prop == "linkDeviceTypes") {
            data = [{ fullType: item.data.pop() }];
          }
        } else if (item.type == "boolean" || item.type == "checkbox") {
          data = item.data[0];
        }
        this.$set(
          this.listQueryParams,
          item.prop,
          typeof data == "string" ? cond + data : data
        );
      });
      console.log(JSON.stringify(this.listQueryParams));
      this.$emit("update:listQueryParams", this.listQueryParams);
      if (this.title == "floorOfHouse") {
        this.$emit("searchEvent");
      } else {
        this.$emit("clickPagination");
      }
    },
    reorganization(arr) {
      var map = {},
        dest = [];
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        var sv = ai.searchValue;
        var type = typeof sv;
        if (!map[ai.prop]) {
          dest.push({
            prop: ai.prop,
            type: ai.type,
            islink: ai.islink,
            data: type == "string" ? new Array(sv) : sv,
          });
          map[ai.prop] = ai;
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj.prop == ai.prop) {
              dj.data.push(sv);
              break;
            }
          }
        }
      }
      return dest;
    },
  },
};
</script>

<style>
.el-row {
  margin-left: 0px;
  margin-right: 0px;
}
.el-cascader-menu {
  min-width: 150px;
  max-width: 150px;
  box-sizing: border-box;
  color: #606266;
  border-right: solid 1px #e4e7ed;
  height: 204px;
  overflow-x: scroll;
  overflow-y: hidden;
}
.el-cascader__suggestion-panel {
  min-width: 150px;
  max-width: 150px;
  box-sizing: border-box;
  color: #606266;
  border-right: solid 1px #e4e7ed;
  height: 204px;
  overflow-x: scroll;
  overflow-y: scroll;
}
/* .el-scrollbar__wrap {
    height: 250px;
    width: 150px;
    overflow-y: auto;
    overflow-x: auto;

  } */
.el-cascader-node__label {
  padding: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-cascader-node__postfix {
  right: 10px;
}
</style>
<style lang="scss" scoped>
.infinite-list-wrapper {
  width: 100%;
  height: 600px;
  overflow-x: hidden;
  overflow-y: auto;
  .filter-item {
    float: right;
    margin-bottom: 0px;
    margin-top: 0px;
  }
}
.dashboard-wrapper {
  background-color: rgb(219, 231, 237);
  padding: 5px 8px 15px 8px;
  margin-top: 10px;
  margin-bottom: 10px;

  .tag-co {
    background-color: rgb(237, 237, 237);
    color: red;
  }
  .tag-noco {
    background-color: rgb(237, 237, 237);
    color: #409eff;
  }
  .tag-mid {
    background-color: rgb(237, 237, 237);
    color: #e6a23c;
  }
  .wrapper {
    overflow-x: hidden;
    overflow-y: auto;
    line-height: 25px;

    .table {
      padding-right: 0px;
      padding-left: 0px;
    }
  }
}
.files {
  width: 100%;
  max-height: 200px;
  overflow: auto;
}
// .el-select {
//   width: 100%;
// }
.el-date-editor.el-input {
  width: 100%;
}
.el-range-editor {
  width: 100%;
}
.pagination-container {
  margin-top: 20px;
  margin-bottom: 10px;
}
.icon {
  font-size: 20px;
  padding: 0px 8px;
  cursor: pointer;
}
.searchdiv {
  height: 100px;
  line-height: 100px;
  vertical-align: middle;
  background-color: rgb(197, 197, 197);
  .text {
    text-align: center;
    font-size: 24px;
  }
}
</style>
