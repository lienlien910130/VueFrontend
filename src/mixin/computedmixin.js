// const Vuex = require('vuex')
const moment = require("moment");
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
    ]),
    dataStr() {
      //日期
      return function (a, b) {
        if (a !== null && a !== undefined) {
          return moment(a).format(b);
        } else {
          return "";
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
        }
      };
    },
    changeShowFormatString() {
      return function (format, row, prop) {
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
        if (value !== null) {
          let _array = this.buildingoptions.filter(
            (item, index) => item.id == value
          );
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
        if (value !== null) {
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
        if (val !== null) {
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
        if (val !== null) {
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
            : (this.infiniteheight = 850);
        } else {
          this.title == "committee" ||
          this.title == "contactUnit" ||
          this.title == "floorOfHouse" ||
          this.title == "user"
            ? (this.infiniteheight = 510)
            : (this.infiniteheight = 710);
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
        }
      } else {
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
    //表格排序
    sortChange(column, data = null) {
      var self = this;
      var sortList = data == null ? this.blockData : data;
      if (column.order === "descending") {
        sortList = sortList.sort(function (str1, str2) {
          var s1 = str1[column.prop] == null ? "" : str1[column.prop];
          var s2 = str2[column.prop] == null ? "" : str2[column.prop];
          return self.sortRule(s2, s1);
        });
      } else if (column.order === "ascending") {
        sortList = sortList.sort(function (str1, str2) {
          var s1 = str1[column.prop] == null ? "" : str1[column.prop];
          var s2 = str2[column.prop] == null ? "" : str2[column.prop];
          return self.sortRule(s1, s2);
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
