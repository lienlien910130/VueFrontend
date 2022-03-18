import Parent from "./parent";
import api from "@/api";
import Files from "./files";
import { Account } from ".";

class UsageOfFloor extends Parent {
  constructor(data) {
    super(data);
    const {
      houseNumber,
      placeName,
      capacity,
      note,
      spatialCharacteristics,
      businessHours,
      inspectionPlaceCategory,
      publicPlaceCategory,
      selfInspectionDeclared,
      selfPublicDeclared,
      linkUsers,
      linkOwners,
      linkLivingUsers,
    } = data;
    var users =
      linkUsers !== undefined
        ? linkUsers.map((item) => {
            return new Account(item);
          })
        : [];
    var owners =
      linkOwners !== undefined
        ? linkOwners.map((item) => {
            return new Account(item);
          })
        : [];
    var livinguser =
      linkLivingUsers !== undefined
        ? linkLivingUsers.map((item) => {
            return new Account(item);
          })
        : [];
    this.houseNumber = houseNumber;
    this.placeName = placeName;
    this.capacity = capacity;
    this.spatialCharacteristics = spatialCharacteristics;
    this.businessHours = businessHours;
    this.inspectionPlaceCategory = inspectionPlaceCategory;
    this.publicPlaceCategory = publicPlaceCategory;
    this.selfInspectionDeclared = selfInspectionDeclared;
    this.selfPublicDeclared = selfPublicDeclared;
    this.note = note;
    this.linkUsers = users;
    this.linkOwners = owners;
    this.linkLivingUsers = livinguser;
  }
  clone(data) {
    return new UsageOfFloor(data);
  }
  async update(floorId) {
    var temp = JSON.parse(JSON.stringify(this));
    if (floorId !== null) {
      temp.houseNumber = "{Check}" + temp.houseNumber;
    }
    var data = await api.building
      .apiPatchFloorOfHouse(floorId, temp)
      .then(async (response) => {
        return new UsageOfFloor(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async create(floorId) {
    var temp = JSON.parse(JSON.stringify(this));
    temp.houseNumber = "{Check}" + temp.houseNumber;
    var data = await api.building
      .apiPostFloorOfHouse(floorId, temp)
      .then((response) => {
        return new UsageOfFloor(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.building
      .apiDeleteFloorOfHouse(this.id)
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
      .apiGetFloorOfHouseFiles(this.id)
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
      .apiPostFloorOfHouseFiles(this.id, formData)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  getName() {
    return this.houseNumber;
  }
  //管委會使用
  getLinkUsers() {
    return this.linkUsers;
  }
  getLivingUsers() {
    return this.linkLivingUsers;
  }
  static empty() {
    return new UsageOfFloor({
      id: "",
      houseNumber: "",
      placeName: "",
      capacity: 0,
      note: "",
      spatialCharacteristics: "",
      businessHours: "",
      inspectionPlaceCategory: "",
      publicPlaceCategory: "",
      selfInspectionDeclared: false,
      selfPublicDeclared: false,
      linkUsers: [],
      linkOwners: [],
      linkLivingUsers: [],
    });
  }
  static getTableConfig() {
    return [
      {
        label: "戶號",
        prop: "houseNumber",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入戶號",
        maxlength: "20",
        placeholder: "請輸入戶號",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "場所名稱",
        prop: "placeName",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入場所名稱",
        maxlength: "100",
        placeholder: "請輸入場所名稱",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "收容人數",
        prop: "capacity",
        formType: "inputNumber",
        format: "inputAppend",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        type: "number",
        typemessage: "",
        isPattern: true,
        pattern: /^\+?[1-9][0-9]*$/,
        errorMsg: "格式錯誤，請重新輸入",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "空間特性",
        prop: "spatialCharacteristics",
        formType: "inputString",
        format: "textarea",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入空間特性",
        maxlength: "200",
        placeholder: "請輸入空間特性",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "營業時間",
        prop: "businessHours",
        formType: "inputString",
        isTable: false,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "50",
        placeholder: "請輸入營業時間",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "所有人",
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
        label: "使用人",
        prop: "linkUsers",
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
        label: "住戶",
        prop: "linkLivingUsers",
        formType: "select",
        format: "usageOfFloorUserInfo",
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
        label: "自行申報",
        prop: "selfDeclared",
        formType: "selfDeclared",
        format: "selfDeclaredBoolean",
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
        label: "場所類別",
        prop: "inspectionPlaceCategory",
        formType: "selectSetting",
        format: "InspectionTypeOfTime",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
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
      },
    ];
  }
  static async getAll() {
    var data = await api.building
      .apiGetBuildingOfHouse()
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new UsageOfFloor(item);
          });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async get(floorId) {
    var data = await api.building
      .apiGetFloorOfHouse(floorId)
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new UsageOfFloor(item);
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
      .apiGetBuildingOfHouseOfID(id)
      .then((response) => {
        return new UsageOfFloor(response.result[0]);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  static async getSearchPage(floorId, data) {
    var data = await api.building
      .apiGetFloorOfHouseSearchPages(floorId, data)
      .then((response) => {
        response.result = response.result
          .sort((x, y) => x.houseNumber - y.houseNumber)
          .map((item) => {
            return new UsageOfFloor(item);
          });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getSearch(data) {
    var data = await api.building
      .apiGetHouseSearchPages(data)
      .then((response) => {
        response.result = response.result
          .sort((x, y) => x.houseNumber - y.houseNumber)
          .map((item) => {
            return new UsageOfFloor(item);
          });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async postMany(floorId, data) {
    var data = await api.building
      .apiPostFloorOfHouses(floorId, data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new UsageOfFloor(item);
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
      .apiDeleteFloorOfHouse(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static async getFromRegister(buildingId) {
    var data = await api.building
      .apiGetFloorOfHouseFromRegister(buildingId)
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new UsageOfFloor(item);
          });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
}

export default UsageOfFloor;
