import Parent from "./parent";
import DeviceType from "./deviceType";
import api from "@/api";
import Contactunit from "./contactunit";
const moment = require("moment");
import { MaintainManagement } from "@/object/maintainManagement";
import DeviceAddressManagement from "@/object/deviceAddressManagement";
import { Committee } from ".";

class Device extends Parent {
  constructor(data) {
    super(data);
    const {
      name,
      dateOfPurchase,
      dateOfWarranty,
      location,
      groupID,
      ip,
      port,
      normalValue,
      tolerance,
      status,
      lastMaintainTime,
      nextMaintainTime,
      internetNumber,
      linkKeeperUnits,
      linkMaintainVendors,
      linkDeviceTypes,
    } = data;
    var deviceType =
      linkDeviceTypes !== undefined
        ? linkDeviceTypes.map((item) => {
            return new DeviceType(item);
          })
        : [];
    var keeperUnits =
      linkKeeperUnits !== undefined
        ? linkKeeperUnits.map((item) => {
            return new Committee(item);
          })
        : [];
    var maintainVendors =
      linkMaintainVendors !== undefined
        ? linkMaintainVendors.map((item) => {
            return new Contactunit(item);
          })
        : [];
    this.name = name;
    this.dateOfPurchase = dateOfPurchase;
    this.dateOfWarranty = dateOfWarranty;
    this.location = location;
    this.groupID = groupID;
    this.status = status;
    this.ip = ip;
    this.port = port;
    this.normalValue = normalValue;
    this.tolerance = tolerance;
    this.lastMaintainTime = lastMaintainTime;
    this.nextMaintainTime = nextMaintainTime;
    this.internetNumber = internetNumber;
    this.linkKeeperUnits = keeperUnits;
    this.linkMaintainVendors = maintainVendors;
    this.linkDeviceTypes = deviceType;
  }
  clone(data) {
    return new Device(data);
  }
  async update(resetLink) {
    var temp = JSON.parse(JSON.stringify(this));
    if (
      temp.internetNumber !== null &&
      temp.internetNumber !== undefined &&
      temp.internetNumber !== ""
    )
      temp.internetNumber = "{Check}" + temp.internetNumber;
    var data = await api.device
      .apiPatchDevicesManagement(temp, resetLink)
      .then(async (response) => {
        return new Device(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async create() {
    var temp = JSON.parse(JSON.stringify(this));
    if (temp.internetNumber !== null && temp.internetNumber !== undefined)
      temp.internetNumber = "{Check}" + temp.internetNumber;
    var data = await api.device
      .apiPostDevicesManagement(temp)
      .then((response) => {
        return new Device(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.device
      .apiDeleteDevicesManagement(this.id)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  async getMaintain(deviceId, data) {
    data.id = this.id;
    var data = await api.device
      .apiGetDevicesManagementMaintain(deviceId, data)
      .then((response) => {
        console.log(response);
        response.result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new MaintainManagement(item);
          });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  async getDeviceAddresss(data, type) {
    data.id = this.id;
    data.internetNumber =
      this.internetNumber !== "" && this.internetNumber !== null
        ? this.internetNumber
        : null;
    if (type == "fire") {
      var data = await api.device
        .apiGetLinkDeviceAddresss(data)
        .then((response) => {
          response.result = response.result
            .sort((x, y) => x.id - y.id)
            .map((item) => {
              return new DeviceAddressManagement(item);
            });
          return response;
        })
        .catch((error) => {
          return [];
        });
      return data;
    } else {
      var data = await api.device
        .apiGetLinkDevicePLCAddresss(data)
        .then((response) => {
          response.result = response.result
            .sort((x, y) => x.id - y.id)
            .map((item) => {
              return new DeviceAddressManagement(item);
            });
          return response;
        })
        .catch((error) => {
          return [];
        });
      return data;
    }
  }
  getOnlyName() {
    //設備名稱
    return this.name;
  }
  getOnlyTypeName() {
    //設備種類名稱
    return this.linkDeviceTypes.length !== 0
      ? this.linkDeviceTypes[0].getName()
      : "尚未設定種類";
  }
  getType() {
    //設備種類
    return this.linkDeviceTypes.length !== 0
      ? this.linkDeviceTypes[0].getType()
      : "";
  }
  getDateOfPurchase() {
    return moment(this.dateOfPurchase).format("YYYY-MM-DD");
  }
  getDateOfWarranty() {
    return moment(this.dateOfWarranty).format("YYYY-MM-DD");
  }
  //首頁tree使用
  getKeeperUnitsName() {
    return this.linkKeeperUnits
      .map((item) => {
        return item.getName();
      })
      .toString();
  }
  getMaintainVendorsName() {
    return this.linkMaintainVendors
      .map((item) => {
        return item.getName();
      })
      .toString();
  }
  getLinkType() {
    return this.linkDeviceTypes.length !== 0
      ? this.linkDeviceTypes[0]
      : DeviceType.empty();
  }
  getName() {
    //組合過的名稱：設備種類名稱+設備名稱
    var name =
      this.linkDeviceTypes.length !== 0
        ? "【" + this.linkDeviceTypes[0].getName() + "】" + this.name
        : "【尚未設定設備種類】" + this.name;
    return name;
  }
  getInternetNumber() {
    return this.internetNumber !== null ? this.internetNumber : null;
  }
  static empty() {
    return new Device({
      id: "",
      name: "",
      dateOfPurchase: null,
      dateOfWarranty: null,
      location: "",
      lastMaintainTime: null,
      nextMaintainTime: null,
      ip: null,
      port: null,
      normalValue: null,
      tolerance: null,
      internetNumber: null,
      linkKeeperUnits: [],
      linkMaintainVendors: [],
      linkDeviceTypes: [],
    });
  }
  static getTableConfig() {
    return [
      {
        label: "名稱",
        prop: "name",
        mandatory: true,
        message: "請輸入名稱",
        isHidden: false,
        maxlength: "20",
        isSearch: true,
        placeholder: "請輸入名稱",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
      },
      {
        label: "種類",
        prop: "linkDeviceTypes",
        format: "deviceTypeSelect",
        mandatory: true,
        message: "請選擇種類",
        isHidden: false,
        type: "object",
        typemessage: "",
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "singleChoice",
        limit: 1,
        selectFilter: true,
        hasEvent: true,
      },
      {
        label: "網路編號",
        prop: "internetNumber",
        format: "internetNumber",
        mandatory: false,
        message: "請輸入網路編號",
        isHidden: true,
        isSearch: true,
        maxlength: "5",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
      },
      {
        label: "IP",
        prop: "ip",
        mandatory: false,
        message: "請輸入IP",
        isHidden: true,
        maxlength: "15",
        isSearch: true,
        placeholder: "請輸入IP",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
      },
      {
        label: "Port",
        prop: "port",
        format: "inputnumber",
        pattern: /^[0-9]{1,5}$/,
        errorMsg: "請輸入0~99999",
        isPattern: true,
        type: "number",
        typemessage: "",
        placeholder: "請輸入0~99999",
        maxlength: "5",
        mandatory: false,
        message: "請輸入Port",
        isHidden: true,
        isSearch: false,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "inputNumber",
        selectFilter: false,
      },
      {
        label: "標準值",
        prop: "normalValue",
        format: "inputnumber",
        pattern: /^[0-9]{1,4}$/,
        errorMsg: "請輸入0~9999",
        isPattern: true,
        type: "number",
        typemessage: "",
        placeholder: "請輸入0~9999",
        maxlength: "4",
        mandatory: false,
        message: "請輸入標準值",
        isHidden: true,
        isSearch: false,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "inputNumber",
        selectFilter: false,
      },
      {
        label: "誤差值",
        prop: "tolerance",
        format: "inputnumber",
        pattern: /^[0-9]{1,4}$/,
        errorMsg: "請輸入0~9999",
        isPattern: true,
        type: "number",
        typemessage: "",
        placeholder: "請輸入0~9999",
        maxlength: "4",
        mandatory: false,
        message: "請輸入誤差值",
        isHidden: true,
        isSearch: false,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "inputNumber",
        selectFilter: false,
      },
      {
        label: "購買日期",
        prop: "dateOfPurchase",
        format: "YYYY-MM-DD",
        mandatory: false,
        isHidden: false,
        isSearch: true,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "date",
        selectFilter: false,
      },
      {
        label: "保固日期",
        prop: "dateOfWarranty",
        format: "YYYY-MM-DD",
        mandatory: false,
        message: "請輸入保固日期",
        isHidden: false,
        isSearch: true,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "date",
        selectFilter: false,
      },
      {
        label: "位置設置",
        prop: "location",
        mandatory: false,
        isHidden: true,
        maxlength: "20",
        isSearch: true,
        placeholder: "請輸入位置設置",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        selectFilter: false,
      },
      {
        label: "分類群組",
        prop: "groupID",
        mandatory: false,
        isHidden: false,
        maxlength: "10",
        isSearch: true,
        placeholder: "請輸入分類群組",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        selectFilter: false,
      },
      {
        label: "保管單位",
        prop: "linkKeeperUnits",
        format: "committeeSelect",
        mandatory: true,
        trigger: "change",
        message: "請選擇保管單位",
        type: "object",
        typemessage: "",
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "singleChoice",
        limit: 1,
        selectFilter: true,
      },
      {
        label: "維護廠商",
        prop: "linkMaintainVendors",
        format: "contactunitSelect",
        mandatory: true,
        trigger: "change",
        message: "請選擇維護廠商",
        type: "array",
        typemessage: "",
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "select",
        limit: 1,
        selectFilter: true,
      },
      {
        label: "設備狀況",
        prop: "status",
        format: "MaintainProcessOptions",
        mandatory: false,
        message: "請選擇設備狀況",
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: false,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "selectSetting",
        selectFilter: true,
      },
      {
        label: "下次保養時間",
        prop: "nextMaintainTime",
        format: "YYYY-MM-DD",
        mandatory: false,
        message: "請輸入保養時間",
        isHidden: false,
        isSearch: true,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "date",
        selectFilter: false,
      },
      {
        label: "最後保養時間",
        prop: "lastMaintainTime",
        format: "YYYY-MM-DD",
        mandatory: false,
        isHidden: false,
        isSearch: true,
        isAssociate: false,
        isEdit: false,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "date",
        selectFilter: false,
      },
    ];
  }
  static async get() {
    var data = await api.device
      .apiGetBuildingDevicesManagement()
      .then((response) => {
        var array = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new Device(item);
          });
        return array;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getOfID(id) {
    var data = await api.device
      .apiGetDevicesOfID(id)
      .then((response) => {
        return new Device(response.result[0]);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  static async getSearchPage(data) {
    var data = await api.device
      .apiGetDevicesManagementSearchPages(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Device(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async postMany(data) {
    var data = await api.device
      .apiPostDevicesManagements(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Device(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async deleteMany(data) {
    var data = await api.device
      .apiDeleteDevicesManagement(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static async updatefromGraphic(data) {
    var data = await api.device
      .apiPatchGraphicDevices(data)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default Device;
