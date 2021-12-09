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
        mandatory: true,
        message: "請輸入公司名稱",
        isHidden: false,
        maxlength: "20",
        isSearch: true,
        placeholder: "請輸入公司名稱",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
      },
      {
        label: "類別",
        prop: "type",
        format: "ContactUnitOptions",
        mandatory: true,
        message: "請選擇類別",
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "selectSetting",
        selectFilter: true,
      },
      {
        label: "電話",
        prop: "contactNumber",
        mandatory: false,
        isHidden: false,
        maxlength: "15",
        isSearch: true,
        placeholder: "請輸入電話",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        selectFilter: false,
      },
      {
        label: "手機號碼",
        prop: "cellPhoneNumber",
        mandatory: true,
        message: "請輸入手機號碼",
        pattern: /^09\d{8}$/,
        errorMsg: "輸入格式為09xxxxxxxx",
        isPattern: true,
        isHidden: false,
        maxlength: "10",
        isSearch: true,
        placeholder: "請輸入手機號碼，格式為09xxxxxxxx",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
      },
      {
        label: "傳真號碼",
        prop: "faxNumber",
        mandatory: false,
        isHidden: false,
        maxlength: "15",
        isSearch: true,
        placeholder: "請輸入傳真號碼",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        selectFilter: false,
      },
      {
        label: "電子信箱",
        prop: "email",
        mandatory: false,
        pattern:
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
        errorMsg: "格式錯誤,請重新輸入",
        isPattern: true,
        isHidden: false,
        maxlength: "100",
        isSearch: true,
        placeholder: "請輸入電子信箱",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        selectFilter: false,
      },
      {
        label: "地址",
        prop: "address",
        mandatory: true,
        message: "請輸入地址",
        isHidden: false,
        maxlength: "200",
        isSearch: true,
        placeholder: "請輸入地址",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
      },
      {
        label: "狀態",
        prop: "collaborate",
        format: "collaborateBoolean",
        mandatory: false,
        type: "boolean",
        typemessage: "",
        isHidden: false,
        isSearch: false,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "boolean",
        selectFilter: true,
      },
      {
        label: "備註",
        prop: "note",
        format: "textarea",
        mandatory: false,
        isHidden: true,
        maxlength: "200",
        isSearch: true,
        placeholder: "請輸入備註",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        selectFilter: false,
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
  static async postMany(data) {
    var data = await api.building
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
    return data;
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
