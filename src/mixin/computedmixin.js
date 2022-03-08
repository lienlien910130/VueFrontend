// const Vuex = require('vuex')
const moment = require("moment");
import constant from "@/constant/index";
import { Role } from "@/object/index";
import { _ } from "core-js";

export default {
  computed: {
    ...Vuex.mapGetters([
      "id",
      "buildingid",
      "buildinginfo",
      "buildingdevices",
      "buildingoptions",
      "buildingusers",
      "buildingfloors",
      "buildingcontactunit",
      "buildingroles",
      "buildingarray",
      "buildingfloorOfHouse",
      "buildingdeviceType",
      "deviceType",
      "device",
      "fullscreen",
      "role_record",
      "menu_record",
      "setting_record",
      "floorOfHouse_record",
      "householder_record",
      "device_record",
      "contactunit_record",
      "deviceType_record",
      "floor_record",
      "account_record",
      "buildingaccount",
      "buildingcommittee",
      "committee_record",
    ]),
    dataStr() {
      //日期
      return function (a, b, prop) {
        if (a == null) {
          return "";
        }
        var showlabel = a[prop];
        if (showlabel !== null && showlabel !== undefined) {
          if (prop == "birthday") {
            //轉算歲數顯示
            var birth = moment(showlabel).format(b);
            birth = Date.parse(birth.replace("/-/g", "/"));
            if (birth) {
              var year = 1000 * 60 * 60 * 24 * 365;
              var now = new Date();
              var birthday = new Date(birth);
              var age = parseInt((now - birthday) / year);
              return age;
            }
            return "";
          } else if (prop == "declareYear") {
            return showlabel;
          } else if (
            prop == "nextInspectionDate" ||
            prop == "declarationImproveDate"
          ) {
            if (a["declareResult"]) {
              //合格申報
              return "-";
            } else {
              return moment(showlabel).format(b);
            }
          } else {
            return moment(showlabel).format(b);
          }
        } else {
          if (prop == "nextInspectionDate") {
            return a["declareResult"] ? "-" : "尚未複查";
          } else if (prop == "declarationImproveDate") {
            if (a["declareResult"]) {
              return "-";
            }
          } else {
            return "";
          }
        }
      };
    },
    multipleStr() {
      //多個
      return function (type, value) {
        var array = [];
        var temp = [];
        type === "user"
          ? (temp = this.buildingusers)
          : type === "contactunit"
          ? (temp = this.buildingcontactunit)
          : type === "floorOfHouse"
          ? (temp = this.selectData)
          : this.deviceList;
        if (value !== null && value !== undefined) {
          value.forEach((item) => {
            var data = temp.filter((element) => {
              return item.id == element.id;
            });
            if (data.length > 0) {
              type === "floorOfHouse"
                ? array.push(data[0].houseNumber)
                : array.push(data[0].name);
            }
          });
          return array.toString();
        } else {
          return "";
        }
      };
    },
    label() {
      if (this.device === "mobile") {
        return "top";
      } else {
        return "left";
      }
    },
    changeShowFormat() {
      return function (format, row, prop) {
        switch (format) {
          case "deviceSelect":
          case "addressdeviceSelect":
            return row.getDevicesName();
          case "userInfo":
          case "usageOfFloorUserInfo":
          case "commitUserInfo":
            return this.changeUserName(row[prop]);
          case "floorOfHouseSelect":
            return row.getUsageOfFloorsName();
          case "contactunitSelect":
            return this.changeContainUnit(row[prop]);
          case "buildingSelect":
            return row.getBuildingsName();
          case "roleSelect":
            return row.getRolesName();
          case "inspectionSelect":
            return row.getInspectionLackName();
          case "deviceTypeSelect":
            return row.getLinkType().getSelectName();
          case "accountSelect":
            return row.getAccountName();
          case "manyFloorSelect":
            return this.changeFloorName(row[prop]);
          case "processList":
            return row.getProcessName();
          case "committeeSelect":
            return row.getKeeperUnitsName();
        }
      };
    },
    changeShowFormatString() {
      return function (format, row, prop) {
        if (row !== undefined && row !== null) {
          switch (format) {
            case "floorSelect":
              return this.changeFloorName(row[prop]);
            case "valueType":
              return row.getValueTypeName();
            case "fullType":
              return row.getType();
            case "addressStr":
              return row.getAddressStr();
            case "classLeaderSelect":
              return this.changeAccountName(row[prop]);
            case "certificateNumber":
              return row.getCertificateNumber();
            case "actionSelect":
              return row.getActionSelect();
            case "floorOfHouseSelect":
              if (this.floorOfHouse_record == 0) {
                this.$store.dispatch("building/setFloorOfHouse");
                this.$store.dispatch("record/saveFloorOfHouseRecord", 1);
              }
              var data = this.buildingfloorOfHouse.filter((item) => {
                return item.id == row[prop];
              });
              if (data.length) {
                return data[0].houseNumber;
              } else {
                return "";
              }
          }
        } else {
          return "";
        }
      };
    },
    changeOptionName() {
      //設定名稱
      return function (value) {
        if (this.setting_record == 0) {
          this.$store.dispatch("building/setoptions");
          this.$store.dispatch("record/saveSettingRecord", 1);
        }
        if (value !== null && value !== undefined) {          
          let _array = this.buildingoptions.filter(
            (item, index) => item.id == value
          );
          if(_array[0].id == 142) {
            _array[0].textName = "正常"
          }
          if(_array[0].id == 269) {
            _array[0].textName = "故障"
          }
          return _array.length !== 0 ? _array[0].textName : "";
        }
        return "";
      };
    },
    changeAccountName() {
      //帳號名稱
      return function (value) {
        if (this.account_record == 0) {
          this.$store.dispatch("building/setaccounts");
          this.$store.dispatch("record/saveAccountRecord", 1);
        }
        if (value !== null && value !== undefined) {
          let _array = this.buildingaccount.filter(
            (item, index) => item.id == value
          );
          return _array.length !== 0 ? _array[0].name : "";
        }
        return "";
      };
    },
    changeContainUnit() {
      //廠商名稱
      return function (val) {
        if (val !== null && val !== undefined) {
          return val
            .map((item) => {
              return item.getName();
            })
            .toString();
        }
        return "";
      };
    },
    changeUserName() {
      //住戶名稱
      return function (val) {
        if (val !== null && val !== undefined) {
          return val
            .map((item) => {
              return item.getName();
            })
            .toString();
        }
        return "";
      };
    },
    changeFloorName() {
      return function (val) {
        if (
          val !== null &&
          val !== undefined &&
          typeof val !== "string" &&
          typeof val !== "undefined"
        ) {
          return val
            .map((item) => {
              return item.getName();
            })
            .toString();
        } else if (val !== null) {
          if (this.floor_record == 0) {
            this.$store.dispatch("building/setFloors");
            this.$store.dispatch("record/saveFloorRecord", 1);
          }
          let _array = this.buildingfloors.filter(
            (item, index) => item.id == val
          );
          return _array.length !== 0 ? _array[0].floor : "";
        }
        return "";
      };
    },
    stringToBr() {
      return function (a) {
        return a.replace(/{ln}/g, "<br/>");
      };
    },
    selectfilter() {
      return function (value) {
        if (value !== null) {
          switch (value) {
            case "deviceSelect":
              if (this.device_record == 0) {
                this.$store.dispatch("building/setDevice");
                this.$store.dispatch("record/saveDeviceRecord", 1);
              }
              return this.buildingdevices.map((v) => {
                this.$set(v, "value", v.getID());
                this.$set(
                  v,
                  "label",
                  v.getLinkType().getSelectName() + "-" + v.getOnlyName()
                );
                this.$set(v, "id", v.getID());
                return v;
              });
            case "floorSelect":
            case "manyFloorSelect":
              if (this.floor_record == 0) {
                this.$store.dispatch("building/setFloors");
                this.$store.dispatch("record/saveFloorRecord", 1);
              }
              return this.buildingfloors.map((v) => {
                this.$set(v, "value", v.getID());
                this.$set(v, "label", v.getName());
                this.$set(v, "id", v.getID());
                return v;
              });
            case "valueSelect":
              return [
                { label: "bit", id: "bit" },
                { label: "word", id: "word" },
              ];
            case "iconSelect":
              var iconlist = constant.Equipment;
              return iconlist.map((v) => {
                this.$set(v, "value", v.id);
                this.$set(v, "id", v.id);
                this.$set(v, "label", v.name);
                return v;
              });
            case "iconShow":
              var icon = constant.Equipment.filter((item) => {
                return item.id == this.temp["iconId"];
              })[0];
              return icon !== undefined
                ? require("@/icons/svg/fire_" + icon.id + ".svg")
                : null;
            case "valueType":
              return [
                { label: "監視狀態", id: "status" },
                { label: "監視電源", id: "power" },
                { label: "控制動作", id: "action" },
              ];
            case "addressdeviceSelect":
              if (this.device_record == 0) {
                this.$store.dispatch("building/setDevice");
                this.$store.dispatch("record/saveDeviceRecord", 1);
              }
              return this.buildingdevices
                .filter(
                  (item) =>
                    item.getLinkType().getFullType() !==
                      "nDeviceTypeList.AE.AE_FireDetectorCentralControl" &&
                    item.getLinkType().getFullType() !==
                      "nDeviceTypeList.OE.OE_ProgrammableLogicController"
                )
                .map((v) => {
                  this.$set(v, "value", v.getID());
                  this.$set(
                    v,
                    "label",
                    v.getLinkType().getSelectName() + "-" + v.getOnlyName()
                  );
                  this.$set(v, "id", v.getID());
                  return v;
                });
            case "assignFireDeviceSelect": //火警總機
              if (this.device_record == 0) {
                this.$store.dispatch("building/setDevice");
                this.$store.dispatch("record/saveDeviceRecord", 1);
              }
              return this.buildingdevices
                .filter(
                  (item) =>
                    item.getLinkType().getFullType() ==
                      "nDeviceTypeList.AE.AE_FireDetectorCentralControl" &&
                    item.getInternetNumber() !== null &&
                    item.getInternetNumber() !== "" &&
                    item.getInternetNumber() !== undefined
                )
                .map((v) => {
                  this.$set(v, "value", v.getID());
                  this.$set(
                    v,
                    "label",
                    v.getLinkType().getSelectName() + "-" + v.getOnlyName()
                  );
                  this.$set(v, "id", v.getID());
                  return v;
                });
            case "assignPLCDeviceSelect": //PLC
              if (this.device_record == 0) {
                this.$store.dispatch("building/setDevice");
                this.$store.dispatch("record/saveDeviceRecord", 1);
              }
              return this.buildingdevices
                .filter(
                  (item) =>
                    item.getLinkType().getFullType() ==
                      "nDeviceTypeList.OE.OE_ProgrammableLogicController" &&
                    item.getInternetNumber() !== null &&
                    item.getInternetNumber() !== "" &&
                    item.getInternetNumber() !== undefined
                )
                .map((v) => {
                  this.$set(v, "value", v.getID());
                  this.$set(
                    v,
                    "label",
                    v.getLinkType().getSelectName() + "-" + v.getOnlyName()
                  );
                  this.$set(v, "id", v.getID());
                  return v;
                });
            case "contactunitSelect":
              if (this.contactunit_record == 0) {
                this.$store.dispatch("building/setContactunit");
                this.$store.dispatch("record/saveContactunitRecord", 1);
              }
              if (
                this.title == "reportInspectio" &&
                this.buildinginfo.floorsOfAboveGround > 15
              ) {
                return this.buildingcontactunit
                  .filter((item) => {
                    return item.governmentApproval == true;
                  })
                  .map((v) => {
                    this.$set(v, "value", v.getID());
                    this.$set(v, "label", v.getName());
                    this.$set(v, "id", v.getID());
                    return v;
                  });
              } else {
                return this.buildingcontactunit.map((v) => {
                  this.$set(v, "value", v.getID());
                  this.$set(v, "label", v.getName());
                  this.$set(v, "id", v.getID());
                  return v;
                });
              }
            case "committeeSelect":
              if (this.committee_record == 0) {
                this.$store.dispatch("building/setCommittee");
                this.$store.dispatch("record/saveCommitteeRecord", 1);
              }
              return this.buildingcommittee.map((v) => {
                this.$set(v, "value", v.getID());
                this.$set(v, "label", v.getUsageOfName());
                this.$set(v, "id", v.getID());
                return v;
              });
            case "maintainListSelect":
              return this.selectData[1];
            case "inspectionSelect":
              return this.selectData[0];
            case "floorOfHouseSelect":
              if (this.$route.query.bID == undefined) {
                if (this.floorOfHouse_record == 0) {
                  this.$store.dispatch("building/setFloorOfHouse");
                  this.$store.dispatch("record/saveFloorOfHouseRecord", 1);
                }
                return this.buildingfloorOfHouse.map((v) => {
                  this.$set(v, "id", v.id);
                  this.$set(v, "label", v.houseNumber);
                  this.$set(v, "value", v.id);
                  return v;
                });
              } else {
                return this.selectData;
              }
            case "userInfo":            
            case "usageOfFloorUserInfo":
              if (this.account_record == 0) {
                this.$store.dispatch("building/setaccounts");
                this.$store.dispatch("record/saveAccountRecord", 1);
              }
              return this.buildingaccount.map((v) => {
                this.$set(v, "id", v.id);
                this.$set(v, "label", v.name);
                this.$set(v, "value", v.id);
                return v;
              });
            case "deviceTypeSelect":
              if (this.deviceType_record == 0) {
                this.$store.dispatch("building/setDeviceType");
                this.$store.dispatch("record/saveDeviceTypeRecord", 1);
              }
              return this.buildingdeviceType.map((v) => {
                this.$set(v, "value", v.getID());
                this.$set(v, "label", v.getSelectName());
                this.$set(v, "id", v.getID());
                return v;
              });
            case "roleSelect":
              if (this.role_record == 0) {
                this.$store.dispatch("building/setroles");
                this.$store.dispatch("record/saveRoleRecord", 1);
              }
              return this.buildingroles.map((v) => {
                this.$set(v, "value", v.getID());
                this.$set(v, "label", v.getName());
                this.$set(v, "id", v.getID());
                return v;
              });
            case "buildingSelect":
              return this.buildingarray.map((v) => {
                this.$set(v, "value", v.id);
                this.$set(v, "label", v.buildingName);
                this.$set(v, "id", v.id);
                return v;
              });
            case "fullType":
              return this.deviceType;
            case "address":
              return constant.AreaCode;
            case "marshallingMgmtSelect":
              return this.selectData;
            case "commitUserInfo":
              return this.commitUserInfoArray;
            case "accountSelect":
              return this.accountArray;
            case "classLeaderSelect":      
              return this.classLeaderArray.map((v) => {            
              this.$set(v, "value", v.id);
              this.$set(v, "label", v.name);
              this.$set(v, "id", v.id);
              return v;
            });
            case "certificateNumber":
              return [
                { label: "消防設備師", id: "消防設備師" },
                { label: "消防設備士", id: "消防設備士" },
                { label: "暫行裝置檢修", id: "暫行裝置檢修" },
              ];
            case "actionSelect":
              return [
                { label: "查詢", id: "query" },
                { label: "新增", id: "add" },
                { label: "刪除", id: "delete" },
                { label: "修改", id: "update" },
                { label: "匯入檔案", id: "export" },
                { label: "匯出檔案", id: "upload" },
              ];
          }
        } else {
          return "";
        }
      };
    },
  },
  watch: {
    fullscreen: {
      handler: async function () {
        if (this.fullscreen == true) {
          this.title == "committee" ||
          this.title == "contactUnit" ||
          this.title == "floorOfHouse" ||
          this.title == "user"
            ? (this.infiniteheight = 710)
            : (this.infiniteheight = 800);
        } else {
          this.title == "committee" ||
          this.title == "contactUnit" ||
          this.title == "floorOfHouse" ||
          this.title == "user"
            ? (this.infiniteheight = 510)
            : this.title == "mainMenu" || this.title == "accessAuthority"
            ? (this.infiniteheight = 830)
            : (this.infiniteheight = 670);
        }
        this.height = (this.infiniteheight - 10).toString() + "px";
      },
      immediate: true,
    },
  },
  filters: {
    changeBoolean: function (val, format) {
      if (val == true) {
        switch (format) {
          case "accountStatusSelect":
            return "啟用";
          case "collaborateBoolean":
            return "配合中";
          case "removableSelect":
            return "允許";
          case "improvedBoolean":
            return "已改善";
          case "systemUsedBoolean":
            return "已設置";
          case "mainSelect":
            return "防災盤";
          case "revocationBoolean":
            return "已撤銷";
          case "declareResultBoolean":
            return "合格申報";
          case "governmentApprovalBoolean":
          case "nowHaveBoolean":
          case "moveWithDifficultyBoolean":
            return "是";
          case "sexBoolean":
            return "女";
          case "selfDeclaredBoolean":
            return "";
        }
      } else {
        if (format == "selfDeclaredBoolean") {
          var str = "";
          if (val[0] == true) str = "檢修申報";
          if (val[1] == true) str = str + ",公安申報";
          return str;
        }
        if (val !== false) {
          return "";
        }
        switch (format) {
          case "accountStatusSelect":
            return "禁用";
          case "collaborateBoolean":
            return "未配合";
          case "removableSelect":
            return "禁止";
          case "improvedBoolean":
            return "未改善";
          case "systemUsedBoolean":
            return "未設置";
          case "mainSelect":
            return "火警點位";
          case "revocationBoolean":
            return "未撤銷";
          case "declareResultBoolean":
            return "缺失申報";
          case "governmentApprovalBoolean":
          case "nowHaveBoolean":
          case "moveWithDifficultyBoolean":
            return "否";
          case "sexBoolean":
            if (val == false) {
              return "男";
            }
            return "";
        }
      }
    },
    changeNType: function (val) {
      if (val !== null) {
        var type = "";
        switch (val) {
          case "9":
            type = "ConfirmFireAlarm";
            break;
          case "10":
            type = "Start";
            break;
          case "11":
            type = "End";
            break;
          case "12":
            type = "LinkToWorkflow";
            break;
          case "13":
            type = "WaitingForCall";
            break;
          case "21":
            type = "MessageBroadcast";
            break;
          case "22":
            type = "MobilePush";
            break;
          case "23":
            type = "LinePush";
            break;
          case "24":
            type = "MessagePush";
            break;
          case "25":
            type = "VoiceBroadcast";
            break;
          case "31":
            type = "CountDown";
            break;
          case "50":
            type = "OptionEvents";
            break;
          case "51":
            type = "DeviceConfirmation";
            break;
          case "61":
            type = "Retreat";
            break;
          case "62":
            type = "InPosition";
            break;
        }
        return type;
      }
      return "";
    },
  },
  data() {
    return {
      height: "",
      infiniteheight: "",
    };
  },
  methods: {
    async changeText(config, val) {
      if (val !== undefined) {
        var array = [];
        var data = val.getInfo();
        var keys = Object.keys(data);
        keys.forEach((item) => {
          var i = config.filter((obj) => {
            return obj.prop == item;
          });
          if (i.length !== 0) {
            var value = "";
            if (item == "fullType") {
              value = val.getType();
            } else if (item == "collaborate") {
              value = data[item] == true ? "合作中" : "未配合";
            } else if (
              item == "linkOwners" ||
              item == "linkUsers" ||
              item == "linkFireManagers" ||
              item == "linkLivingUsers"
            ) {
              value = this.changeUserName(data[item]);
            } else if (item == "linkMaintainVendors") {
              value = this.changeContainUnit(data[item]);
            } else if (item == "linkRoles") {
              value = val.getRolesName();
            } else if (item == "linkKeeperUnits") {
              value = val.getKeeperUnitsName();
            } else if (item == "linkUsageOfFloors") {
              value = val.getUsageOfFloorsName();
            } else if (item == "linkDeviceTypes") {
              value = val.getLinkType().getSelectName();
            } else if (item == "linkBuildings") {
              value = val.getBuildingsName();
            } else if (
              item == "status" ||
              item == "inspectionPlaceCategory" ||
              item == "publicPlaceCategory"
            ) {
              if (val.constructor == Role) {
                value = data[item] == true ? "啟用中" : "未啟用";
              } else {
                value = this.changeOptionName(data[item]);
              }
            } else if (item == "removable") {
              value = data[item] == true ? "允許" : "禁止";
            } else if (item == "systemUsed") {
              value = data[item] == true ? "已使用" : "未使用";
            } else if (item == "revocation") {
              value = data[item] == true ? "已撤銷" : "未撤銷";
            } else if (item == "governmentApproval") {
              value = data[item] == true ? "是" : "否";
            } else if (item == "selfDeclared") {
              value = this.changeBoolean([
                data["selfInspectionDeclared"],
                data["selfPublicDeclared"],
              ]);
            } else if (
              item == "birthday" ||
              item == "dateOfPurchase" ||
              item == "dateOfWarranty" ||
              item == "useLicenseDate"
            ) {
              value = moment(data[item]).format("YYYY-MM-DD");
            } else {
              value = data[item] !== undefined ? data[item] : "";
            }
            array.push({
              label: i[0].label,
              value: value,
            });
          }
        });
        return array;
      }
    },
    async clickMessageBox(title, format, data) {
      console.log(title, format, data);
      if (data.length == 0) {
        this.$message({
          message: "無資料",
          type: "warning",
        });
      } else {
        const h = this.$createElement;
        const bigData = [];
        const { constr, config } = await this.changeRealData(data[0]);
        for await (let item of data) {
          const newDatas = [];
          var objData = await constr.getOfID(item.id);
          console.log(objData);
          var changetext = await this.changeText(config, objData);
          changetext.forEach((obj) => {
            newDatas.push(
              h("p", { style: "width:100%" }, [
                h(
                  "span",
                  {
                    style:
                      "width:40%;display:inline-block;vertical-align:top;word-break:break-all",
                  },
                  obj.label
                ),
                h(
                  "span",
                  {
                    style:
                      "width:60%;display:inline-block;vertical-align:top;word-break:break-all",
                  },
                  obj.value
                ),
              ])
            );
          });
          bigData.push(
            h(
              "div",
              { style: "border:1px solid;padding:10px;margin-bottom:5px" },
              newDatas
            )
          );
        }

        this.$msgbox({
          title: title,
          message: h(
            "div",
            { style: "max-height:500px;overflow-x:hidden;overflow-y:auto;" },
            bigData
          ),
          showCancelButton: true,
          distinguishCancelAndClose: true,
          confirmButtonText: "編輯",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              done();
              switch (format) {
                case "usageOfFloorUserInfo":
                case "commitUserInfo":
                case "userInfo": //住戶資料>平時管理-基本資料
                  if (this.buildinginfo == undefined) {
                    this.$message({
                      message: "請先選擇該棟建築物，才可對住戶進行編輯",
                      type: "warning",
                    });
                  } else if (
                    this.title == "floorOfHouse" ||
                    this.title == "committee"
                  ) {
                    //門牌資料>打開住戶資料
                    this.handleClickOption("openuser", data);
                  } else {
                    this.$router.push({
                      name: "basic",
                      params: { target: data, type: "user" },
                    });
                  }
                  break;
                case "deviceTypeSelect": //設備種類>設備管理-設備種類
                  this.$router.push({
                    name: "deviceTypesManagement",
                    params: { target: data, type: "open" },
                  });
                  break;
                //assignFireDeviceSelect
                case "deviceSelect":
                case "addressdeviceSelect": //設備>設備管理-設備清單 & 點位>設備管理-設備清單
                  this.$router.push({
                    name: "devicesManagement",
                    params: { target: data, type: "open" },
                  });
                  break;
                case "contactunitSelect": //廠商資料>平時管理-基本資料
                  this.$router.push({
                    name: "basic",
                    params: { target: data, type: "contactunit" },
                  });
                  break;
                case "committeeSelect":
                  this.$router.push({
                    name: "basic",
                    params: { target: data, type: "committee" },
                  });
                  break;
                case "floorOfHouseSelect": //門牌資料>打開當前視窗
                  if (this.title == "committee") {
                    this.handleClickOption("openfloorofhouse", data);
                  } else {
                    this.$router.push({
                      name: "basic",
                      params: { target: data, type: "floorOfHouse" },
                    });
                  }

                  break;
                case "roleSelect": //角色資料>權限設定-角色管理
                  this.$router.push({
                    name: "roleSetting",
                    params: { target: data, type: "open" },
                  });
                  break;
                case "inspectionSelect": //缺失內容>檢修申報
                  this.$router.push({
                    name: "ReportInspection",
                    params: { target: data, type: "open" },
                  });
                  break;
                case "buildingSelect":
                  if (this.id == 1) {
                    this.$router.push({
                      name: "sys-Building",
                      params: { target: data, type: "open" },
                    });
                  } else {
                    this.$message.error("您沒有權限編輯");
                  }
                  break;
              }
            } else {
              done();
            }
          },
        })
          .then((action) => {
            done();
          })
          .catch(() => {});
      }
    },
    async changeRealData(val) {
      console.log(val);
      var constr = val.constructor;
      var config = val.constructor.getTableConfig();
      return {
        constr: constr,
        config: config,
      };
    },
    optionfilter(format) {
      if (this.setting_record == 0) {
        this.$store.dispatch("building/setoptions");
        this.$store.dispatch("record/saveSettingRecord", 1);
      }
      if (format !== null) {
        let _array = this.buildingoptions.filter(
          (item, index) => item.classType == format
        );
        var options = _array.map((v) => {
          var str = v.textName;
          if (v.classType == "InspectionTypeOfTime") {
            var list = v.value.split("-");
            var array = list.map((item) => {
              return item + "月";
            });
            var _str = array.join("及");
            str = v.textName + "/每年" + _str + "前";
          } else if (v.classType == "PublicSafeTypeOfTime") {
            var list = v.value.split("-");
            str =
              v.textName +
              "/每" +
              list[0] +
              "年一次，" +
              list[1] +
              "月到" +
              list[2] +
              "月";
          }
          this.$set(v, "label", str);
          return v;
        });
        return options;
      } else {
        return "";
      }
    },
    //表格排序
    sortChange(column, data = null) {
      var self = this;
      var sortList = data == null ? this.blockData : data;
      var isLink = column.prop.indexOf("link") !== -1;
      if (isLink) {
        var obj = this.config.filter((item) => {
          return item.prop == column.prop;
        });
        var isMuti =
          obj[0].limit !== undefined
            ? obj[0].limit == 1
              ? false
              : true
            : false;
      }

      if (column.order === "descending") {
        sortList = sortList.sort(function (str1, str2) {
          var s1 =
            str1[column.prop] == null || str1[column.prop] == undefined
              ? ""
              : str1[column.prop];
          var s2 =
            str2[column.prop] == null || str2[column.prop] == undefined
              ? ""
              : str2[column.prop];
          if (isLink) {
            //有區分多選&單選
            if (!isMuti) {
              s1 = s1 !== "" ? s1[0].id : "";
              s2 = s2 !== "" ? s2[0].id : "";
              return self.sortRule(s2, s1);
            } else {
              return s2.length - s1.length;
            }
          } else {
            return self.sortRule(s2, s1);
          }
        });
      } else if (column.order === "ascending") {
        sortList = sortList.sort(function (str1, str2) {
          var s1 =
            str1[column.prop] == null || str1[column.prop] == undefined
              ? ""
              : str1[column.prop];
          var s2 =
            str2[column.prop] == null || str2[column.prop] == undefined
              ? ""
              : str2[column.prop];
          if (isLink) {
            //有區分多選&單選
            if (!isMuti) {
              s1 = s1 !== "" ? s1[0].id : "";
              s2 = s2 !== "" ? s2[0].id : "";
              return self.sortRule(s1, s2);
            } else {
              return s1.length - s2.length;
            }
          } else {
            return self.sortRule(s1, s2);
          }
        });
      }
    },
    sortRule(str1, str2) {
      let res = 0;
      for (let i = 0; ; i++) {
        if (!str1[i] || !str2[i]) {
          res = str1.length - str2.length;
          if (typeof str1 == "boolean" && typeof str2 == "boolean") {
            res = str1 - str2;
          }
          break;
        }
        const char1 = str1[i];
        const char1Type = this.getChartType(char1);
        const char2 = str2[i];
        const char2Type = this.getChartType(char2);

        if (char1Type[0] === char2Type[0]) {
          if (char1 === char2) {
            continue;
          } else {
            if (char1Type[0] === "zh") {
              res = char1.localeCompare(char2);
            } else if (char1Type[0] === "en") {
              res = char1.charCodeAt(0) - char2.charCodeAt(0);
            } else {
              res = char1 - char2;
            }
            break;
          }
        } else {
          // 类型不同的，直接用返回的数字相减
          res = char1Type[1] - char2Type[1];
          break;
        }
      }
      return res;
    },
    getChartType(char) {
      // 數字(0-9)->大寫字母(A->Z)->小寫字母(a->z)->中文拼音
      if (/^[\u4e00-\u9fa5]$/.test(char)) {
        return ["zh", 300];
      }
      if (/^[a-zA-Z]$/.test(char)) {
        return ["en", 200];
      }
      if (/^[0-9]$/.test(char)) {
        return ["number", 100];
      }
      return ["others", 999];
    },
  },
};
