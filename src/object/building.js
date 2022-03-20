import Parent from "./parent";
import api from "@/api";
import Files from "./files";
import { Account } from ".";

class Building extends Parent {
  constructor(data) {
    super(data);
    const {
      buildingName,
      address,
      area,
      height,
      floorsOfAboveGround,
      floorsOfUnderground,
      licenseNumber,
      contactPhone,
      useful,
      inspectionPlaceCategory,
      publicPlaceCategory,
      useLicenseDate,
      linkOwners,
      linkFireManagers,
    } = data;
    var owners =
      linkOwners !== undefined
        ? linkOwners.map((item) => {
            return new Account(item);
          })
        : [];
    var fireManagers =
      linkFireManagers !== undefined
        ? linkFireManagers.map((item) => {
            return new Account(item);
          })
        : [];
    this.buildingName = buildingName;
    this.address = address;
    this.area = area == undefined ? null : area;
    this.height = height == undefined ? null : height;
    this.floorsOfAboveGround =
      floorsOfAboveGround == undefined ? null : floorsOfAboveGround;
    this.floorsOfUnderground =
      floorsOfUnderground == undefined ? null : floorsOfUnderground;
    this.licenseNumber = licenseNumber;
    this.contactPhone = contactPhone;
    this.useful = useful;
    this.inspectionPlaceCategory = inspectionPlaceCategory;
    this.publicPlaceCategory = publicPlaceCategory;
    this.useLicenseDate = useLicenseDate;
    this.linkOwners = owners;
    this.linkFireManagers = fireManagers;
  }
  clone(data) {
    return new Building(data);
  }
  async create() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.buildingName = "{Check}" + temp.buildingName;
    var data = await api.building
      .apiPostBuilding(temp)
      .then((response) => {
        return new Building(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async update() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.buildingName = "{Check}" + temp.buildingName;
    var data = await api.building
      .apiPatchBuildingInfo(temp)
      .then(async (response) => {
        return new Building(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.building
      .apiDeleteBuilding(this.id)
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
      .apiGetBuildingFiles()
      .then((response) => {
        var result = response.result.map((item) => {
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
      .apiPostBuildingFiles(formData)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  getName() {
    return this.buildingName;
  }
  static getTableConfig() {
    return [
      {
        label: "名稱",
        prop: "buildingName",
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
        maxlength: "20",
        placeholder: "請輸入名稱",
        isCheck: true,
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
        isShow: false,
        isEdit: true,
        mandatory: true,
        message: "請輸入地址",
        maxlength: "100",
        placeholder: "請輸入地址",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "面積",
        prop: "area",
        formType: "inputNumber",
        format: "inputAppend",
        isTable: true,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入面積",
        placeholder: "請輸入面積",
        isPattern: true,
        pattern: /^\d+$|^\d+[.]?\d+$/,
        errorMsg: "請輸入正確格式",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "高度",
        prop: "height",
        formType: "inputNumber",
        format: "inputAppend",
        isTable: true,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入高度",
        placeholder: "請輸入高度",
        isPattern: true,
        pattern: /^\d+$|^\d+[.]?\d+$/,
        errorMsg: "請輸入正確格式",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "地上樓層",
        prop: "floorsOfAboveGround",
        formType: "inputNumber",
        format: "inputAppend",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入地上樓層，無則輸入0",
        placeholder: "請輸入地上樓層，無則輸入0",
        isPattern: true,
        pattern: /^\+?[1-9][0-9]*$/,
        errorMsg: "請輸入0~9999",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "地下樓層",
        prop: "floorsOfUnderground",
        formType: "inputNumber",
        format: "inputAppend",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入地下樓層，無則輸入0",
        placeholder: "請輸入地下樓層，無則輸入0",
        isPattern: true,
        pattern: /^\+?[1-9][0-9]*$/,
        errorMsg: "請輸入0~9999",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "使用執照字號",
        prop: "licenseNumber",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入使用執照",
        maxlength: "30",
        placeholder: "請輸入使用執照",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "使照日",
        prop: "useLicenseDate",
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
        label: "場所電話",
        prop: "contactPhone",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入場所電話",
        maxlength: "15",
        placeholder: "請輸入場所電話",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "場所類別",
        prop: "inspectionPlaceCategory",
        formType: "selectSetting",
        format: "InspectionTypeOfTime",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇場所類別",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "建物類別",
        prop: "publicPlaceCategory",
        formType: "selectSetting",
        format: "PublicSafeTypeOfTime",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇建物類別",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "場所用途",
        prop: "useful",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入場所用途",
        maxlength: "50",
        placeholder: "請輸入場所用途",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "管理權人",
        prop: "linkOwners",
        formType: "select",
        format: "userInfo",
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
      {
        label: "防火管理人",
        prop: "linkFireManagers",
        formType: "select",
        format: "userInfo",
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
  static getUpdateConfig() {
    return [
      {
        label: "名稱",
        prop: "buildingName",
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
        maxlength: "20",
        placeholder: "請輸入名稱",
        isCheck: true,
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
        isShow: false,
        isEdit: true,
        mandatory: true,
        message: "請輸入地址",
        maxlength: "100",
        placeholder: "請輸入地址",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "面積",
        prop: "area",
        formType: "inputNumber",
        format: "inputAppend",
        isTable: true,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入面積",
        placeholder: "請輸入面積",
        isPattern: true,
        pattern: /^\d+$|^\d+[.]?\d+$/,
        errorMsg: "請輸入正確格式",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "高度",
        prop: "height",
        formType: "inputNumber",
        format: "inputAppend",
        isTable: true,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入高度",
        placeholder: "請輸入高度",
        isPattern: true,
        pattern: /^\d+$|^\d+[.]?\d+$/,
        errorMsg: "請輸入正確格式",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "地上樓層",
        prop: "floorsOfAboveGround",
        formType: "inputNumber",
        format: "inputAppend",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: true,
        message: "請輸入地上樓層，無則輸入0",
        placeholder: "請輸入地上樓層，無則輸入0",
        isPattern: true,
        pattern: /^\+?[1-9][0-9]*$/,
        errorMsg: "請輸入0~9999",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "地下樓層",
        prop: "floorsOfUnderground",
        formType: "inputNumber",
        format: "inputAppend",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: true,
        message: "請輸入地下樓層，無則輸入0",
        placeholder: "請輸入地下樓層，無則輸入0",
        isPattern: true,
        pattern: /^\+?[1-9][0-9]*$/,
        errorMsg: "請輸入0~9999",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "使用執照字號",
        prop: "licenseNumber",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入使用執照",
        maxlength: "30",
        placeholder: "請輸入使用執照",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "使照日",
        prop: "useLicenseDate",
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
        label: "場所電話",
        prop: "contactPhone",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入場所電話",
        maxlength: "15",
        placeholder: "請輸入場所電話",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "場所類別",
        prop: "inspectionPlaceCategory",
        formType: "selectSetting",
        format: "InspectionTypeOfTime",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇場所類別",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "建物類別",
        prop: "publicPlaceCategory",
        formType: "selectSetting",
        format: "PublicSafeTypeOfTime",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇建物類別",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "場所用途",
        prop: "useful",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入場所用途",
        maxlength: "50",
        placeholder: "請輸入場所用途",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "管理權人",
        prop: "linkOwners",
        formType: "select",
        format: "userInfo",
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
      {
        label: "防火管理人",
        prop: "linkFireManagers",
        formType: "select",
        format: "userInfo",
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
  static empty() {
    return new Building({
      id: "",
      buildingName: "",
      address: "",
      area: null,
      height: null,
      floorsOfAboveGround: null,
      floorsOfUnderground: null,
      licenseNumber: "",
      contactPhone: "",
      useful: "",
      inspectionPlaceCategory: "",
      publicPlaceCategory: "",
      useLicenseDate: null,
      linkOwners: [],
      linkFireManagers: [],
    });
  }
  static async get() {
    var data = await api.building
      .apiGetBuilding()
      .then((response) => {
        var result = response.result.map((item) => {
          return new Building(item);
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
      .apiGetBuildingOfID(id)
      .then((response) => {
        return new Building(response.result[0]);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  static async getInfo() {
    var data = await api.building
      .apiGetBuildingInfo()
      .then((response) => {
        var result = response.result.map((item) => {
          return new Building(item);
        });
        return result[0];
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getSearchPage(data) {
    var data = await api.building
      .apiGetBuildingSearchPages(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Building(item);
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
      .apiPostBuildings(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Building(item);
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
      .apiDeleteBuilding(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default Building;
