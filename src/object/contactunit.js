import Parent from "./parent";
import api from "@/api";

class Contactunit extends Parent {
  constructor(data) {
    super(data);
    const {
      type,
      name,
      contactNumber,
      cellPhoneNumber,
      faxNumber,
      email,
      address,
      businessRegistrationCode,
      personInCharge,
      registerDate,
      expirationDate,
      revocation,
      governmentApproval,
      note,
      collaborate,
      hide,
    } = data;
    this.name = name;
    this.type = type;
    this.contactNumber = contactNumber;
    this.cellPhoneNumber = cellPhoneNumber;
    this.faxNumber = faxNumber;
    this.email = email;
    this.address = address;
    this.businessRegistrationCode = businessRegistrationCode;
    this.personInCharge = personInCharge;
    this.registerDate = registerDate;
    this.expirationDate = expirationDate;
    this.revocation = revocation;
    this.governmentApproval = governmentApproval;
    this.note = note;
    this.collaborate = collaborate;
    this.hide = hide;
  }
  clone(data) {
    return new Contactunit(data);
  }
  async update() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.name = "{Check}" + temp.name;
    var data = await api.building
      .apiPatchContactUnit(temp)
      .then(async (response) => {
        return new Contactunit(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async create() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.name = "{Check}" + temp.name;
    var data = await api.building
      .apiPostContactUnit(temp)
      .then((response) => {
        return new Contactunit(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.building
      .apiDeleteContactUnit(this.id)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  getName() {
    return this.name;
  }
  static empty() {
    return new Contactunit({
      id: "",
      name: "",
      type: "",
      contactNumber: "",
      cellPhoneNumber: "",
      faxNumber: "",
      email: "",
      address: "",
      businessRegistrationCode: "",
      personInCharge: "",
      registerDate: null,
      expirationDate: null,
      revocation: false,
      governmentApproval: false,
      note: "",
      collaborate: true,
      hide: false,
    });
  }
  static getTableConfig() {
    return [
      {
        label: "公司名稱",
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
        message: "請輸入公司名稱",
        maxlength: "20",
        placeholder: "請輸入公司名稱",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "類別",
        prop: "type",
        formType: "selectSetting",
        format: "ContactUnitOptions",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇類別",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "電話",
        prop: "contactNumber",
        formType: "inputString",
        isTable: true,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "15",
        placeholder: "請輸入電話",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "負責人",
        prop: "personInCharge",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入負責人",
        maxlength: "15",
        placeholder: "請輸入負責人",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "手機",
        prop: "cellPhoneNumber",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入手機號碼",
        maxlength: "10",
        placeholder: "請輸入手機號碼，格式為09xxxxxxxx",
        isPattern: true,
        pattern: /^09\d{8}$/,
        errorMsg: "輸入格式為09xxxxxxxx",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "傳真號碼",
        prop: "faxNumber",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "15",
        placeholder: "請輸入傳真號碼",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "信箱",
        prop: "email",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "100",
        placeholder: "請輸入信箱",
        isPattern: true,
        pattern:
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
        errorMsg: "格式錯誤,請重新輸入",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "地址",
        prop: "address",
        formType: "address",
        format: "address",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入地址",
        maxlength: "200",
        placeholder: "請輸入地址",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "狀態",
        prop: "collaborate",
        formType: "boolean",
        format: "collaborateBoolean",
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
        label: "認證檢修機構",
        prop: "governmentApproval",
        formType: "checkbox",
        format: "governmentApprovalBoolean",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        type: "boolean",
        typemessage: "",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "檢修機構代號",
        prop: "businessRegistrationCode",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        maxlength: "20",
        placeholder: "請輸入檢修機構代號",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "登記日期",
        prop: "registerDate",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        hasEvent: true,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "有效日期",
        prop: "expirationDate",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: false,
        isBlock: false,
        isSearch: false,
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
        label: "是否撤銷",
        prop: "revocation",
        formType: "boolean",
        format: "revocationBoolean",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
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
    ];
  }
  static getProfessionalTableConfig() {
    return [
      {
        label: "公司名稱",
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
        message: "請輸入公司名稱",
        maxlength: "20",
        placeholder: "請輸入公司名稱",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "類別",
        prop: "type",
        formType: "selectSetting",
        format: "ContactUnitOptions",
        isTable: false,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇類別",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "電話",
        prop: "contactNumber",
        formType: "inputString",
        isTable: true,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "15",
        placeholder: "請輸入電話",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "負責人",
        prop: "personInCharge",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入負責人",
        maxlength: "15",
        placeholder: "請輸入負責人",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "手機",
        prop: "cellPhoneNumber",
        formType: "inputString",
        isTable: false,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入手機號碼",
        maxlength: "10",
        placeholder: "請輸入手機號碼，格式為09xxxxxxxx",
        isPattern: true,
        pattern: /^09\d{8}$/,
        errorMsg: "輸入格式為09xxxxxxxx",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "傳真號碼",
        prop: "faxNumber",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "15",
        placeholder: "請輸入傳真號碼",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "信箱",
        prop: "email",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "100",
        placeholder: "請輸入信箱",
        isPattern: true,
        pattern:
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
        errorMsg: "格式錯誤,請重新輸入",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "地址",
        prop: "address",
        formType: "address",
        format: "address",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入地址",
        maxlength: "200",
        placeholder: "請輸入地址",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "狀態",
        prop: "collaborate",
        formType: "boolean",
        format: "collaborateBoolean",
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
        label: "認證檢修機構",
        prop: "governmentApproval",
        formType: "checkbox",
        format: "governmentApprovalBoolean",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        type: "boolean",
        typemessage: "",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "檢修機構代號",
        prop: "businessRegistrationCode",
        formType: "inputString",
        isTable: true,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        maxlength: "20",
        placeholder: "請輸入檢修機構代號",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "登記日期",
        prop: "registerDate",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        hasEvent: true,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "有效日期",
        prop: "expirationDate",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: false,
        isSearch: false,
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
        label: "是否撤銷",
        prop: "revocation",
        formType: "boolean",
        format: "revocationBoolean",
        isTable: true,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
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
    ];
  }
  static async get() {
    var data = await api.building
      .apiGetContactUnit()
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new Contactunit(item);
          });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getOfID(id) {
    var data = await api.building
      .apiGetContactUnitOfID(id)
      .then((response) => {
        return new Contactunit(response.result[0]);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  static async getSearchPage(data) {
    var data = await api.building
      .apiGetContactUnitSearchPages(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Contactunit(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async postMany(data, activeName) {
    var r = [];
    if (activeName == "Vender") {
      r = await api.building
        .apiPostContactUnits(data)
        .then((response) => {
          response.result = response.result.map((item) => {
            return new Contactunit(item);
          });
          return response;
        })
        .catch((error) => {
          return [];
        });
    } else {
      r = await api.building
        .apiPostGovernmentApproval(data)
        .then((response) => {
          response.result = response.result.map((item) => {
            return new Contactunit(item);
          });
          return response;
        })
        .catch((error) => {
          return [];
        });
    }
    return r;
  }
  static async deleteMany(data) {
    var data = await api.building
      .apiDeleteContactUnit(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default Contactunit;
