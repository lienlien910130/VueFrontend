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
      placeCategory,
      selfDeclared,
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
    this.placeCategory = placeCategory;
    this.selfDeclared = selfDeclared;
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
      placeCategory: "",
      selfDeclared: false,
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
        mandatory: true,
        message: "請輸入戶號",
        isHidden: false,
        maxlength: "20",
        isSearch: true,
        placeholder: "請輸入戶號",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
        isCheck: true,
      },
      {
        label: "場所名稱",
        prop: "placeName",
        mandatory: true,
        message: "請輸入場所名稱",
        isHidden: false,
        maxlength: "100",
        isSearch: true,
        placeholder: "請輸入場所名稱",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
      },
      {
        label: "場所類別",
        prop: "placeCategory",
        format: "InspectionTypeOfTime",
        mandatory: true,
        message: "請選擇場所類別",
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
        label: "自行申報",
        prop: "selfDeclared",
        format: "selfDeclaredBoolean",
        type: "boolean",
        typemessage: "",
        mandatory: false,
        trigger: "change",
        isHidden: false,
        isSearch: false,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "checkbox",
        selectFilter: true,
      },
      {
        label: "收容人數",
        prop: "capacity",
        format: "inputAppend",
        type: "number",
        typemessage: "",
        mandatory: false,
        pattern: /^\+?[1-9][0-9]*$/,
        errorMsg: "格式錯誤，請重新輸入",
        isPattern: true,
        isHidden: false,
        isSearch: true,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "inputNumber",
        selectFilter: false,
      },
      {
        label: "空間特性",
        prop: "spatialCharacteristics",
        format: "textarea",
        mandatory: true,
        message: "請輸入空間特性",
        isHidden: false,
        maxlength: "200",
        isSearch: true,
        placeholder: "請輸入空間特性",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
      },
      {
        label: "營業時間",
        prop: "businessHours",
        mandatory: false,
        message: "請輸入營業時間",
        isHidden: true,
        maxlength: "50",
        isSearch: true,
        placeholder: "請輸入營業時間",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
      },
      {
        label: "所有人",
        prop: "linkOwners",
        format: "userInfo",
        mandatory: false,
        type: "array",
        typemessage: "",
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "select",
        limit: 0,
        selectFilter: true,
      },
      {
        label: "使用人",
        prop: "linkUsers",
        format: "userInfo",
        mandatory: false,
        type: "array",
        typemessage: "",
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "select",
        limit: 0,
        selectFilter: true,
      },
      {
        label: "住戶",
        prop: "linkLivingUsers",
        format: "usageOfFloorUserInfo",
        mandatory: false,
        type: "array",
        typemessage: "",
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "select",
        limit: 0,
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
}

export default UsageOfFloor;
