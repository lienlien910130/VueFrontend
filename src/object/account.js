import Parent from "./parent";
import api from "@/api";
import { PhysicalInfo, Building, Role } from ".";

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
      emergencyContact,
      emergencyNumber,
      email,
      usageOfFloor,
      description,
      status,
      removable,
      headShotFileId,
      verifyCellPhone,
      verifyEmail,
      verifyUsageOfFloor,
      sex,
      moveWithDifficulty,
      note,
      tmpAccount,
      linkRoles,
      linkBuildings,
      linkPhysicalInfos,
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
    this.account = account;
    this.password = password;
    this.name = name;
    this.sex = sex;
    this.identityCard = identityCard;
    this.birthday = birthday;
    this.callNumber = callNumber;
    this.cellPhoneNumber = cellPhoneNumber;
    this.emergencyContact = emergencyContact;
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
    this.verifyUsageOfFloor = verifyUsageOfFloor;
    this.moveWithDifficulty = moveWithDifficulty;
    this.tmpAccount = tmpAccount;
    this.linkRoles = roles;
    this.linkBuildings = buildings;
    this.linkPhysicalInfos = physicalInfos;
  }
  clone(data) {
    return new Account(data);
  }
  async update(type) {
    var temp = JSON.parse(JSON.stringify(this));
    temp.account = "{Check}" + temp.account;
    var data = await api.authority
      .apiPatchAccountAuthority(type, temp)
      .then(async (response) => {
        return new Account(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  // async updateS() {
  //   //從設定頁面更新
  //   var temp = JSON.parse(JSON.stringify(this));
  //   temp.account = "{Check}" + temp.account;
  //   var data = await api.authority
  //     .apiPatchAccountAuthoritySetting(temp)
  //     .then(async (response) => {
  //       return new Account(response.result);
  //     })
  //     .catch((error) => {
  //       return {};
  //     });
  //   return data;
  // }
  // async updateP() {
  //   //basic住戶更新
  //   var temp = JSON.parse(JSON.stringify(this));
  //   temp.account = "{Check}" + temp.account;
  //   var data = await api.authority
  //     .apiPatchAccountAuthorityUser(temp)
  //     .then(async (response) => {
  //       return new Account(response.result);
  //     })
  //     .catch((error) => {
  //       return {};
  //     });
  //   return data;
  // }
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
      emergencyContact: "",
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
      verifyUsageOfFloor: false,
      moveWithDifficulty: false,
      linkRoles: [],
      linkBuildings: [],
    });
  }
  static getTableConfig() {
    return [
      {
        label: "大頭照",
        prop: "headShotFileId",
        formType: "photo",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        mandatory: false,
        isEdit: true,
        isUpload: false,
        isExport: false,
      },
      {
        label: "帳號",
        prop: "account",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: true,
        message: "請輸入帳號",
        maxlength: "10",
        placeholder: "請輸入帳號",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "密碼",
        prop: "password",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: true,
        message: "請輸入密碼",
        maxlength: "100",
        placeholder: "請輸入密碼",
        isCheck: false,
        isUpload: true,
        isExport: false,
      },
      {
        label: "用戶名",
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
        message: "請輸入用戶名",
        maxlength: "20",
        placeholder: "請輸入用戶名",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "性別",
        prop: "sex",
        formType: "boolean",
        format: "sexBoolean",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        type: "boolean",
        typemessage: "",
        mandatory: true,
        message: "請選擇性別",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "身份證",
        prop: "identityCard",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: false,
        maxlength: "10",
        placeholder: "請輸入身份證",
        isPattern: true,
        pattern: /^[A-Z]{1}[1-2]{1}[0-9]{8}$/,
        errorMsg: "格式錯誤,請重新輸入",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "年齡",
        prop: "birthday",
        formType: "date",
        format: "YYYY-MM-DD",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isEdit: true,
        mandatory: false,
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "電話",
        prop: "callNumber",
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
        placeholder: "請輸入電話",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "手機",
        prop: "cellPhoneNumber",
        formType: "inputString",
        isTable: false,
        isBlock: false,
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
        label: "緊急聯絡人",
        prop: "emergencyContact",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "10",
        placeholder: "請輸入緊急聯絡人",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "緊急電話",
        prop: "emergencyNumber",
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
        placeholder: "請輸入緊急電話",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "email",
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
        placeholder: "請輸入電子信箱",
        isPattern: true,
        pattern:
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
        errorMsg: "格式錯誤,請重新輸入",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "門牌",
        prop: "usageOfFloor",
        formType: "selectString",
        format: "floorOfHouseSelect",
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
        label: "行動不便者",
        prop: "moveWithDifficulty",
        formType: "checkbox",
        format: "moveWithDifficultyBoolean",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇是否為行動不便者",
        type: "boolean",
        typemessage: "",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "描述",
        prop: "description",
        formType: "inputString",
        format: "textarea",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        maxlength: "200",
        placeholder: "若為行動不便者，請輸入狀況",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "角色",
        prop: "linkRoles",
        formType: "select",
        format: "roleSelect",
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
        label: "狀態",
        prop: "status",
        formType: "boolean",
        format: "accountStatusSelect",
        isTable: false,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇狀態",
        type: "boolean",
        typemessage: "",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "刪除",
        prop: "removable",
        formType: "boolean",
        format: "removableSelect",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇是否允許刪除",
        type: "boolean",
        typemessage: "",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "大樓",
        prop: "linkBuildings",
        formType: "select",
        format: "buildingSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇建築物",
        type: "array",
        typemessage: "",
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
        placeholder: "請輸入備註",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
    ];
  }
  static getUserTableConfig() {
    return [
      {
        label: "大頭照",
        prop: "headShotFileId",
        formType: "photo",
        mandatory: false,
        maxlength: "15",
        isHidden: true,
        isSearch: false,
        placeholder: "請上傳大頭照",
        isAssociate: false,
        isEdit: true,
        isUpload: false,
        isExport: false,
        isBlock: false,
        selectFilter: false,
      },
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
        label: "緊急聯絡人",
        prop: "emergencyContact",
        mandatory: false,
        message: "請輸入緊急聯絡人",
        maxlength: "10",
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
        format: "floorOfHouseSelect",
        mandatory: false,
        maxlength: "15",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入職稱",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
        formType: "selectString",
      },
      {
        label: "行動不便者",
        prop: "moveWithDifficulty",
        format: "moveWithDifficultyBoolean",
        mandatory: true,
        message: "請選擇是否為行動不便者",
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
        label: "描述",
        prop: "description",
        format: "textarea",
        placeholder: "若為行動不便者，請輸入狀況",
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
  static getUserDistributedTableConfig() {
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
        label: "緊急聯絡人",
        prop: "emergencyContact",
        mandatory: false,
        message: "請輸入緊急聯絡人",
        maxlength: "10",
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
        label: "門牌",
        prop: "usageOfFloor",
        format: "floorOfHouseSelect",
        mandatory: false,
        maxlength: "15",
        isHidden: false,
        isSearch: true,
        placeholder: "請輸入職稱",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
        formType: "selectString",
      },
      {
        label: "行動不便者",
        prop: "moveWithDifficulty",
        format: "moveWithDifficultyBoolean",
        mandatory: true,
        message: "請選擇是否為行動不便者",
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
        label: "描述",
        prop: "description",
        format: "textarea",
        placeholder: "若為行動不便者，請輸入狀況",
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
    ];
  }
  static getRegisterTableConfig() {
    //會員註冊
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
        label: "緊急聯絡人",
        prop: "emergencyContact",
        mandatory: false,
        message: "請輸入緊急聯絡人",
        maxlength: "10",
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
        label: "行動不便者",
        prop: "moveWithDifficulty",
        format: "moveWithDifficultyBoolean",
        mandatory: true,
        message: "請選擇是否為行動不便者",
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
        label: "描述",
        prop: "description",
        format: "textarea",
        placeholder: "若為行動不便者，請輸入狀況",
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
        isEdit: true,
        isUpload: true,
        isExport: false,
        isBlock: false,
        selectFilter: false,
      },
    ];
  }
  static getHouseTableConfig() {
    //純住戶登記使用
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
        label: "行動不便者",
        prop: "moveWithDifficulty",
        format: "moveWithDifficultyBoolean",
        mandatory: true,
        message: "請選擇是否為行動不便者",
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
        label: "描述",
        prop: "description",
        format: "textarea",
        placeholder: "若為行動不便者，請輸入狀況",
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
        label: "驗證密碼",
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
        isEdit: true,
        isUpload: true,
        isExport: false,
        isBlock: false,
        selectFilter: false,
      },
    ];
  }
  static getChName() {
    return "帳號";
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
  static async getSearchPage(type, data) {
    var data = await api.authority
      .apiGetAccountAuthoritySearchPages(type, data)
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
  static async postPhoto(tgUserId, data, type) {
    var data = await api.authority
      .apiPostUserPhoto(tgUserId, data, type)
      .then((response) => {
        return response.result.headShotFileId;
      })
      .catch((error) => {
        return null;
      });
    return data;
  }
  static async updateData(type, data, isObj = false) {
    var data = await api.authority
      .apiPatchAccountAuthority(type, data)
      .then(async (response) => {
        if (isObj) {
          return new Account(response.result);
        } else {
          return true;
        }
      })
      .catch((error) => {
        if (isObj) {
          return {};
        } else {
          return false;
        }
      });
    return data;
  }
  static async upgrade(type, accountId) {
    var data = await api.authority
      .apiPatchAccountFloorOfHouse(type, accountId)
      .then(async (response) => {
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
  static async getDistributed(type, model) {
    var data = await api.authority
      .apiGetHouseAttributes(type, model)
      .then((response) => {
        console.log(JSON.stringify(response));
        return response.result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
}

export default Account;
