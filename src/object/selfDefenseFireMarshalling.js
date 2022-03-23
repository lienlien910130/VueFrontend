import Parent from "./parent";
import api from "@/api";
import Account from "./account";
import Role from "./role";
import { Floors, SampleNodeList } from ".";

//自衛消防編組
class SelfDefenseFireMarshallingMgmt extends Parent {
  constructor(data) {
    super(data);
    const {
      name,
      classLeaderId,
      linkRoles,
      linkAccountList,
      linkContingencyProcess,
      linkFloors,
    } = data;
    var roles =
      linkRoles !== undefined
        ? linkRoles.map((item) => {
            return new Role(item);
          })
        : [];
    var account =
      linkAccountList !== undefined
        ? linkAccountList.map((item) => {
            return new Account(item);
          })
        : [];
    var process =
      linkContingencyProcess !== undefined
        ? linkContingencyProcess.map((item) => {
            return new ContingencyProcess(item);
          })
        : [];
    var floor =
      linkFloors !== undefined
        ? linkFloors.map((item) => {
            return new Floors(item);
          })
        : new Array([]).map((item) => {
            return new Floors(item);
          });
    this.name = name;
    this.classLeaderId = classLeaderId;
    this.linkRoles = roles;
    this.linkAccountList = account;
    this.linkFloors = floor;
    this.linkContingencyProcess = process;
  }
  clone(data) {
    return new SelfDefenseFireMarshallingMgmt(data);
  }
  async update() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.name = "{Check}" + temp.name;
    var data = await api.selfDefenseFireMarshalling
      .apiPutFireMarshallingMgmt(temp)
      .then(async (response) => {
        return new SelfDefenseFireMarshallingMgmt(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async create() {
    var temp = JSON.parse(JSON.stringify(this));
    temp.name = "{Check}" + temp.name;
    var data = await api.selfDefenseFireMarshalling
      .apiPostFireMarshallingMgmt(temp)
      .then((response) => {
        return new SelfDefenseFireMarshallingMgmt(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.selfDefenseFireMarshalling
      .apiDeleteFireMarshallingMgmt(this.id)
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
  getLinkRole() {
    return this.linkRoles;
  }
  static empty() {
    return new SelfDefenseFireMarshallingMgmt({
      id: "",
      name: "",
      classLeaderId: null,
      linkRoles: [],
      linkAccountList: [],
      linkFloors: [],
      linkContingencyProcess: [],
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
        label: "樓層",
        prop: "linkFloors",
        formType: "select",
        format: "manyFloorSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇樓層",
        type: "array",
        typemessage: "",
        isCheck: false,
        isUpload: false,
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
        hasEvent: true,
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "帳號",
        prop: "linkAccountList",
        formType: "select",
        format: "accountSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: false,
        type: "array",
        typemessage: "",
        hasEvent: true,
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "班長",
        prop: "classLeaderId",
        formType: "selectString",
        format: "classLeaderSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇班長",
        type: "string",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "流程圖",
        prop: "linkContingencyProcess",
        formType: "select",
        format: "processList",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        type: "array",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
    ];
  }
  //selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt
  //emergencyResponseFlowEdit/flowEditMgmt
  static async getOfFloor(type, floorId) {
    var data = await api.selfDefenseFireMarshalling
      .apiGetMarshallingMgmtOfFloor(type, floorId)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new SelfDefenseFireMarshallingMgmt(item);
        });
        return response.result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
}

//細項內的流程圖
class ContingencyProcess extends Parent {
  constructor(data) {
    super(data);
    const { name } = data;
    this.name = name;
  }
  clone(data) {
    return new ContingencyProcess(data);
  }
  getName() {
    return this.name;
  }
  static empty() {
    return new ContingencyProcess({
      id: "",
      name: "",
    });
  }
  static getTableConfig() {
    return [
      {
        label: "班別",
        prop: "selfDefenseFireMarshallingMgmt",
        formType: "selectString",
        format: "marshallingMgmtSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: false,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇班別",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "流程圖名稱",
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
    ];
  }
  static async create(data) {
    var mgmtId = data.selfDefenseFireMarshallingMgmt;
    // var temp = JSON.parse(JSON.stringify(data))
    // temp.name = '{Check}'+temp.name
    var data = await api.selfDefenseFireMarshalling
      .apiPostContingencyProcess(mgmtId, data)
      .then((response) => {
        return response.result.id;
      })
      .catch((error) => {
        return null;
      });
    return data;
  }
  static async update(data) {
    // var temp = JSON.parse(JSON.stringify(data))
    // temp.name = '{Check}'+temp.name
    var data = await api.selfDefenseFireMarshalling
      .apiPatchContingencyProcess(data)
      .then(async (response) => {
        return response.result.id;
      })
      .catch((error) => {
        return null;
      });
    return data;
  }
  static async delete(id) {
    var data = await api.selfDefenseFireMarshalling
      .apiDeleteContingencyProcess(id)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static async get(mgmtId) {
    var data = await api.selfDefenseFireMarshalling
      .apiGetContingencyProcess(mgmtId)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new ContingencyProcess(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async saveJson(pid, data) {
    var data = await api.selfDefenseFireMarshalling
      .apiPostContingencyProcessJson(pid, data)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  ///emergencyResponseFlowView/contingencyProcess
  //emergencyResponseFlowEdit/flowEditContingencyProcess
  static async getJson(type, pid) {
    var data = await api.selfDefenseFireMarshalling
      .apiGetContingencyProcessJson(type, pid)
      .then(async (response) => {
        return response.result;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static async getSampleNode() {
    var data = await api.selfDefenseFireMarshalling
      .apiGetAllOfMarshallingSampleNode()
      .then(async (response) => {
        var array = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new SampleNodeList(item);
          });
        return array;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getAccountByRole(type, roleId) {
    var data = await api.selfDefenseFireMarshalling
      .apiGetAccountByRole(type, roleId)
      .then((response) => {
        var array = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new Account(item);
          });
        return array;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
}

export { SelfDefenseFireMarshallingMgmt, ContingencyProcess };
