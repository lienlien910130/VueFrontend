import api from "@/api";
import Parent from "./parent";
import { UsageOfFloor, Device } from ".";

class DeviceAddressManagement extends Parent {
  constructor(data) {
    super(data);
    const {
      internet,
      system,
      address,
      number,
      systemUsed,
      memeryLoc,
      iconId,
      valueType,
      value,
      valueLength,
      floorsId,
      area,
      isFDCC,
      linkDevices,
      linkUsageOfFloors,
    } = data;
    var devices =
      linkDevices !== undefined
        ? linkDevices.map((item) => {
            return new Device(item);
          })
        : [];
    var usageOfFloors =
      linkUsageOfFloors !== undefined
        ? linkUsageOfFloors.map((item) => {
            return new UsageOfFloor(item);
          })
        : [];
    this.internet = internet;
    this.system = system;
    this.address = address;
    this.number = number;
    this.systemUsed = systemUsed;
    this.floorsId = floorsId;
    this.value = value;
    this.valueType = valueType;
    this.memeryLoc = memeryLoc;
    this.iconId = iconId;
    this.valueLength = valueLength;
    this.area = area;
    this.isFDCC = isFDCC; //是否為防災盤訊號
    this.linkDevices = devices;
    this.linkUsageOfFloors = usageOfFloors;
  }
  clone(data) {
    return new DeviceAddressManagement(data);
  }
  async update(content) {
    const { deviceId, resetLink, isPLC } = content;
    var temp = JSON.parse(JSON.stringify(this));
    if (!isPLC) {
      temp.internet = "{Check}" + temp.internet;
      temp.system = "{Check}" + temp.system;
      temp.address = "{Check}" + temp.address;
      temp.number = "{Check}" + temp.number;
      temp.isFDCC = "{Check}" + temp.isFDCC;
      if (temp.isFDCC) {
        temp.memeryLoc = "{Check}" + temp.memeryLoc;
      }
      var data = await api.device
        .apiPutDevicesAddress(deviceId, resetLink, temp)
        .then(async (response) => {
          return new DeviceAddressManagement(response.result);
        })
        .catch((error) => {
          return {};
        });
      return data;
    } else {
      temp.internet = "{Check}" + temp.internet;
      temp.system = "{Check}" + temp.system;
      temp.memeryLoc = "{Check}" + temp.memeryLoc;
      temp.isFDCC = "{Check}" + temp.isFDCC;
      var data = await api.device
        .apiPutDevicesPLCAddress(deviceId, resetLink, temp)
        .then(async (response) => {
          return new DeviceAddressManagement(response.result);
        })
        .catch((error) => {
          return {};
        });
      return data;
    }
  }
  async create(content) {
    const { deviceId, isPLC } = content;
    var temp = JSON.parse(JSON.stringify(this));
    if (!isPLC) {
      temp.internet = "{Check}" + temp.internet;
      temp.system = "{Check}" + temp.system;
      temp.address = "{Check}" + temp.address;
      temp.number = "{Check}" + temp.number;
      temp.isFDCC = "{Check}" + temp.isFDCC;
      if (temp.isFDCC) {
        temp.memeryLoc = "{Check}" + temp.memeryLoc;
      }
      var data = await api.device
        .apiPostDevicesAddress(deviceId, temp)
        .then((response) => {
          return new DeviceAddressManagement(response.result);
        })
        .catch((error) => {
          return {};
        });
      return data;
    } else {
      temp.internet = "{Check}" + temp.internet;
      temp.system = "{Check}" + temp.system;
      temp.memeryLoc = "{Check}" + temp.memeryLoc;
      temp.isFDCC = "{Check}" + temp.isFDCC;
      var data = await api.device
        .apiPostDevicesPLCAddress(deviceId, temp)
        .then((response) => {
          return new DeviceAddressManagement(response.result);
        })
        .catch((error) => {
          return {};
        });
      return data;
    }
  }
  async delete(isPLC = null) {
    if (isPLC == null) {
      var data = await api.device
        .apiDeleteDevicesAddress(this.id)
        .then(async (response) => {
          return true;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } else {
      var data = await api.device
        .apiDeleteDevicesPLCAddress(this.id)
        .then(async (response) => {
          return true;
        })
        .catch((error) => {
          return false;
        });
      return data;
    }
  }
  getAddressStr() {
    var str = [this.system, this.address, this.number];
    str = str.filter(Boolean).join("-");
    return str;
  }
  static empty() {
    return new DeviceAddressManagement({
      id: "",
      internet: "",
      system: "",
      address: "",
      number: "",
      systemUsed: false,
      floorsId: null,
      valueType: "bit",
      value: "status",
      memeryLoc: null,
      iconId: "",
      area: "",
      valueLength: null,
      isFDCC: false,
      linkDevices: [],
      linkUsageOfFloors: [],
      linkAssignDevices: [],
    });
  }
  static getTableConfig() {
    return [
      {
        label: "火警總機",
        prop: "linkAssignDevices",
        formType: "singleChoice",
        format: "assignFireDeviceSelect",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: true,
        message: "請選擇火警總機",
        type: "object",
        typemessage: "",
        hasEvent: true,
        isCheck: true,
        isUpload: false,
        isExport: false,
      },
      {
        label: "樓層",
        prop: "floorsId",
        formType: "selectString",
        format: "floorSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇樓層",
        type: "string",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "點位類型",
        prop: "isFDCC",
        formType: "boolean",
        format: "mainSelect",
        isTable: true,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇點位類型",
        type: "boolean",
        typemessage: "",
        hasEvent: true,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "點位",
        prop: "addressStr",
        formType: "addressStr",
        format: "addressStr",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: false,
        message: "請輸入完整的點位資訊",
        type: "string",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: false,
      },
      {
        label: "總機",
        prop: "internet",
        formType: "inputString",
        format: "internetNumber",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: true,
        message: "請輸入總機",
        maxlength: "5",
        placeholder: "請輸入總機編號",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "系統",
        prop: "system",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        maxlength: "5",
        placeholder: "請輸入系統編號",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "位址",
        prop: "address",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        maxlength: "5",
        placeholder: "請輸入位址編號",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "編號",
        prop: "number",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        maxlength: "5",
        placeholder: "請輸入編號",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "記憶體位址",
        prop: "memeryLoc",
        formType: "inputString",
        isTable: false,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "6",
        placeholder: "請輸入0000~FFFF",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "空間描述",
        prop: "area",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "50",
        placeholder: "請輸入空間描述",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "類型",
        prop: "value",
        formType: "selectString",
        format: "valueType",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: true,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇類型",
        placeholder: "請選擇類型",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "圖示",
        prop: "iconId",
        formType: "selectString",
        format: "iconSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: true,
        message: "請選擇圖示",
        type: "string",
        typemessage: "",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "圖控設置",
        prop: "systemUsed",
        formType: "boolean",
        format: "systemUsedBoolean",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: false,
        mandatory: false,
        type: "boolean",
        typemessage: "",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "設備",
        prop: "linkDevices",
        formType: "singleChoice",
        format: "addressdeviceSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇設備",
        type: "object",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "門牌",
        prop: "linkUsageOfFloors",
        formType: "select",
        format: "floorOfHouseSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: false,
        type: "array",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
    ];
  }
  static getManyEmptyTableConfig() {
    return [
      {
        label: "火警總機",
        prop: "linkAssignDevices",
        formType: "singleChoice",
        format: "assignFireDeviceSelect",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: true,
        message: "請選擇火警總機",
        type: "object",
        typemessage: "",
        hasEvent: true,
        isCheck: true,
        isUpload: false,
        isExport: false,
      },
      {
        label: "樓層",
        prop: "floorsId",
        formType: "selectString",
        format: "floorSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇樓層",
        type: "string",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "總機",
        prop: "internet",
        formType: "inputString",
        format: "internetNumber",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入總機編號",
        maxlength: "5",
        placeholder: "請輸入總機編號",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "系統",
        prop: "system",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入起始值-結束值",
        maxlength: "11",
        placeholder: "請輸入起始值-結束值",
        isPattern: true,
        pattern: /^\d*\-\d*$/g,
        errorMsg: "請輸入起始值-結束值",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "位址",
        prop: "address",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入起始值-結束值",
        maxlength: "11",
        placeholder: "請輸入起始值-結束值",
        isPattern: true,
        pattern: /^\d*\-\d*$/g,
        errorMsg: "請輸入起始值-結束值",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "編號",
        prop: "number",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "11",
        placeholder: "請輸入起始值-結束值",
        isPattern: true,
        pattern: /^\d*\-\d*$/g,
        errorMsg: "請輸入起始值-結束值",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "類型",
        prop: "value",
        formType: "selectString",
        format: "valueType",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: true,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇類型",
        placeholder: "請選擇類型",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
    ];
  }
  static getPLCTableConfig() {
    return [
      {
        label: "PLC",
        prop: "linkAssignDevices",
        formType: "singleChoice",
        format: "assignPLCDeviceSelect",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: true,
        message: "請選擇PLC",
        type: "object",
        typemessage: "",
        hasEvent: true,
        isCheck: true,
        isUpload: false,
        isExport: false,
      },
      {
        label: "樓層",
        prop: "floorsId",
        formType: "selectString",
        format: "floorSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇樓層",
        type: "string",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "點位",
        prop: "addressStr",
        formType: "addressStr",
        format: "addressStr",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: false,
        type: "string",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: false,
      },
      {
        label: "總機",
        prop: "internet",
        formType: "inputString",
        format: "internetNumber",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        maxlength: "5",
        placeholder: "請輸入總機編號",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "系統",
        prop: "system",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        maxlength: "5",
        placeholder: "請輸入系統編號",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "位址",
        prop: "address",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        maxlength: "5",
        placeholder: "請輸入位址編號",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "編號",
        prop: "number",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        maxlength: "5",
        placeholder: "請輸入編號",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "記憶體位址",
        prop: "memeryLoc",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "5",
        placeholder: "請輸入記憶體位址",
        isPattern: true,
        pattern: /^[0-9]*$/g,
        errorMsg: "請輸入0-9之間的字元",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "記憶體長度",
        prop: "valueLength",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: false,
        maxlength: "10",
        placeholder: "請輸入記憶體長度",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "空間描述",
        prop: "area",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "50",
        placeholder: "請輸入空間描述",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "類型",
        prop: "value",
        formType: "selectString",
        format: "valueType",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: true,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇類型",
        placeholder: "請選擇類型",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "值",
        prop: "valueType",
        formType: "selectString",
        format: "valueSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: false,
        type: "string",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "圖示",
        prop: "iconId",
        formType: "selectString",
        format: "iconSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: true,
        message: "請選擇圖示",
        type: "string",
        typemessage: "",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "圖控設置",
        prop: "systemUsed",
        formType: "boolean",
        format: "systemUsedBoolean",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: false,
        mandatory: false,
        type: "boolean",
        typemessage: "",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "設備",
        prop: "linkDevices",
        formType: "singleChoice",
        format: "addressdeviceSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇設備",
        type: "object",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "門牌",
        prop: "linkUsageOfFloors",
        formType: "select",
        format: "floorOfHouseSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: false,
        type: "array",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
    ];
  }
  static getChName() {
    return "點位";
  }
  static async getOfID(deviceAddressId, isPLC = null) {
    if (isPLC == null) {
      var data = await api.device
        .apiGetDevicesAddress(deviceAddressId)
        .then((response) => {
          var array = response.result.map((item) => {
            return new DeviceAddressManagement(item);
          });
          return array[0];
        })
        .catch((error) => {
          return [];
        });
      return data;
    } else {
      var data = await api.device
        .apiGetDevicesPLCAddress(deviceAddressId)
        .then((response) => {
          var array = response.result.map((item) => {
            return new DeviceAddressManagement(item);
          });
          return array[0];
        })
        .catch((error) => {
          return [];
        });
      return data;
    }
  }
  static async getSearchPage(data, isPLC = null) {
    if (isPLC == null) {
      var data = await api.device
        .apiGetDevicesAddressSearchPages(data)
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
        .apiGetDevicesPLCAddressSearchPages(data)
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
  static async deleteMany(data, isPLC = null) {
    if (isPLC == null) {
      var data = await api.device
        .apiDeleteDevicesAddress(data)
        .then(async (response) => {
          return true;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } else {
      var data = await api.device
        .apiDeleteDevicesPLCAddress(data)
        .then(async (response) => {
          return true;
        })
        .catch((error) => {
          return false;
        });
      return data;
    }
  }
  static async postMany(data) {
    const { deviceId, content, isPLC } = data;
    if (!isPLC) {
      var data = await api.device
        .apiPostDevicesAddresses(deviceId, content)
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
        .apiPostDevicesPLCAddresses(deviceId, content)
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
  static async batchInsert(deviceId, data, isPLC = null) {
    if (isPLC == null) {
      var data = await api.device
        .apiPostDevicesAddressesBatchInsert(deviceId, data)
        .then((response) => {
          return true;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } else {
      var data = await api.device
        .apiPostDevicesPLCAddressesBatchInsert(deviceId, data)
        .then((response) => {
          return true;
        })
        .catch((error) => {
          return false;
        });
      return data;
    }
  }
  static async updateMany(deviceId, data, isPLC = null) {
    if (isPLC == null) {
      var data = await api.device
        .apiPatchDevicesAddress(deviceId, data)
        .then(async (response) => {
          response.result = response.result.map((item) => {
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
        .apiPatchDevicesPLCAddress(deviceId, data)
        .then(async (response) => {
          response.result = response.result.map((item) => {
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
}

export default DeviceAddressManagement;
