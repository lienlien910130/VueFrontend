import Parent from "./parent";
import api from "@/api";
import { PhysicalInfo, Building, Role } from ".";
import CharacterStatus from "./characterStatus";

class Account extends Parent {
  constructor(data) {
    super(data);
    const {
      account,
      password,
      name,
      identityCard,
      birthday,
      callNumber,
      cellPhoneNumber,
      emergencyNumber,
      email,
      note,
      usageOfFloor,
      description,
      status,
      removable,
      headShotFileId,
      verifyCellPhone,
      verifyEmail,
      sex,
      linkRoles,
      linkBuildings,
      linkPhysicalInfos,
      linkCharacterStatus,
    } = data;
    var roles =
      linkRoles !== undefined
        ? linkRoles.map((item) => {
            return new Role(item);
          })
        : [];
    var buildings =
      linkBuildings !== undefined
        ? linkBuildings.map((item) => {
            return new Building(item);
          })
        : [];
    var physicalInfos =
      linkPhysicalInfos !== undefined
        ? linkPhysicalInfos.map((item) => {
            return new PhysicalInfo(item);
          })
        : [];
    var characterStatus =
      linkCharacterStatus !== undefined
        ? linkCharacterStatus.map((item) => {
            return new CharacterStatus(item);
          })
        : [];
    this.account = account;
    this.password = password;
    this.name = name;
    this.sex = sex;
    this.identityCard = identityCard;
    this.birthday = birthday;
    this.callNumber = callNumber;
    this.cellPhoneNumber = cellPhoneNumber;
    this.emergencyNumber = emergencyNumber;
    this.email = email;
    this.note = note;
    this.usageOfFloor = usageOfFloor;
    this.description = description;
    this.status = status;
    this.removable = removable;
    this.headShotFileId = headShotFileId;
    this.verifyCellPhone = verifyCellPhone;
    this.verifyEmail = verifyEmail;
    this.linkRoles = roles;
    this.linkBuildings = buildings;
    this.linkPhysicalInfos = physicalInfos;
    this.linkCharacterStatus = characterStatus;
  }
  clone(data) {
    return new Account(data);
  }
  async update() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.account = "{Check}" + temp.account;
    var data = await api.authority
      .apiPutAccountAuthority(temp)
      .then(async (response) => {
        return new Account(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async updateP() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.account = "{Check}" + temp.account;
    var data = await api.authority
      .apiPatchAccountAuthority(temp)
      .then(async (response) => {
        return new Account(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async create() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.account = "{Check}" + temp.account;
    var data = await api.authority
      .apiPostAccountAuthority(temp)
      .then((response) => {
        return new Account(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.authority
      .apiDeleteAccountAuthority(this.id)
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
  //查詢權限用
  getRoles() {
    return this.linkRoles;
  }
  //表格&區塊顯示名稱用
  getRolesName() {
    return this.linkRoles.map((item) => item.getName()).toString();
  }
  getBuildingsName() {
    return this.linkBuildings.map((item) => item.getName()).toString();
  }
  static empty() {
    return new Account({
      id: "",
      account: "",
      password: "",
      name: "",
      sex: null,
      identityCard: "",
      birthday: null,
      callNumber: "",
      cellPhoneNumber: "",
      emergencyNumber: "",
      email: "",
      note: "",
      usageOfFloor: null,
      description: "",
      status: true,
      removable: false,
      headShotFileId: null,
      verifyCellPhone: false,
      verifyEmail: false,
      linkRoles: [],
      linkBuildings: [],
    });
  }
  static getTableConfig() {
    return [
      {
        label: "大頭照",
        prop: "headShotFileId",
        mandatory: false,
        maxlength: "15",
        isHidden: true,
        isSearch: false,
        placeholder: "請上傳大頭照",
        isAssociate: false,
        isEdit: false,
        isUpload: false,
        isExport: false,
        isBlock: false,
        selectFilter: false,
      },
      {
        label: "帳號",
        prop: "account",
        mandatory: true,
        message: "請輸入帳號",
        maxlength: "10",
        // pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
        // errorMsg: "請輸入至少6個字元，含大小寫字母、至少1個數字",
        isPattern: false,
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入帳號",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
        isCheck: true,
      },
      {
        label: "密碼",
        prop: "password",
        mandatory: true,
        message: "請輸入密碼",
        maxlength: "100",
        // pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        // errorMsg: "請輸入至少8個字元，含大小寫字母、至少1個數字",
        isPattern: false,
        isHidden: true,
        isSearch: false,
        placeholder: "請輸入密碼",
        isAssociate: false,
        isEdit: false,
        isUpload: true,
        isExport: false,
        isBlock: false,
        selectFilter: false,
      },
      {
        label: "用戶名",
        prop: "name",
        mandatory: true,
        message: "請輸入用戶名",
        maxlength: "20",
        isHidden: false,
        isSearch: true,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
      },
      {
        label: "性別",
        prop: "sex",
        format: "sexBoolean",
        mandatory: true,
        message: "請輸入性別",
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
        selectFilter: false,
      },
      {
        label: "身份證",
        prop: "identityCard",
        mandatory: false,
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
        label: "年齡",
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
        label: "手機",
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
        isHidden: true,
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
        label: "email",
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
        label: "描述",
        prop: "description",
        format: "textarea",
        mandatory: false,
        maxlength: "200",
        isHidden: true,
        isSearch: true,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        selectFilter: false,
      },
      {
        label: "角色",
        prop: "linkRoles",
        format: "roleSelect",
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
        label: "狀態",
        prop: "status",
        format: "accountStatusSelect",
        mandatory: true,
        message: "請選擇狀態",
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
        selectFilter: false,
      },
      {
        label: "刪除",
        prop: "removable",
        format: "removableSelect",
        mandatory: true,
        message: "請選擇是否允許刪除",
        type: "boolean",
        typemessage: "",
        isHidden: true,
        isSearch: false,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        formType: "boolean",
        selectFilter: false,
      },
      {
        label: "大樓",
        prop: "linkBuildings",
        format: "buildingSelect",
        mandatory: true,
        message: "請選擇建築物",
        type: "array",
        typemessage: "",
        isHidden: false,
        isSearch: false,
        isAssociate: false,
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
        mandatory: false,
        format: "textarea",
        maxlength: "200",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入職稱",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        selectFilter: false,
      },
    ];
  }
  static getUserTableConfig() {
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
        label: "性別",
        prop: "sex",
        format: "sexBoolean",
        mandatory: true,
        message: "請輸入性別",
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
        label: "年齡",
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
        label: "手機",
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
        label: "email",
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
        placeholder: "請輸入職稱",
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
    var data = await api.authority
      .apiGetAllAccount()
      .then((response) => {
        return response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new Account(item);
          });
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getOfID(id) {
    var data = await api.authority
      .apiGetAccountOfID(id)
      .then((response) => {
        return new Account(response.result[0]);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  static async getSearchPage(data) {
    var data = await api.authority
      .apiGetAccountAuthoritySearchPages(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Account(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getUserSearchPage(data) {
    var data = await api.authority
      .apiGetUserSearchPages(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Account(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async postMany(data) {
    var data = await api.authority
      .apiPostAccountAuthorities(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Account(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async deleteMany(data) {
    var data = await api.authority
      .apiDeleteAccountAuthority(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static async postPhoto(tgUserId, data) {
    var data = await api.authority
      .apiPostUserPhoto(tgUserId, data)
      .then((response) => {
        return response.result.headShotFileId;
      })
      .catch((error) => {
        return null;
      });
    return data;
  }
  static async updatePassword(data) {
    var data = await api.authority
      .apiPatchAccountAuthority(data)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default Account;
