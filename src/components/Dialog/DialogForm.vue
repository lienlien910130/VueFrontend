<template>
  <div>
    <el-dialog
      top="5vh"
      :width="dialogWidth"
      :title="textMap[dialogStatus]"
      :visible="visible"
      :close-on-click-modal="false"
      append-to-body
      @close="handleClickOption('cancel')"
      center
    >
      <div v-if="dialogData.length > 1">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="item in dialogData"
            :key="item.id"
            :label="changeTabLabel(item)"
            :name="item.id"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <!-- dialogStatus : 一般表單/upload/lack/authority -->
      <keep-alive>
        <el-form
          ref="dataForm"
          :model="temp"
          :label-position="label"
          label-width="auto"
        >
          <el-form-item
            v-for="(item, index) in config"
            :key="index"
            :prop="item.prop"
            v-show="item.isEdit"
            :rules="[
              { required: item.mandatory, message: item.message },
              item.isPattern
                ? { pattern: item.pattern, message: item.errorMsg }
                : { type: item.type, message: item.typemessage },
            ]"
          >
            <!-- label -->
            <span v-if="item.isAssociate == false" slot="label">{{
              item.label
            }}</span>
            <i v-else slot="label" class="el-icon-edit">
              <a @click="openWindows(item.format)" style="color: #66b1ff">
                {{ item.label }}
              </a>
            </i>
            <!-- 大頭貼 -->
            <template v-if="item.formType == 'photo'">
              <el-upload
                ref="upload"
                action="upload"
                accept="image/jpeg,image/png"
                list-type="picture-card"
                :limit="1"
                :auto-upload="false"
                :on-change="handlePhotoChange"
                :file-list="fileList"
                :multiple="false"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{ file }">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleRemovePhoto"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
            </template>

            <!-- 年度&日期 -->
            <el-date-picker
              v-else-if="item.formType == 'date'"
              v-model="temp[item.prop]"
              value-format="yyyy-MM-dd"
              placeholder="請選擇"
              style="width: 100%"
              :type="item.format == 'YYYY' ? 'year' : 'date'"
              @change="
                item.hasEvent ? handleDatePicker($event, item.prop) : null
              "
            />
            <template v-else-if="item.formType == 'radio'">
              <el-radio-group v-model="radioType" @change="handleChangeRadio">
                <el-radio label="上半年">上半年</el-radio>
                <el-radio label="下半年">下半年</el-radio>
                <el-radio label="全年度">全年度</el-radio>
              </el-radio-group>
            </template>
            <!-- 範圍 -->
            <span v-else-if="item.formType == 'range'">
              <el-date-picker
                ref="picker"
                v-model="rangevalue"
                type="daterange"
                range-separator="至"
                start-placeholder="開始日期"
                end-placeholder="結束日期"
                format="yyyy-MM-dd"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </span>
            <!-- 點位 -->
            <template v-else-if="item.formType == 'addressStr'">
              <el-row>
                <span
                  style="width: 23%; display: inline-block; text-align: center"
                >
                  總機編號
                </span>
                <span> - </span>
                <span
                  style="width: 23%; display: inline-block; text-align: center"
                >
                  系統
                </span>
                <span> - </span>
                <span
                  style="width: 23%; display: inline-block; text-align: center"
                >
                  位址
                </span>
                <span> - </span>
                <span
                  style="width: 23%; display: inline-block; text-align: center"
                >
                  編號
                </span>
              </el-row>
              <el-row>
                <el-input
                  v-model="temp['internet']"
                  :maxlength="5"
                  show-word-limit
                  style="width: 23%"
                  :disabled="true"
                >
                </el-input>
                <span> - </span>
                <el-input
                  v-model="temp['system']"
                  :maxlength="5"
                  show-word-limit
                  style="width: 23%"
                  :disabled="disable"
                >
                </el-input>
                <span> - </span>
                <el-input
                  v-model="temp['address']"
                  :maxlength="5"
                  show-word-limit
                  style="width: 23%"
                  :disabled="disable"
                >
                </el-input>
                <span> - </span>
                <el-input
                  v-model="temp['number']"
                  :maxlength="5"
                  show-word-limit
                  style="width: 23%"
                  :disabled="disable"
                >
                </el-input>
              </el-row>
            </template>
            <!-- 下拉選單-單-array -->
            <el-select
              v-else-if="item.formType == 'singleChoice'"
              v-model="temp[item.prop]"
              placeholder="請選擇"
              filterable
              value-key="id"
              style="width: 100%"
              @change="
                item.hasEvent ? singleChoiceChange($event, item.format) : null
              "
              :disabled="
                item.format == 'commitUserInfo'
                  ? disable
                  : item.format == 'deviceTypeSelect'
                  ? dialogStatus == 'create'
                    ? false
                    : true
                  : false
              "
            >
              <template v-if="item.format == 'inspectionSelect'">
                <el-option-group
                  v-for="group in selectfilter('inspectionSelect')"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.children"
                    :key="item.id"
                    :label="item.label"
                    :value="item"
                    :disabled="item.status !== ''"
                  >
                  </el-option>
                </el-option-group>
              </template>
              <template v-else>
                <el-option
                  v-for="(obj, index) in selectfilter(item.format)"
                  :key="index"
                  :label="
                    item.format == 'maintainListSelect'
                      ? obj.getName()
                      : obj.label
                  "
                  :value="obj"
                >
                </el-option>
              </template>
            </el-select>
            <!-- 下拉選單-多選 -->
            <el-select
              v-else-if="item.formType == 'select'"
              v-model="temp[item.prop]"
              filterable
              multiple
              value-key="id"
              placeholder="請選擇"
              style="width: 100%"
              @change="checkMode($event, item.format)"
              :disabled="item.format == 'accountSelect' ? disable : false"
            >
              <el-option
                v-for="(obj, index) in selectfilter(item.format)"
                :key="index"
                :label="
                  item.format == 'accountSelect' ? obj.getName() : obj.label
                "
                :value="obj"
                :disabled="
                  item.format == 'addressdeviceSelect' ||
                  item.format == 'usageOfFloorUserInfo'
                    ? obj.disabled
                    : false
                "
              >
              </el-option>
            </el-select>
            <!-- 下拉選單-string -->
            <el-select
              v-else-if="item.formType == 'selectString'"
              v-model="temp[item.prop]"
              filterable
              placeholder="請選擇"
              style="width: 100%"
            >
              <template
                v-if="
                  item.format == 'iconSelect' &&
                  selectfilter('iconShow') !== null
                "
                slot="prefix"
              >
                <svg-icon
                  :icon-class="'fire_' + temp[item.prop]"
                  style="font-size: 20px"
                />
              </template>
              <el-option
                v-for="(obj, index) in selectfilter(item.format)"
                :key="index"
                :label="
                  item.format == 'marshallingMgmtSelect' ? obj.name : obj.label
                "
                :value="obj.id"
              >
                <template v-if="item.format == 'iconSelect'">
                  <svg-icon
                    :icon-class="'fire_' + obj.id"
                    style="font-size: 20px"
                  />
                  <span>{{ obj.label }}</span>
                </template>
              </el-option>
            </el-select>
            <!-- 設備種類(後端)下拉選單(單) -->
            <el-cascader
              v-else-if="item.formType == 'fullType'"
              v-model="fulltypevalue"
              placeholder="請選擇"
              :options="selectfilter('fullType')"
              filterable
              style="width: 100%"
              clearable
              @change="changeFullType"
            >
            </el-cascader>
            <!-- 設定的下拉選單(單) -->
            <el-select
              v-else-if="item.formType == 'selectSetting'"
              ref="settingOption"
              v-model="temp[item.prop]"
              filterable
              placeholder="請選擇項目，可直接新增值"
              style="width: 100%"
              allow-create
              default-first-option
              @change="changeValue($event, item.format, item.prop)"
            >
              <el-option
                v-for="(item, index) in optionfilter(item.format)"
                :key="index"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <!-- 地址 -->
            <span v-else-if="item.formType == 'address'">
              <el-cascader
                v-model="addressvalue"
                :options="selectfilter(item.format)"
                :props="{ value: 'label' }"
                style="width: 100%"
                @change="handleChange"
                placeholder="請選擇縣市區域"
              ></el-cascader>
              <el-input
                ref="address"
                name="address"
                v-model="temp[item.prop]"
                show-word-limit
                maxlength="100"
              />
            </span>
            <!-- Boolean:啟用禁用 允許/禁止刪除 配合 改善 -->
            <el-select
              v-else-if="item.formType == 'boolean'"
              v-model="temp[item.prop]"
              placeholder="請選擇"
              style="width: 100%"
              @change="
                item.hasEvent ? handleMainSelect($event, item.format) : null
              "
            >
              <el-option
                v-for="(val, index) in [true, false]"
                :key="index"
                :value="val"
                :label="val | changeBoolean(item.format)"
              ></el-option>
            </el-select>
            <!-- 門牌-自行申報 -->
            <template v-else-if="item.formType == 'selfDeclared'">
              <el-checkbox v-model="temp['selfInspectionDeclared']">
                檢修申報
              </el-checkbox>
              <el-checkbox v-model="temp['selfPublicDeclared']">
                公安申報
              </el-checkbox>
            </template>
            <el-checkbox
              v-else-if="item.formType == 'checkbox'"
              v-model="temp[item.prop]"
              @change="handleChangeCheckBox"
            >
              {{ item.label }}
            </el-checkbox>

            <!-- inputnumber -->
            <el-input
              v-else-if="item.formType == 'inputNumber'"
              v-model.number="temp[item.prop]"
              type="number"
              :min="0"
              :placeholder="item.placeholder"
            >
              <template v-if="item.format == 'inputAppend'" slot="append">
                <span v-if="item.prop == 'area'">m<sup>2</sup></span>
                <span v-else-if="item.prop == 'capacity'">人</span>
                <span v-else-if="item.prop == 'height'">m</span>
                <span v-else>樓</span>
              </template>
            </el-input>
            <!-- 專技人員 -->
            <el-autocomplete
              v-else-if="item.formType == 'searchColumn'"
              class="inline-input"
              v-model="temp[item.prop]"
              :fetch-suggestions="querySearch"
              :placeholder="item.placeholder"
              style="width: 100%"
            ></el-autocomplete>
            <!-- 區塊 -->
            <el-input
              v-else-if="item.format == 'textarea'"
              v-model="temp[item.prop]"
              :autosize="{ minRows: 4, maxRows: 8 }"
              :placeholder="item.placeholder"
              maxlength="200"
              type="textarea"
              show-word-limit
            >
            </el-input>
            <el-input
              v-else
              v-model="temp[item.prop]"
              :maxlength="item.maxlength"
              show-word-limit
              :placeholder="item.placeholder"
              :disabled="item.format == 'internetNumber' ? disable : false"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </keep-alive>

      <div v-if="isHasButtons" slot="footer" class="dialog-footer">
        <span v-for="(button, index) in buttonsName" :key="index">
          <el-button
            :type="button.type"
            @click="handleClickOption(button.status)"
          >
            <span>{{ button.name }}</span>
          </el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import computedmixin from "@/mixin/computedmixin";
