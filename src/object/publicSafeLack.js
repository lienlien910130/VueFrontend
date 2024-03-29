import Parent from "./parent";
import api from "@/api";

class PublicSafeLack extends Parent {
  constructor(data) {
    super(data);
    const {
      lackItem,
      lackContent,
      notPassReason,
      accordLaws,
      improvePlan,
      status,
    } = data;
    this.lackItem = lackItem;
    this.lackContent = lackContent;
    this.notPassReason = notPassReason;
    this.accordLaws = accordLaws;
    this.improvePlan = improvePlan;
    this.status = status;
  }
  clone(data) {
    return new PublicSafeLack(data);
  }
  async update() {
    var data = await api.report
      .apiPatchPublicSafeLack(this)
      .then(async (response) => {
        return new PublicSafeLack(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async create(publicSafeId) {
    var data = await api.report
      .apiPostPublicSafeLack(publicSafeId, this)
      .then((response) => {
        return new PublicSafeLack(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.report
      .apiDeletePublicSafeLack(this.id)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static empty() {
    return new PublicSafeLack({
      id: "",
      lackItem: "",
      lackContent: "",
      notPassReason: "",
      accordLaws: "",
      improvePlan: "",
      status: "",
    });
  }
  static getTableConfig() {
    return [
      {
        label: "項目",
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
        message: "請輸入項目",
        maxlength: "200",
        placeholder: "請輸入項目",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "內容",
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
        mandatory: false,
        maxlength: "200",
        placeholder: "請輸入內容",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "無法合格理由",
        prop: "notPassReason",
        formType: "inputString",
        format: "textarea",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "200",
        placeholder: "請輸入無法合格理由",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "法令依據",
        prop: "accordLaws",
        formType: "inputString",
        format: "textarea",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "200",
        placeholder: "請輸入法令依據",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "改善計畫",
        prop: "improvePlan",
        formType: "inputString",
        format: "textarea",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "200",
        placeholder: "請輸入改善計畫",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "處理進度",
        prop: "status",
        formType: "selectSetting",
        format: "LackStatusOptions",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇處理進度",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
    ];
  }
  static getChName() {
    return "公安申報缺失項目";
  }
  static async get(publicSafeId) {
    var data = await api.report
      .apiGetPublicSafeLack(publicSafeId)
      .then((response) => {
        return response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new PublicSafeLack(item);
          });
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getSearchPage(publicSafeId, data) {
    var data = await api.report
      .apiGetPublicSafeLackSearchPages(publicSafeId, data)
      .then((response) => {
        response.result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new PublicSafeLack(item);
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
      .apiGetAllPublicSafeLackSearchPages(type, data)
      .then((response) => {
        response.result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new PublicSafeLack(item);
          });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async postMany(publicSafeId, data) {
    var data = await api.report
      .apiPostPublicSafeLacks(publicSafeId, data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new PublicSafeLack(item);
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
      .apiDeletePublicSafeLack(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default PublicSafeLack;
