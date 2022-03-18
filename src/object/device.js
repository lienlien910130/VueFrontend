import Parent from "./parent";
import DeviceType from "./deviceType";
import api from "@/api";
import Contactunit from "./contactunit";
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
  async update(content) {
    const { resetLink } = content;
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
        : "【尚未設定種類】" + this.name;
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
        label: "種類",
        prop: "linkDeviceTypes",
        formType: "singleChoice",
        format: "deviceTypeSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇種類",
        type: "object",
        typemessage: "",
        hasEvent: true,
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "名稱",
        prop: "name",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入名稱",
        maxlength: "20",
        placeholder: "請輸入名稱",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "網路編號",
        prop: "internetNumber",
        formType: "inputString",
        format: "internetNumber",
        isTable: false,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: false,
        maxlength: "5",
        placeholder: "請輸入網路編號",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "IP",
        prop: "ip",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: false,
        maxlength: "15",
        placeholder: "請輸入IP",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "Port",
        prop: "port",
        formType: "inputNumber",
        format: "inputnumber",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: false,
        maxlength: "5",
        placeholder: "請輸入0~65535",
        type: "number",
        typemessage: "",
        isPattern: true,
        pattern: /^[0-9]{1,5}$/,
        errorMsg: "請輸入0~65535",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "標準值",
        prop: "normalValue",
        formType: "inputNumber",
        format: "inputnumber",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: false,
        maxlength: "4",
        placeholder: "請輸入0~9999",
        type: "number",
        typemessage: "",
        isPattern: true,
        pattern: /^[0-9]{1,4}$/,
        errorMsg: "請輸入0~9999",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "誤差值",
        prop: "tolerance",
        formType: "inputNumber",
        format: "inputnumber",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: false,
        maxlength: "4",
        placeholder: "請輸入0~9999",
        type: "number",
        typemessage: "",
        isPattern: true,
        pattern: /^[0-9]{1,4}$/,
        errorMsg: "請輸入0~9999",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "購買日期",
        prop: "dateOfPurchase",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "保固日期",
        prop: "dateOfWarranty",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "位置設置",
        prop: "location",
        formType: "inputString",
        isTable: true,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "20",
        placeholder: "請輸入位置設置",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "保管單位",
        prop: "linkKeeperUnits",
        formType: "singleChoice",
        format: "committeeSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇保管單位",
        type: "object",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "維護廠商",
        prop: "linkMaintainVendors",
        formType: "select",
        format: "contactunitSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇維護廠商",
        type: "array",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "設備狀況",
        prop: "status",
        formType: "selectSetting",
        format: "MaintainProcessOptions",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: false,
        mandatory: false,
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "下次保養時間",
        prop: "nextMaintainTime",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "最後保養時間",
        prop: "lastMaintainTime",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
    ];
  }
  static getChName() {
    return "設備";
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
}

export default Device;
