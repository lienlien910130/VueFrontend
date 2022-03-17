import Parent from "./parent";
import api from "@/api";
import AccessAuthority from "./accessAuthority";
class Menu extends Parent {
  constructor(data) {
    super(data);
    const {
      name,
      description,
      status,
      sort,
      removable,
      code,
      path,
      redirect,
      icon,
      linkMainMenus,
      linkAccessAuthorities,
    } = data;
    var mainMenu =
      linkMainMenus !== undefined
        ? linkMainMenus.map((item) => {
            return new Menu(item);
          })
        : [];
    var accessAuthority =
      linkAccessAuthorities !== undefined
        ? linkAccessAuthorities
            .sort((x, y) => x.sort - y.sort)
            .map((item) => {
              return new AccessAuthority(item);
            })
        : [];
    this.name = name;
    this.description = description;
    this.status = status;
    this.sort = sort;
    this.removable = removable;
    this.code = code;
    this.path = path;
    this.redirect = redirect;
    this.icon = icon;
    this.linkMainMenus = mainMenu;
    this.linkAccessAuthorities = accessAuthority;
  }
  clone(data) {
    return new Menu(data);
  }
  async getBelow() {
    var data = await api.authority
      .apiGetMainMenuAuthority(this.id)
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.sort - y.sort)
          .map((item) => {
            return new Menu(item);
          });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  async update() {
    var data = await api.authority
      .apiPatchMainMenuAuthority(this)
      .then(async (response) => {
        return new Menu(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async create(mainMenuId = null) {
    if (mainMenuId == null) {
      var data = await api.authority
        .apiPostMainMenu(this)
        .then((response) => {
          return new Menu(response.result);
        })
        .catch((error) => {
          return {};
        });
      return data;
    } else {
      var data = await api.authority
        .apiPostSubMainMenu(mainMenuId, this)
        .then((response) => {
          return new Menu(response.result);
        })
        .catch((error) => {
          return {};
        });
      return data;
    }
  }
  async delete() {
    var data = await api.authority
      .apiDeleteMainMenuAuthority(this.id)
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
  getCode() {
    return this.code;
  }
  getAccessAuthorities() {
    return this.linkAccessAuthorities;
  }
  getLink() {
    return this.linkMainMenus.sort((x, y) => x.sort - y.sort);
  }
  static empty() {
    return new Menu({
      id: "",
      name: "",
      description: "",
      status: true,
      sort: 0,
      removable: false,
      code: "",
      path: "",
      redirect: "",
      icon: "",
      linkMainMenus: [],
      linkAccessAuthorities: [],
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
        label: "Code",
        prop: "code",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: false,
        isEdit: true,
        mandatory: true,
        message: "請輸入Code",
        maxlength: "40",
        placeholder: "請輸入Code",
        isCheck: false,
        isUpload: true,
        isExport: false,
      },
      {
        label: "路徑",
        prop: "path",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入路徑",
        maxlength: "40",
        placeholder: "請輸入路徑",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "導向",
        prop: "redirect",
        formType: "inputString",
        isTable: false,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "40",
        placeholder: "請輸入導向，若為子目錄，請勿輸入值",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "圖示",
        prop: "icon",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "40",
        placeholder: "請輸入圖示名稱",
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
    return "選單";
  }
  static async get() {
    var data = await api.authority
      .apiGetBuildingMainMenuAuthority()
      .then((response) => {
        console.log(JSON.stringify(response));
        var result = response.result
          .sort((x, y) => x.sort - y.sort)
          .map((item) => {
            return new Menu(item);
          });
        result.forEach((element) => {
          element.getLink().sort((x, y) => x.sort - y.sort);
        });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async postMany(data) {
    const { mainMenuId, content } = data;
    var data = await api.authority
      .apiPostMainMenus(mainMenuId, content)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Menu(item);
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
      .apiDeleteMainMenuAuthority(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default Menu;
