import Parent from "./parent";
import api from "@/api";

class InspectionLacks extends Parent {
  constructor(data) {
    super(data);
    const { lackItem, lackContent, status } = data;
    this.lackItem = lackItem;
    this.lackContent = lackContent;
    this.status = status;
  }
  clone(data) {
    return new InspectionLacks(data);
  }
  async update() {
    var data = await api.report
      .apiPatchInspectionLack(this)
      .then(async (response) => {
        return new InspectionLacks(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async create(inspectionId) {
    var data = await api.report
      .apiPostInspectionLack(inspectionId, this)
      .then((response) => {
        return new InspectionLacks(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.report
      .apiDeleteInspectionLack(this.id)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  getName() {
    return "【" + this.lackItem + "】" + this.lackContent;
  }
  static empty() {
    return new InspectionLacks({
      id: "",
      lackItem: "",
      lackContent: "",
      status: "",
    });
  }
  static getTableConfig() {
    return [
      {
        label: "缺失項目",
        prop: "lackItem",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入缺失項目",
        maxlength: "200",
        placeholder: "請輸入缺失項目",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "缺失內容",
        prop: "lackContent",
        formType: "inputString",
        format: "textarea",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入缺失內容",
        maxlength: "200",
        placeholder: "請輸入缺失內容",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "處理進度",
        prop: "status",
        formType: "selectSetting",
        format: "MaintainProcessOptions",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
    ];
  }
  static getChName() {
    return "檢修申報缺失項目";
  }
  static async get(inspectionId) {
    var data = await api.report
      .apiGetInspectionLack(inspectionId)
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new InspectionLacks(item);
          });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getOfID(id) {
    var data = await api.report
      .apiGetInspectionLackOfID(id)
      .then((response) => {
        return new InspectionLacks(response.result[0]);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  static async getSearchPage(inspectionId, data) {
    var data = await api.report
      .apiGetInspectionLackSearchPages(inspectionId, data)
      .then((response) => {
        response.result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new InspectionLacks(item);
          });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getAllSearchPage(type, data) {
    var data = await api.report
      .apiGetAllInspectionLackSearchPages(type, data)
      .then((response) => {
        response.result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new InspectionLacks(item);
          });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async postMany(inspectionId, data) {
    var data = await api.report
      .apiPostInspectionLacks(inspectionId, data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new InspectionLacks(item);
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
      .apiDeleteInspectionLack(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default InspectionLacks;
