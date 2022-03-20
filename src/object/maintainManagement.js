import api from "@/api";
import Parent from "./parent";
const moment = require("moment");
import Files from "./files";
import Device from "./device";
import Contactunit from "./contactunit";
import InspectionLacks from "./inspectionLacks";
import Inspection from "./inspection";

//大項
class MaintainManagementList extends Parent {
  constructor(data) {
    super(data);
    const {
      name,
      createdDate,
      completedCount,
      maintainType,
      allCount,
      linkMaintains,
      reportSelectId,
    } = data;
    var maintain =
      linkMaintains !== undefined
        ? linkMaintains.map((item) => {
            return new MaintainManagement(item);
          })
        : [];
    this.name = name;
    this.createdDate = createdDate;
    this.completedCount = completedCount;
    this.maintainType = maintainType;
    this.allCount = allCount;
    this.linkMaintains = maintain;
    this.reportSelectId = reportSelectId;
  }
  clone(data) {
    return new MaintainManagementList(data);
  }
  getName() {
    return this.name;
  }
  async update() {
    var data = await api.device
      .apiPatchMaintainsList(this)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  async create() {
    var data = await api.device
      .apiPostMaintainsList(this)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  async createReport(InspectionListId) {
    let data = await api.device
      .apiPostInspectionListImport(this, InspectionListId)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  async delete() {
    var data = await api.device
      .apiDeleteMaintainsList(this.id)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  async files() {
    var data = await api.files
      .apiGetMaintainsListFiles(this.id)
      .then((response) => {
        return response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new Files(item);
          });
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  async createfiles(data) {
    var data = await api.files
      .apiPostMaintainsListFiles(this.id, data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static empty() {
    return new MaintainManagementList({
      id: "",
      name: "",
      createdDate: moment().format("YYYY-MM-DD"),
      completedCount: 0,
      maintainType: "維護保養",
      allCount: 0,
      linkMaintains: [],
      reportSelectId: null,
    });
  }
  static getTableConfig() {
    return [
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
        maxlength: "40",
        placeholder: "請輸入名稱",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "建立時間",
        prop: "createdDate",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇建立時間",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "類別",
        prop: "maintainType",
        formType: "radio",
        format: "maintainTypeRadio",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: true,
        message: "請勾選類別",
        hasEvent: true,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "已保養細項",
        prop: "completedCount",
        formType: "inputString",
        isTable: false,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        type: "number",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "保養細項總數",
        prop: "allCount",
        formType: "inputString",
        format: "openmaintain",
        isTable: false,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        type: "number",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
    ];
  }
  static getCreateConfig() {
    return [
      {
        label: "名稱",
        prop: "name",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: true,
        message: "請輸入名稱",
        maxlength: "40",
        placeholder: "請輸入名稱",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "建立時間",
        prop: "createdDate",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇建立時間",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "類別",
        prop: "maintainType",
        formType: "radio",
        format: "maintainTypeRadio",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請勾選類別",
        hasEvent: true,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "申報改善單",
        prop: "reportSelectId",
        format: "maintainReportSelect",
        formType: "selectString",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: true,
        isShow: false,
        isEdit: false,
        mandatory: false,
        type: "string",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
    ];
  }
  static async post(data) {
    var data = await api.device
      .apiPostMaintainsList(data)
      .then((response) => {
        return response.result.id;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async get() {
    var data = await api.device
      .apiGetBuildingMaintainsList()
      .then((response) => {
        var array = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new MaintainManagementList(item);
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
      .apiGetMaintainsList(id)
      .then((response) => {
        console.log("getOfID");
        console.log(JSON.stringify(response));
        return [];
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getSearchPage(data) {
    var data = await api.device
      .apiGetMaintainsListSearchPages(data)
      .then((response) => {
        response.result = response.result
          .sort((x, y) => y.id - x.id)
          .map((item) => {
            return new MaintainManagementList(item);
          });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getAllLack() {
    var data = await api.device
      .apiGetInspectionListByMaintain()
      .then((response) => {
        return response.result.sort((x, y) => y.id - x.id);
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getReminder(type) {
    var data = await api.device
      .apiGetMaintainsListRemind(type)
      .then((response) => {
        //照下次維保時間排序
        response.result.needMaintainDeviceLsit =
          response.result.needMaintainDeviceLsit
            .sort(function (a, b) {
              return (
                new Date(a.nextMaintainTime) - new Date(b.nextMaintainTime)
              );
            })
            .map((item) => {
              return new Device(item);
            });
        return response.result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getReportInspection() {
    let data = await api.device
      .apiPostMaintainReportInspection()
      .then((response) => {
        response.result = response.result
          .sort((x, y) => new Date(y.declareDate) - new Date(x.declareDate))
          .map((item) => {
            return new Inspection(item);
          });
        return response.result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
}

//細項
class MaintainManagement extends Parent {
  constructor(data) {
    super(data);
    const {
      dateOfFailure,
      dateOfCallRepair,
      completedTime,
      processStatus,
      processContent,
      note,
      nextMaintainTime,
      linkDevices,
      linkInspectionLacks,
      linkContactUnits,
    } = data;
    var devices =
      linkDevices !== undefined
        ? linkDevices.map((item) => {
            return new Device(item);
          })
        : [];
    var contactUnits =
      linkContactUnits !== undefined
        ? linkContactUnits.map((item) => {
            return new Contactunit(item);
          })
        : [];
    var inspectionLacks =
      linkInspectionLacks !== undefined
        ? linkInspectionLacks.map((item) => {
            return new InspectionLacks(item);
          })
        : [];
    this.dateOfFailure = dateOfFailure !== undefined ? dateOfFailure : null;
    this.dateOfCallRepair =
      dateOfCallRepair !== undefined ? dateOfCallRepair : null;
    this.completedTime = completedTime !== undefined ? completedTime : null;
    this.processStatus = processStatus !== undefined ? processStatus : null;
    this.processContent = processContent !== undefined ? processContent : null;
    this.note = note;
    this.nextMaintainTime = nextMaintainTime;
    this.linkDevices = devices;
    this.linkInspectionLacks = inspectionLacks;
    this.linkContactUnits = contactUnits;
  }
  clone(data) {
    return new MaintainManagement(data);
  }
  async update() {
    var data = await api.device
      .apiPatchMaintains(this)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  async create(maintainListId) {
    var data = await api.device
      .apiPostMaintain(maintainListId, this)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  async delete() {
    var data = await api.device
      .apiDeleteMaintains(this.id)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  async files() {
    var data = await api.files
      .apiGetMaintainsFiles(this.id)
      .then((response) => {
        return response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new Files(item);
          });
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  async createfiles(data) {
    var data = await api.files
      .apiPostMaintainsFiles(this.id, data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  getDevicesName() {
    return this.linkDevices.map((item) => item.getOnlyName()).toString();
  }
  static empty() {
    return new MaintainManagement({
      id: "",
      dateOfFailure: null,
      dateOfCallRepair: null,
      completedTime: null,
      processStatus: "",
      processContent: "",
      note: "",
      linkDevices: [],
      linkInspectionLacks: [],
      linkContactUnits: [],
    });
  }
  static getTableConfig() {
    return [
      {
        label: "系統",
        prop: "processContent",
        formType: "selectSetting",
        format: "MaintainContentOptions",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇系統",
        type: "string",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "故障日期",
        prop: "dateOfFailure",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        hasEvent: true,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "叫修日期",
        prop: "dateOfCallRepair",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        hasEvent: true,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "完成日期",
        prop: "completedTime",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        hasEvent: true,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "處理進度",
        prop: "processStatus",
        formType: "selectSetting",
        format: "MaintainProcessOptions",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: false,
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "改善廠商",
        prop: "linkContactUnits",
        formType: "singleChoice",
        format: "contactunitSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: false,
        type: "object",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "缺失內容",
        prop: "linkInspectionLacks",
        formType: "singleChoice",
        format: "inspectionSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: false,
        type: "object",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "設備",
        prop: "linkDevices",
        formType: "singleChoice",
        format: "deviceSelect",
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
        hasEvent: true,
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
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "備註",
        prop: "note",
        formType: "inputString",
        format: "textarea",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "200",
        isCheck: false,
        isUpload: true,
        isExport: true,
      }
    ];
  }
  static getDeviceOfMaintainTableConfig() {
    return [
      {
        label: "系統",
        prop: "processContent",
        formType: "selectSetting",
        format: "MaintainContentOptions",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇系統",
        type: "string",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "故障日期",
        prop: "dateOfFailure",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        hasEvent: true,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "叫修日期",
        prop: "dateOfCallRepair",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        hasEvent: true,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "完成日期",
        prop: "completedTime",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        hasEvent: true,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "處理進度",
        prop: "processStatus",
        formType: "selectSetting",
        format: "MaintainProcessOptions",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: false,
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "改善廠商",
        prop: "linkContactUnits",
        formType: "singleChoice",
        format: "contactunitSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: false,
        type: "object",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "缺失內容",
        prop: "linkInspectionLacks",
        formType: "singleChoice",
        format: "inspectionSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: false,
        type: "object",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "備註",
        prop: "note",
        formType: "inputString",
        format: "textarea",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "200",
        isCheck: false,
        isUpload: true,
        isExport: true,
      }
    ];
  }
  static async get() {
    var data = await api.device
      .apiGetMaintainAll()
      .then((response) => {
        var array = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new MaintainManagement(item);
          });
        return array;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getOfID(maintainId) {
    var data = await api.device
      .apiGetMaintains(maintainId)
      .then((response) => {
        var array = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new MaintainManagement(item);
          });
        return array[0];
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getAllSearchPage(data) {
    var data = await api.device
      .apiGetMaintainAllSearchPages(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          if (item.linkDevices.length !== 0) {
            item.nextMaintainTime = item.linkDevices[0].nextMaintainTime;
          }
          return new MaintainManagement(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getSearchPage(maintainListId, data) {
    var data = await api.device
      .apiGetMaintainSearchPages(maintainListId, data)
      .then((response) => {
        response.result = response.result.map((item) => {
          if (item.linkDevices.length !== 0) {
            item.nextMaintainTime = item.linkDevices[0].nextMaintainTime;
          }
          return new MaintainManagement(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getDeviceSearchPage(data) {
    var data = await api.device
      .apiGetMaintainDeviceSearchPages(data)
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
  static async updateDevice(data) {
    var data = await api.device
      .apiPatchMaintainsDevice(data)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static async postMany(maintainListId, data) {
    var data = await api.device
      .apiPostMaintains(maintainListId, data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static async deleteMany(data) {
    var data = await api.device
      .apiDeleteMaintains(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export { MaintainManagementList, MaintainManagement };
