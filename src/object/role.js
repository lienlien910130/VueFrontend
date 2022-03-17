import Parent from "./parent";
import api from "@/api";

class Role extends Parent {
  constructor(data) {
    super(data);
    const { name, description, status, sort, removable } = data;
    this.name = name;
    this.description = description;
    this.status = status;
    this.sort = sort;
    this.removable = removable;
  }
  clone(data) {
    return new Role(data);
  }
  async update() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.name = "{Check}" + temp.name;
    var data = await api.authority
      .apiPatchRoleAuthority(temp)
      .then(async (response) => {
        return new Role(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async create() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.name = "{Check}" + temp.name;
    var data = await api.authority
      .apiPostRoleAuthority(temp)
      .then((response) => {
        return new Role(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.authority
      .apiDeleteRoleAuthority(this.id)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  //取得角色權限-角色&帳號
  async getAccess(type) {
    if (type == "role") {
      var data = await api.authority
        .apiGetAccountAuthorityByRole(this.id)
        .then((response) => {
          console.log(JSON.stringify(response));
          var array = [];
          response.result
            .sort((x, y) => x.id - y.id)
            .forEach((item) => {
              array.push(item.id);
            });
          return array;
        })
        .catch((error) => {
          return [];
        });
      return data;
    } else {
      var data = await api.authority
        .apiGetAccountAuthorityByAccount(this.id)
        .then((response) => {
          var array = [];
          response.result
            .sort((x, y) => x.id - y.id)
            .forEach((item) => {
              array.push(item.id);
            });
          return array;
        })
        .catch((error) => {
          return [];
        });
      return data;
    }
  }
  getName() {
    return this.name;
  }
  static empty() {
    return new Role({
      id: "",
      name: "",
      description: "",
      status: true,
      sort: 0,
      removable: false,
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
        placeholder: "請輸入描述",
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
    return "角色";
  }
  static async get() {
    var data = await api.authority
      .apiGetAllRole()
      .then((response) => {
        return response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new Role(item);
          });
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getOfID(id) {
    var data = await api.authority
      .apiGetRoleOfID(id)
      .then((response) => {
        return new Role(response.result[0]);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  static async getSearchPage(data) {
    var data = await api.authority
      .apiGetRoleAuthoritySearchPages(data)
      .then((response) => {
        response.result = response.result
          .sort((x, y) => x.sort - y.sort)
          .map((item) => {
            return new Role(item);
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
      .apiPostRoleAuthorities(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Role(item);
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
      .apiDeleteRoleAuthority(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  //角色多筆更新權限
  static async updateAccessAuthority(data) {
    var data = await api.authority
      .apiPutAuthorityByRole(data)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default Role;
