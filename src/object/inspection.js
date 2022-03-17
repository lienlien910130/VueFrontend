import Parent from "./parent";
import api from "@/api";
import Files from "./files";
import { UsageOfFloor, Contactunit, MaintainManagement } from ".";
const moment = require("moment");

class Inspection extends Parent {
  constructor(data) {
    super(data);
    const {
      declareYear,
      declareDeadline,
      declareDate,
      declareResult,
      declarationImproveDate,
      checkStartDate,
      checkEndDate,
      professName,
      certificateNumber,
      isImproved,
      imported,
      nextInspectionDate,
      note,
      completedCount,
      allCount,
      linkContactUnits,
      linkUsageOfFloor,
    } = data;
    var contactUnits =
      linkContactUnits !== undefined
        ? linkContactUnits.map((item) => {
            return new Contactunit(item);
          })
        : [];
    var usageOfFloors =
      linkUsageOfFloor !== undefined
        ? linkUsageOfFloor.map((item) => {
            return new UsageOfFloor(item);
          })
        : [];
    this.declareYear = declareYear;
    this.declareDeadline = declareDeadline;
    this.declareDate = declareDate;
    this.declareResult = declareResult;
    this.declarationImproveDate = declarationImproveDate;
    this.checkStartDate = checkStartDate == undefined ? null : checkStartDate;
    this.checkEndDate = checkEndDate == undefined ? null : checkEndDate;
    this.professName = professName;
    this.certificateNumber = certificateNumber;
    this.isImproved = isImproved;
    this.imported = imported;
    this.nextInspectionDate = nextInspectionDate;
    this.note = note;
    this.completedCount = completedCount;
    this.allCount = allCount;
    this.linkContactUnits = contactUnits;
    this.linkUsageOfFloor = usageOfFloors;
  }
  clone(data) {
    return new Inspection(data);
  }
  getCertificateNumber() {
    return this.certificateNumber;
  }
  async update() {
    var data = await api.report
      .apiPatchInspection(this)
      .then(async (response) => {
        return new Inspection(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async create() {
    var data = await api.report
      .apiPostInspection(this)
      .then((response) => {
        return new Inspection(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.report
      .apiDeleteInspection(this.id)
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
      .apiGetInspectionFiles(this.id)
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new Files(item);
          });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  async createfiles(formData) {
    var data = await api.files
      .apiPostInspectionFiles(this.id, formData)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  async getlackfileID() {
    var data = await api.report
      .apiGetInspection(this.id)
      .then((response) => {
        return response.result[0].imported.toString();
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  async settinglackfile(autoCreateMaintain, fileId, cover) {
    var data = await api.report
      .apiPostInspectionLackFiles(autoCreateMaintain, this.id, fileId, cover)
      .then((response) => {
        console.log(JSON.stringify(response));
        var temp = [];
        response.result.linkMaintains.forEach((element) => {
          temp.push(new MaintainManagement(element));
        });
        return temp;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static empty() {
    return new Inspection({
      id: "",
      declareYear: moment().format("YYYY-MM-DD"),
      declareDeadline: null,
      declareDate: moment().format("YYYY-MM-DD"),
      declareResult: true, //true:合格申報/false:缺失申報
      declarationImproveDate: null,
      checkStartDate: null,
      checkEndDate: null,
      professName: "",
      certificateNumber: "",
      isImproved: false,
      imported: 0,
      nextInspectionDate: null,
      note: "",
      completedCount: 0,
      allCount: 0,
      linkContactUnits: [],
      linkUsageOfFloor: [],
    });
  }
  static getTableConfig() {
    return [
      {
        label: "申報年度",
        prop: "declareYear",
        formType: "date",
        format: "YYYY",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇年度",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "",
        prop: "declareYearType",
        formType: "radio",
        format: "declareYearType",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: true,
        message: "請選擇",
        hasEvent: true,
        isCheck: false,
        isUpload: false,
        isExport: false,
      },
      {
        label: "申報期限",
        prop: "declareDeadline",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇期限",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "申報日期",
        prop: "declareDate",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇日期",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "檢測日期",
        prop: "rangeDate",
        formType: "range",
        format: "range",
        isTable: true,
        isBlock: true,
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
        label: "檢測開始日期",
        prop: "checkStartDate",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: true,
        isAssociate: false,
        isShow: false,
        isEdit: false,
        mandatory: false,
        isCheck: false,
        isUpload: true,
        isExport: false,
      },
      {
        label: "結束日期",
        prop: "checkEndDate",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: true,
        isAssociate: false,
        isShow: false,
        isEdit: false,
        mandatory: false,
        isCheck: false,
        isUpload: true,
        isExport: false,
      },
      {
        label: "申報廠商",
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
        label: "門牌",
        prop: "linkUsageOfFloor",
        formType: "singleChoice",
        format: "floorOfHouseSelect",
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
        label: "專技人員",
        prop: "professName",
        formType: "searchColumn",
        format: "searchColumn",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "10",
        placeholder: "請輸入專技人員",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "資格",
        prop: "certificateNumber",
        formType: "selectString",
        format: "certificateNumber",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "20",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "合格申報",
        prop: "declareResult",
        formType: "checkbox",
        format: "declareResultBoolean",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        type: "boolean",
        typemessage: "",
        hasEvent: true,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "計劃書改善期限",
        prop: "declarationImproveDate",
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
      {
        label: "限期改善日期",
        prop: "nextInspectionDate",
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
      {
        label: "改善狀況",
        prop: "isImproved",
        formType: "boolean",
        format: "improvedBoolean",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        type: "boolean",
        typemessage: "",
        isCheck: false,
        isUpload: true,
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
      },
      {
        label: "已改善缺失",
        prop: "completedCount",
        formType: "inputString",
        isTable: false,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: false,
        mandatory: false,
        type: "number",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "缺失項目總數",
        prop: "allCount",
        formType: "inputString",
        isTable: false,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
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
  static getChName() {
    return "檢修申報";
  }
  static async get() {
    var data = await api.report
      .apiGetBuildingInspection()
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new Inspection(item);
          });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getSearchPage(data) {
    var data = await api.report
      .apiGetInspectionSearchPages(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Inspection(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getColumn(data) {
    var data = await api.report
      .apiGetInspectionColumn(data)
      .then((response) => {
        return response.result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async postMany(data) {
    var data = await api.report
      .apiPostInspections(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Inspection(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async deleteMany(data) {
    var data = await api.report
      .apiDeleteInspection(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static async getRemind(type) {
    var data = await api.report
      .apiGetInspectionRemind(type)
      .then((response) => {
        return response.result;
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  static async patchMaintain(data) {
    var data = await api.report
      .apiPatchMaintainManagementOfInspection(new Array(data))
      .then((response) => {
        return new MaintainManagement(response.result[0]);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
}

export default Inspection;
