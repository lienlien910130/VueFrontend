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
      specialStorageItems,
      contactPhone,
      useful,
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
    this.specialStorageItems = specialStorageItems;
    this.contactPhone = contactPhone;
    this.useful = useful;
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
        mandatory: true,
        message: "請輸入名稱",
        maxlength: "20",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入名稱",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
      },
      {
        label: "地址",
        prop: "address",
        format: "address",
        mandatory: true,
        message: "請輸入地址",
        maxlength: "100",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入地址",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "address",
      },
      {
        label: "面積",
        prop: "area",
        mandatory: true,
        message: "請輸入面積",
        format: "inputAppend",
        pattern: /^\d+$|^\d+[.]?\d+$/,
        errorMsg: "請輸入正確格式",
        isPattern: true,
        isHidden: false,
        isSearch: false,
        placeholder: "請輸入面積",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        formType: "inputNumber",
      },
      {
        label: "高度",
        prop: "height",
        mandatory: true,
        message: "請輸入高度",
        format: "inputAppend",
        pattern: /^\d+$|^\d+[.]?\d+$/,
        errorMsg: "請輸入正確格式",
        isPattern: true,
        isHidden: false,
        isSearch: false,
        placeholder: "請輸入高度",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        formType: "inputNumber",
      },
      {
        label: "地上樓層",
        prop: "floorsOfAboveGround",
        format: "inputAppend",
        mandatory: true,
        message: "請輸入地上樓層，無則輸入0",
        pattern: /^[0-9]{1,4}$/,
        errorMsg: "請輸入0~9999",
        isPattern: true,
        isHidden: false,
        isSearch: false,
        placeholder: "請輸入地上樓層，無則輸入0",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "inputNumber",
      },
      {
        label: "地下樓層",
        prop: "floorsOfUnderground",
        format: "inputAppend",
        mandatory: true,
        message: "請輸入地下樓層，無則輸入0",
        pattern: /^[0-9]{1,4}$/,
        errorMsg: "請輸入0~9999",
        isPattern: true,
        isHidden: false,
        isSearch: false,
        placeholder: "請輸入地下樓層，無則輸入0",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "inputNumber",
      },
      {
        label: "使用執照字號",
        prop: "licenseNumber",
        mandatory: true,
        message: "請輸入使用執照",
        maxlength: "30",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入使用執照",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
      },
      {
        label: "場所電話",
        prop: "contactPhone",
        mandatory: true,
        message: "請輸入場所電話",
        maxlength: "15",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入場所電話",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
      },
      {
        label: "場所用途",
        prop: "useful",
        mandatory: true,
        message: "請輸入場所用途",
        maxlength: "50",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入場所用途",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
      },
      {
        label: "管理權人",
        prop: "linkOwners",
        format: "userInfo",
        type: "array",
        typemessage: "",
        mandatory: false,
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "select",
        limit: 0,
      },
      {
        label: "防火管理人",
        prop: "linkFireManagers",
        type: "array",
        typemessage: "",
        mandatory: false,
        format: "userInfo",
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "select",
        limit: 0,
      },
    ];
  }
  static getUpdateConfig() {
    return [
      {
        label: "名稱",
        prop: "buildingName",
        mandatory: true,
        message: "請輸入名稱",
        maxlength: "20",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入名稱",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
      },
      {
        label: "地址",
        prop: "address",
        format: "address",
        mandatory: true,
        message: "請輸入地址",
        maxlength: "100",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入地址",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "address",
      },
      {
        label: "面積",
        prop: "area",
        mandatory: true,
        message: "請輸入面積",
        format: "inputAppend",
        pattern: /^\d+$|^\d+[.]?\d+$/,
        errorMsg: "請輸入正確格式",
        isPattern: true,
        isHidden: false,
        isSearch: false,
        placeholder: "請輸入面積",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        formType: "inputNumber",
      },
      {
        label: "高度",
        prop: "height",
        mandatory: true,
        message: "請輸入高度",
        format: "inputAppend",
        pattern: /^\d+$|^\d+[.]?\d+$/,
        errorMsg: "請輸入正確格式",
        isPattern: true,
        isHidden: false,
        isSearch: false,
        placeholder: "請輸入高度",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        formType: "inputNumber",
      },
      {
        label: "地上樓層",
        prop: "floorsOfAboveGround",
        format: "inputAppend",
        mandatory: true,
        message: "請輸入地上樓層，無則輸入0",
        pattern: /^[0-9]{1,4}$/,
        errorMsg: "請輸入0~9999",
        isPattern: true,
        isHidden: false,
        isSearch: false,
        placeholder: "請輸入地上樓層，無則輸入0",
        isAssociate: false,
        isEdit: false,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "inputNumber",
      },
      {
        label: "地下樓層",
        prop: "floorsOfUnderground",
        format: "inputAppend",
        mandatory: true,
        message: "請輸入地下樓層，無則輸入0",
        pattern: /^[0-9]{1,4}$/,
        errorMsg: "請輸入0~9999",
        isPattern: true,
        isHidden: false,
        isSearch: false,
        placeholder: "請輸入地下樓層，無則輸入0",
        isAssociate: false,
        isEdit: false,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "inputNumber",
      },
      {
        label: "使用執照字號",
        prop: "licenseNumber",
        mandatory: true,
        message: "請輸入使用執照",
        maxlength: "30",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入使用執照",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
      },
      {
        label: "場所電話",
        prop: "contactPhone",
        mandatory: true,
        message: "請輸入場所電話",
        maxlength: "15",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入場所電話",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
      },
      {
        label: "場所用途",
        prop: "useful",
        mandatory: true,
        message: "請輸入場所用途",
        maxlength: "50",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入場所用途",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
      },
      {
        label: "管理權人",
        prop: "linkOwners",
        format: "userInfo",
        type: "array",
        typemessage: "",
        mandatory: false,
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "select",
        limit: 0,
      },
      {
        label: "防火管理人",
        prop: "linkFireManagers",
        type: "array",
        typemessage: "",
        mandatory: false,
        format: "userInfo",
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "select",
        limit: 0,
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
      specialStorageItems: "",
      contactPhone: "",
      useful: "",
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
