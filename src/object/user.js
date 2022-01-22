import Parent from "./parent";
import api from "@/api";
const moment = require("moment");

class User extends Parent {
  constructor(data) {
    super(data);
    const {
      name,
      identityCard,
      birthday,
      callNumber,
      cellPhoneNumber,
      emergencyNumber,
      email,
      note,
      usageOfFloor,
    } = data;
    this.name = name;
    this.identityCard = identityCard;
    this.birthday = birthday;
    this.callNumber = callNumber;
    this.cellPhoneNumber = cellPhoneNumber;
    this.emergencyNumber = emergencyNumber;
    this.email = email;
    this.note = note;
    this.usageOfFloor = usageOfFloor;
  }
  clone(data) {
    return new User(data);
  }
  async update() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.name = "{Check}" + temp.name;
    var data = await api.building
      .apiPatchUser(temp)
      .then(async (response) => {
        return new User(response.result);
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
      .apiPostUser(temp)
      .then(async (response) => {
        return new User(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.building
      .apiDeleteUser(this.id)
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
  getNameOfYear() {
    var year = moment(this.birthday).format("YYYY");
    var y = year - 1911;
    return this.name + "-" + y.toString() + "年次";
  }
  getUsageOfFloor() {
    return this.usageOfFloor;
  }
  // static empty() {
  //   return new User({
  //     id: "",
  //     name: "",
  //     identityCard: "",
  //     birthday: null,
  //     callNumber: "",
  //     cellPhoneNumber: "",
  //     emergencyNumber: "",
  //     email: "",
  //     note: "",
  //     usageOfFloor: "",
  //   });
  // }
  static getTableConfig() {
    return [
      {
        label: "姓名",
        prop: "name",
        mandatory: true,
        message: "請輸入姓名",
        maxlength: "15",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入姓名",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
      },
      {
        label: "身份證",
        prop: "identityCard",
        mandatory: true,
        message: "請輸入身份證",
        pattern: /^[A-Z]{1}[1-2]{1}[0-9]{8}$/,
        errorMsg: "格式錯誤,請重新輸入",
        isPattern: true,
        maxlength: "10",
        isHidden: true,
        isSearch: false,
        placeholder: "請輸入身份證",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        selectFilter: false,
      },
      {
        label: "生日",
        prop: "birthday",
        format: "YYYY-MM-DD",
        mandatory: false,
        isHidden: false,
        isSearch: true,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        formType: "date",
        selectFilter: false,
      },
      {
        label: "電話",
        prop: "callNumber",
        mandatory: false,
        maxlength: "15",
        isHidden: true,
        isSearch: true,
        placeholder: "請輸入電話",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
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
        maxlength: "10",
        isHidden: false,
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
        label: "緊急電話",
        prop: "emergencyNumber",
        mandatory: false,
        maxlength: "15",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入緊急電話",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
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
        maxlength: "100",
        isHidden: false,
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
        label: "門牌",
        prop: "usageOfFloor",
        mandatory: false,
        maxlength: "15",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入職稱",
        isAssociate: false,
        isEdit: false,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
      },
      {
        label: "備註",
        prop: "note",
        mandatory: false,
        format: "textarea",
        maxlength: "200",
        isHidden: false,
        isSearch: true,
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
      .apiGetUser()
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new User(item);
          });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getOfBuildingID(buildingId) {
    var data = await api.building
      .apiGetBuildingOfUser(buildingId)
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new User(item);
          });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  // static async getSearchPage(data) {
  //   var data = await api.building
  //     .apiGetUserSearchPages(data)
  //     .then((response) => {
  //       response.result = response.result.map((item) => {
  //         return new User(item);
  //       });
  //       return response;
  //     })
  //     .catch((error) => {
  //       return [];
  //     });
  //   return data;
  // }
  static async postMany(data) {
    var data = await api.building
      .apiPostUsers(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new User(item);
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
      .apiDeleteUser(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default User;
