import Parent from "./parent";
import api from "@/api";
import Menu from "./menu";
import Role from "./role";
class AccessAuthority extends Parent {
  constructor(data) {
    super(data);
    const {
      name,
      action,
      description,
      status,
      sort,
      removable,
      linkRoles,
      linkMainMenus,
    } = data;
    var mainMenu =
      linkMainMenus !== undefined
        ? linkMainMenus.map((item) => {
            return new Menu(item);
          })
        : [];
    var roles =
      linkRoles !== undefined
        ? linkRoles.map((item) => {
            return new Role(item);
          })
        : [];
    this.name = name;
    this.class = data.class;
    this.description = description;
    this.status = status;
    this.sort = sort;
    this.removable = removable;
    this.action = action;
    this.linkMainMenus = mainMenu;
    this.linkRoles = roles;
  }
  clone(data) {
    return new AccessAuthority(data);
  }
  async update() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.class = "{Check}" + temp.class;
    temp.action = "{Check}" + temp.action;
    var data = await api.authority
      .apiPatchAccessAuthority(temp)
      .then(async (response) => {
        return new AccessAuthority(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async create() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.class = "{Check}" + temp.class;
    temp.action = "{Check}" + temp.action;
    var data = await api.authority
      .apiPostAccessAuthority(temp)
      .then((response) => {
        return new AccessAuthority(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.authority
      .apiDeleteAccessAuthority(this.id)
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
  setlinkMainMenus(linkMainMenus) {
    this.linkMainMenus = linkMainMenus;
  }
  static empty() {
    return new AccessAuthority({
      id: "",
      name: "",
      class: "",
      description: "",
      status: true,
      sort: 0,
      removable: false,
      action: "",
      linkMainMenus: [],
      linkRoles: [],
    });
  }
  static getTableConfig() {
    return [
      {
        label: "名稱",
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
        message: "請輸入名稱",
        maxlength: "20",
        placeholder: "請輸入名稱",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "權限",
        prop: "action",
        formType: "selectString",
        format: "actionSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇權限",
        isCheck: true,
        isUpload: true,
        isExport: true,
      },
      {
        label: "描述",
        prop: "description",
        formType: "inputString",
        format: "textarea",
        isTable: true,
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
        label: "排序",
        prop: "sort",
        formType: "inputNumber",
        format: "inputnumber",
        isTable: true,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入0~999",
        maxlength: "3",
        placeholder: "請輸入0~999",
        type: "number",
        typemessage: "",
        isPattern: true,
        pattern: /^[0-9]{1,3}$/,
        errorMsg: "請輸入0~999",
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
        selectFilter: false,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇角色",
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
        isTable: true,
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
        isTable: true,
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
    ];
  }
  static getChName() {
    return "權限";
  }
  static async get(mainMenuId) {
    var data = await api.authority
      .apiGetMainMenuAccessAuthority(mainMenuId)
      .then((response) => {
        response.result = response.result
          .sort((x, y) => x.sort - y.sort)
          .map((item) => {
            return new AccessAuthority(item);
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
      .apiPostAccessAuthorities(data)
      .then((response) => {
        response.result = response.result
          .sort((x, y) => x.sort - y.sort)
          .map((item) => {
            return new AccessAuthority(item);
          });
        return response;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static async deleteMany(data) {
    var data = await api.authority
      .apiDeleteAccessAuthority(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default AccessAuthority;