import Setting from "@/object/setting";
import { changeDefaultFullType } from "@/utils/index";
import constant from "@/constant/index";
import {
  Account,
  Contactunit,
  Files,
  Inspection,
  MaintainManagementList,
  SelfDefenseFireMarshalling,
} from "@/object";
const moment = require("moment");
export default {
  name: "DialogForm",
  mixins: [computedmixin],
  props: {
    dialogData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    visible: {
      type: Boolean,
      default: true,
    },
    dialogStatus: {
      type: String,
    },
    isHasButtons: {
      type: Boolean,
      default: true,
    },
    buttonsName: {
      type: Array,
    },
    config: {
      type: Array,
    },
    title: {
      type: String,
      required: true,
    },
    selectData: {
      type: Array,
    },
  },
  watch: {
    dialogData: {
      handler: async function (newValue, oldValue) {
        if (oldValue == undefined && newValue !== undefined) {
          this.init();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    dialogWidth() {
      if (this.$store.state.app.device === "mobile") {
        return "90%";
      } else {
        return "1000px";
      }
    },

    changeTabLabel() {
      return function (item) {
        switch (this.title) {
          case "floorOfHouse":
            return item.houseNumber;
          case "building":
            return item.buildingName;
          case "inspectionlack":
          case "publicsafelack":
            return item.lackItem;
          case "deviceAddressManagement":
          case "devicePLCAddressManagement":
            var label = [item.internet, item.system, item.address, item.number];
            if (this.title == "devicePLCAddressManagement") {
              label.push(item.memeryLoc);
            }
            label = label.filter(Boolean).join("-");
            return label;
          case "committee":
            return item.title;
          case "maintain":
            var label = this.changeOptionName(item.processContent);
            return label !== "" ? label : "維護保養";
          case "InspectionMaintain":
            return item.linkInspectionLacks[0].lackItem;
          case "reportInspectio":
          case "reportPublicSafe":
            return item.declareYear;
          case "floor":
            return item.floor;
          case "characterStatus":
            var label = this.changeOptionName(item.cStatus);
            return label !== "" ? label : "狀態";
          default:
            return item.name;
        }
      };
    },
  },
  data() {
    return {
      textMap: {
        update: "編輯",
        create: "新增",
        updateMany:
          this.dialogData.length > 1
            ? "多筆更新【*每更動一筆資料請按儲存*】"
            : "編輯",
      },
      activeName: "",
      temp: {},
      rangevalue: [],
      fulltypevalue: [],
      addressvalue: [],
      accessArray: [],
      createOption: [],
      prop: [],
      maintainListID: "",
      disable: true,
      //originalProtocolMode:'',
      originalInternet: null,
      commitUserInfoArray: [],
      accountArray: [],
      radioType: null,
      fileList: [],
      previewPath: "",
    };
  },
  methods: {
    async init() {
      // window.addEventListener("message", this.receiveMessage, false)
      console.log("form", this.title, this.dialogStatus);
      if (this.dialogData.length) {
        this.activeName = this.dialogData[0].getID();
        this.temp =
          this.dialogStatus !== "create"
            ? this.dialogData[0].clone(this.dialogData[0])
            : this.dialogData[0];
        await this.setDataForm(this.temp);
        console.log(JSON.stringify(this.dialogData));
      }
      this.$nextTick(() => {
        if (this.$refs.dataForm !== undefined) {
          this.$refs.dataForm.clearValidate();
        }
      });
    },
    async setDataForm(temp) {
      if (this.title == "reportInspectio" || this.title == "reportPublicSafe") {
        if (temp["checkStartDate"] !== null) {
          this.rangevalue = [temp["checkStartDate"], temp["checkEndDate"]];
        }
        if (temp["declareYear"] !== null && temp["declareYear"] !== "") {
          this.radioType = temp["declareYear"].substr(-3);
          temp["declareYearType"] = temp["declareYear"].substr(-3);
          temp["declareYear"] = moment(
            new Date(temp["declareYear"].substr(0, 4))
          ).format("YYYY");
          console.log(temp["declareYear"]);
        }
        this.handleChangeCheckBox(this.temp["declareResult"]);
      } else if (this.title == "committee") {
        //array=>object
        var usage = temp.getLinkUsageOfFloors();
        if (usage.length) {
          var obj = this.buildingfloorOfHouse.filter((item) => {
            return item.id == usage[0].id;
          });
          var data = [];
          if (obj.length) {
            this.disable = false;
            var user = temp.getLinkUsers();
            if (user.length) {
              user[0].label = user[0].name;
              data.push(user[0]);
            }
            obj[0].getLinkUsers().forEach((element) => {
              element.label = element.name;
              data.push(element);
            });
            obj[0].getLivingUsers().forEach((element) => {
              element.label = element.name;
              data.push(element);
            });
            const set = new Set();
            this.commitUserInfoArray = data.filter((item) =>
              !set.has(item.id) ? set.add(item.id) : false
            );
          }
        }
      } else if (this.title == "contactUnit") {
        this.handleChangeCheckBox(this.temp["governmentApproval"]);
      } else if (this.title == "devicetype") {
        var fullType = temp["fullType"];
        var obj = _.cloneDeep(changeDefaultFullType(fullType));
        obj.typevalue.push(fullType);
        this.fulltypevalue = obj.typevalue;
      } else if (this.title == "equipment") {
        var type = temp.getLinkType().getFullType();
        this.disable = this.dialogStatus == "update";
        if (
          type == "nDeviceTypeList.AE.AE_FireDetectorCentralControl" ||
          type == "nDeviceTypeList.OE.OE_ProgrammableLogicController"
        ) {
          this.originalInternet =
            temp["internetNumber"] !== undefined
              ? JSON.parse(JSON.stringify(temp["internetNumber"]))
              : null;
          this.disable = false;
        }
      } else if (this.title == "deviceAddressManagement") {
        var icon = this.config.filter((item) => {
          return item.prop == "iconId";
        });

        var device = this.config.filter((item) => {
          return item.prop == "linkDevices";
        });
        if (temp["isFDCC"] && icon.length && device.length) {
          //防災盤訊號
          this.disable = true;
          icon[0].mandatory = false;
          device[0].mandatory = false;
        } else if (!temp["isFDCC"] && icon.length && device.length) {
          this.disable = false;
          icon[0].mandatory = true;
          device[0].mandatory = true;
        }
      } else if (this.title == "devicePLCAddressManagement") {
        this.disable = false;
      } else if (this.title == "selfDefenseFireMarshallingMgmt") {
        var roles = temp.getLinkRole();
        var data = [];
        if (roles.length) {
          for (let item of roles) {
            var account = await SelfDefenseFireMarshalling.getAccountByRole(
              item.id
            );
            account.forEach((acc) => {
              data.push(acc);
            });
          }
          const set = new Set();
          this.accountArray = data.filter((item) =>
            !set.has(item.id) ? set.add(item.id) : false
          );
        }
      } else if (this.title == "account" || this.title == "user") {
        this.handleChangeCheckBox(this.temp["moveWithDifficulty"]);
        if (
          temp["headShotFileId"] !== undefined &&
          temp["headShotFileId"] !== null &&
          temp["headShotFileId"] !== ""
        ) {          
          var file = await Files.getOfID(temp["headShotFileId"]);
          var filename = file.getExtName();
          var fileType = filename == "png" ? "image/png" : "image/jpeg";
          var data = await Files.getImage(temp["headShotFileId"]);
          let url = URL.createObjectURL(new Blob([data], { type: fileType }));          
          file.url = url;          
          this.fileList.push(file);
        }
      }
      this.config.forEach((item) => {
        var isLink =
          item.prop.indexOf("link") > -1 && item.formType == "singleChoice";
        if (isLink) {
          temp[item.prop] =
            temp[item.prop] !== undefined && temp[item.prop].length
              ? temp[item.prop][0]
              : {};
        }
      });
    },
    async singleChoiceChange(value, format) {
      var keys = Object.keys(value);
      console.log(keys);
      if (keys.length) {
        if (this.title == "committee" && format == "floorOfHouseSelect") {
          var data = [];
          value.getLinkUsers().forEach((element) => {
            element.label = element.name;
            data.push(element);
          });
          value.getLivingUsers().forEach((element) => {
            element.label = element.name;
            data.push(element);
          });
          const set = new Set();
          this.commitUserInfoArray = data.filter((item) =>
            !set.has(item.id) ? set.add(item.id) : false
          );
          this.disable = false;
        } else if (this.title == "equipment" && format == "deviceTypeSelect") {
          if (
            value.getFullType() ==
              "nDeviceTypeList.AE.AE_FireDetectorCentralControl" ||
            value.getFullType() ==
              "nDeviceTypeList.OE.OE_ProgrammableLogicController"
          ) {
            this.disable = false;
            this.$emit("handleChangeConfig", true);
          } else {
            this.disable = true;
            this.temp["internetNumber"] = null;
            this.$emit("handleChangeConfig", false);
          }
        } else if (this.title == "maintain" && format == "deviceSelect") {
          this.temp["linkContactUnits"] =
            value["linkMaintainVendors"] !== undefined &&
            value["linkMaintainVendors"].length !== 0
              ? value["linkMaintainVendors"][0]
              : {};
          this.temp["nextMaintainTime"] = value["nextMaintainTime"];
        } else if (
          format == "assignFireDeviceSelect" ||
          format == "assignPLCDeviceSelect"
        ) {
          this.temp["internet"] = value.getInternetNumber();
        }
      }
    },
    // 點位-指定設備
    // 消防編組細項-選擇角色時要撈出account清單
    async checkMode(value, format) {
      console.log(value);
      if (value.length) {
        if (
          this.title == "selfDefenseFireMarshallingMgmt" &&
          format == "roleSelect"
        ) {
          var data = [];
          for (let item of value) {
            var account = await SelfDefenseFireMarshalling.getAccountByRole(
              item.id
            );
            account.forEach((acc) => {
              data.push(acc);
            });
          }
          const set = new Set();
          this.accountArray = data.filter((item) =>
            !set.has(item.id) ? set.add(item.id) : false
          );
          this.disable = false;
        }
      } else {
        // if (this.title == "equipment" && format == "deviceTypeSelect") {
        //   this.disable = true;
        //   this.temp["internetNumber"] = null;
        //   this.$emit("handleChangeConfig", false);
        // } else
        // if (
        //   format == "assignFireDeviceSelect" ||
        //   format == "assignPLCDeviceSelect"
        // ) {
        //   this.temp["internet"] = null;
        // } else
        if (
          this.title == "selfDefenseFireMarshallingMgmt" &&
          format == "roleSelect"
        ) {
          this.disable = true;
          this.temp["linkAccountList"] = [];
        }
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.selectData;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : this.selectData;
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !==
          -1
        );
      };
    },
    openWindows(format) {
      console.log(format);
      var routeData;
      switch (format) {
        case "userInfo":
        case "commitUserInfo":
          if (this.buildingid == undefined) {
            this.$message.error(
              "請選擇建築物後才可對所有權人&防火管理人進行新增"
            );
          } else {
            routeData = this.$router.resolve({
              path: "/authority/users",
              query: { type: "user" },
            });
          }
          break;
        case "deviceTypeSelect":
          routeData = this.$router.resolve({
            path: "/equipment/deviceTypes",
            query: { type: "devicetype" },
          });
          break;
        case "contactunitSelect":
          routeData = this.$router.resolve({
            path: "/normal/basic",
            query: { type: "contactunit" },
          });
          break;
        case "committeeSelect":
          routeData = this.$router.resolve({
            path: "/normal/basic",
            query: { type: "committee" },
          });
          break;
        case "floorOfHouseSelect":
          routeData = this.$router.resolve({
            path: "/normal/basic",
            query: { type: "floorOfHouse" },
          });
          break;
        case "inspectionSelect":
          routeData = this.$router.resolve({
            path: "/normal/maintenancereport",
            query: { type: "inspection" },
          });
          break;
        case "deviceSelect":
        case "addressdeviceSelect":
          routeData = this.$router.resolve({
            path: "/equipment/index",
            query: { type: "device" },
          });
          break;
        case "roleSelect":
          routeData = this.$router.resolve({
            path: "/authority/roles",
            query: { type: "role" },
          });
          break;
        case "maintainListSelect":
          this.$prompt("建立新維護保養單", "提示", {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            inputValidator: (val) => {
              if (val === null || val === "") {
                return false;
              }
              return true;
            },
            inputErrorMessage: "請輸入名稱",
          })
            .then(({ value }) => {
              this.$emit(
                "handleDialog",
                "maintainList",
                "createNewSelect",
                new MaintainManagementList({
                  name: value,
                  createdDate: new Date(),
                })
              );
            })
            .catch(() => {
              return false;
            });
          break;
        default:
          var option =
            format == "cStatusOptions"
              ? "cs"
              : format == "ContactUnitOptions"
              ? "bu"
              : format == "MaintainContentOptions" ||
                format == "MaintainProcessOptions" ||
                format == "MaintainTimeOptions"
              ? "ma"
              : format == "InspectionTypeOfTime" ||
                format == "InspectionTimeOptions"
              ? "in"
              : "pu";
          routeData = this.$router.resolve({
            path: "/settings/index",
            query: { type: option },
          });
          break;
      }
      if (format == "maintainListSelect") {
        //建立維護保養單不需繼續向下執行
        return false;
      }
      if (window.child && window.child.open && !window.child.closed) {
        window.child.close();
      }
      window.child = window.open(routeData.href, "_blank");
      //window.child = window.open(routeData.href, '_blank', 'toolbar=no, width=400, height=600,location=no')
    },
    //動態新增選項
    changeValue(event, format, prop) {
      var array = this.optionfilter(format);
      var data = array.filter((item) => item.id == event);
      if (data.length == 0) {
        var item = {
          classType: format,
          textName: event,
          sort: 99,
        };
        this.prop.push(prop);
        this.createOption.push(item);
      }
    },
    async getOptions() {
      //取得大樓的所有分類
      this.options = await Setting.getAllOption();
      this.$store.dispatch("building/setoptions", this.options);
      this.$store.dispatch("record/saveSettingRecord", 1);
    },
    //fulltype選單變動
    changeFullType() {
      var data = _.cloneDeep(this.fulltypevalue);
      this.temp["fullType"] = data.pop();
    },
    handleChangeCheckBox(value) {
      console.log(value);
      if (this.title == "contactUnit") {
        if (value) {
          this.config.forEach((item) => {
            if (!item.isEdit) {
              item.isEdit = true;
            }
          });
        } else {
          var c = _.cloneDeep(Contactunit.getTableConfig());
          this.config = c;
        }
      } else if (
        this.title == "reportInspectio" ||
        this.title == "reportPublicSafe"
      ) {
        if (!value) {
          this.config.forEach((item) => {
            if (!item.isEdit && !item.isHidden) {
              item.isEdit = true;
            }
          });
        } else {
          var c = _.cloneDeep(Inspection.getTableConfig());
          this.config = c;
          this.temp["declarationImproveDate"] = "";
          this.temp["isImproved"] = true;
          this.temp["nextInspectionDate"] = "";
        }
      } else if (this.title == "account") {
        if (value) {
          this.config.forEach((item) => {
            if (!item.isEdit && item.prop == "description") {
              item.isEdit = true;
            }
          });
        } else {
          var c = _.cloneDeep(Account.getTableConfig());
          c[6].label = "生日";
          if (this.dialogStatus === "update") {
            c[2].isEdit = false;
            c[2].mandatory = false;
          }
          this.config = c;
        }
      }
    },
    //地址欄位
    handleChange(value) {
      this.temp.address = value[0] + value[1];
    },
    //radio改變
    handleChangeRadio(value) {
      this.temp["declareYearType"] = value;
    },
    //火警點位的類型
    handleMainSelect(value, format) {
      console.log(value, format);
      if (format == "mainSelect") {
        var icon = this.config.filter((item) => {
          return item.prop == "iconId";
        });
        var device = this.config.filter((item) => {
          return item.prop == "linkDevices";
        });
        if (value) {
          //防災盤訊號
          this.disable = true;
          icon[0].mandatory = false;
          device[0].mandatory = false;
          this.temp["system"] = "";
          this.temp["address"] = "";
          this.temp["number"] = "";
        } else {
          this.disable = false;
          icon[0].mandatory = true;
          device[0].mandatory = true;
        }
      }
    },
    //維保細項日期變動事件
    handleDatePicker(val, prop) {
      //故障日期、叫修日期、完成日期=>連動處理進度
      if (this.title == "contactUnit") {
        if (val == "") {
          this.temp["expirationDate"] = "";
        } else {
          this.temp["expirationDate"] = moment(val)
            .add(3, "years")
            .subtract(1, "days")
            .format("YYYY-MM-DD");
        }
      } else {
        if (val == "") {
          return false;
        }
        var list = this.optionfilter("MaintainProcessOptions");
        var txtName = "";
        switch (prop) {
          case "dateOfFailure":
            if (
              this.temp["dateOfCallRepair"] == null &&
              this.temp["completedTime"] == null
            ) {
              txtName = "故障中";
            }
            break;
          case "dateOfCallRepair":
            if (this.temp["completedTime"] == null) {
              txtName = "維修中";
            }
            break;
          case "completedTime":
            txtName = "已保養";
            break;
          default:
            break;
        }
        var setting = list.filter((item) => {
          return (
            item.textName == txtName &&
            item.classType == "MaintainProcessOptions"
          );
        });
        if (setting.length) {
          this.temp["processStatus"] = setting[0].id;
        }
      }
    },
    //大頭貼改變-更新的時候會直接動作
    handlePhotoChange(file, fileList) {
      this.fileList = fileList;
      if (this.dialogStatus == "update" && fileList.length > 0) {
        var data = _.cloneDeep(fileList);
        this.$emit("handleDialog", "photo", "photo", data);
      }
    },
    handleRemovePhoto() {
      this.$confirm("是否確認刪除圖片?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.fileList = [];
          if (this.dialogStatus == "update") {
            this.$emit("handleDialog", "photo", "removePhoto", this.temp.id);
          }
        })
        .catch(() => {
          return false;
        });
    },
    //子傳父窗口
    handleClickOption(status) {
      if (this.title == "reportInspectio" || this.title == "reportPublicSafe") {
        this.temp["checkStartDate"] = this.rangevalue[0];
        this.temp["checkEndDate"] = this.rangevalue[1];
      }
      if (
        status !== "cancel" &&
        status !== "cancellack" &&
        status !== "empty" &&
        status !== "cancelfloor"
      ) {
        this.$refs.dataForm.validate(async (valid) => {
          if (valid) {
            if (this.createOption.length !== 0) {
              //有動態新增選項
              for (var i = 0; i < this.createOption.length; i++) {
                var result = await Setting.postOption(this.createOption[i]);
                if (Object.keys(result).length !== 0) {
                  this.temp[this.prop[i]] = result.id;
                } else {
                  this.$message.error("新增設定有誤");
                }
              }
              this.createOption = [];
              this.prop = [];
              await this.getOptions();
            }

            var data = this.changeObjectToArray();
            if (this.dialogData.length == 1 && status == "updateManySave") {
              status = "update";
            }
            if (
              (this.title == "equipment" && status == "update") ||
              (this.title == "equipment" && status == "updateManySave")
            ) {
              var inter =
                data["internetNumber"] !== undefined
                  ? data["internetNumber"]
                  : null;
              var internet = this.originalInternet !== inter;
              if (internet == true) {
                this.$confirm(
                  "更換【網路編號】將會重置關聯的點位，是否要更新【網路編號】?",
                  "提示",
                  {
                    confirmButtonText: "確定",
                    cancelButtonText: "取消",
                    type: "warning",
                  }
                )
                  .then(() => {
                    this.$emit("handleDialog", true, status, data);
                  })
                  .catch(() => {
                    data["internetNumber"] = this.originalInternet;
                    this.$emit("handleDialog", false, status, data);
                  });
              } else {
                this.$emit("handleDialog", false, status, data);
              }
            } else {
              if (
                this.title == "reportInspectio" ||
                this.title == "reportPublicSafe"
              ) {
                if (
                  data["declareYearType"] !== "上半年" &&
                  data["declareYearType"] !== "下半年" &&
                  data["declareYearType"] !== "全年度"
                ) {
                  this.$message.error("請選擇上半年、下半年、全年度");
                  return false;
                }
                data["declareYear"] =
                  moment(data["declareYear"]).format("YYYY") +
                  data["declareYearType"];
              }
              if (this.title == "equipment" && status == "create") {
                //設備新增預設未保養
                if (this.setting_record == 0) {
                  await this.getOptions();
                }
                var obj = this.buildingoptions.filter((item) => {
                  return (
                    item.classType == "MaintainProcessOptions" &&
                    item.textName == "未保養" &&
                    item.systemUse
                  );
                });
                if (obj.length) {
                  data["status"] = obj[0].id;
                }
              }
              if (
                this.title == "account" &&
                this.fileList.length > 0 &&
                status == "create"
              ) {
                var _p = _.cloneDeep(this.fileList);
                data["photo"] = _p;
              }
              this.$emit("handleDialog", this.title, status, data);
            }
          } else {
            this.$message.error("請輸入完整資訊");
            return false;
          }
        });
      }

      if (
        status == "cancel" ||
        status == "cancellack" ||
        status == "cancelfloor" ||
        status == "empty" ||
        status == "authoritycreate"
      ) {
        var data = status == "authoritycreate" ? this.accessArray : "";
        this.$emit("handleDialog", this.title, status, data);
      }
    },
    //頁籤
    async handleTabClick(tab, event) {
      var data = this.dialogData.filter(
        (element, index) => element.id == tab.name
      )[0];
      this.temp = data.clone(data);
      await this.setDataForm(this.temp);
    },
    changeObjectToArray() {
      var data = _.cloneDeep(this.temp);
      this.config.forEach((item) => {
        var isLink =
          item.prop.indexOf("link") > -1 && item.formType == "singleChoice";
        if (isLink) {
          data[item.prop] = Object.keys(data[item.prop]).length
            ? new Array(data[item.prop])
            : [];
        }
      });
      return data;
    },
  },
};
</script>
