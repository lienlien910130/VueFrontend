import {
  getBuildingid,
  setBuildingid,
  removeBuildingid,
} from "../../utils/auth";
import {
  Device,
  Contactunit,
  Floors,
  Building,
  Role,
  Setting,
  UsageOfFloor,
  DeviceType,
  DeviceAddressManagement,
  Account,
  Committee,
} from "@/object/index";

// 個人資料
const getDefaultState = () => {
  return {
    roles: [],
    buildingid: getBuildingid(),
    buildinginfo: [],
    buildingarray: [],
    buildingoptions: [],
    buildingcontactunit: [],
    buildingusers: [],
    buildingdevices: [],
    buildingfloors: [],
    buildingfloorOfHouse: [],
    buildingdeviceType: [],
    buildingaddress: [],
    buildingcommittee: [],
    deviceType: [],
    deviceTypeNoLevel: [],
    account: [],
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_BUILDINGID: (state, buildingid) => {
    state.buildingid = buildingid;
  },
  SET_BUILDINGINFO: (state, buildinginfo) => {
    state.buildinginfo = buildinginfo;
  },
  SET_BUILDINGLIST: (state, buildingarray) => {
    state.buildingarray = buildingarray;
  },
  SET_BUILDINGOPTIONS: (state, buildingoptions) => {
    state.buildingoptions = buildingoptions;
  },
  SET_BUILDINGCONTACTUNIT: (state, buildingcontactunit) => {
    state.buildingcontactunit = buildingcontactunit;
  },
  SET_BUILDINGCOMMITTEE: (state, buildingcommittee) => {
    state.buildingcommittee = buildingcommittee;
  },
  SET_BUILDINGUSERS: (state, buildingusers) => {
    state.buildingusers = buildingusers;
  },
  SET_BUILDINGDEVICES: (state, buildingdevices) => {
    state.buildingdevices = buildingdevices;
  },
  SET_BUILDINGFLOORS: (state, buildingfloors) => {
    state.buildingfloors = buildingfloors;
  },
  SET_BUILDINGFLOOROFHOUSE: (state, buildingfloorOfHouse) => {
    state.buildingfloorOfHouse = buildingfloorOfHouse;
  },
  SET_DEFAULTDEVICETYPE: (state, deviceType) => {
    state.deviceType = deviceType;
  },
  SET_DEFAULTDEVICETYPENOLEVEL: (state, deviceType) => {
    state.deviceTypeNoLevel = deviceType;
  },
  SET_DEVICETYPE: (state, deviceType) => {
    state.buildingdeviceType = deviceType;
  },
  SET_ADDRESSMANAGEMENT: (state, buildingaddress) => {
    state.buildingaddress = buildingaddress;
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account;
  },
};

const actions = {
  async setBuildingID({ commit }, buildingid) {
    commit("SET_BUILDINGID", buildingid);
    setBuildingid(buildingid);
  },
  //建築物清單-系統管理員
  setBuildingList({ commit }, buildingarray) {
    //登入時儲存store
    return new Promise((resolve, reject) => {
      commit("SET_BUILDINGLIST", buildingarray);
      resolve();
    });
  },
  addBuildingList({ commit }, content) {
    state.buildingarray.push(content);
  },
  updateBuildingList({ commit }, content) {
    var index = state.buildingarray.findIndex((item) => {
      return item.id === content.id;
    });
    if (index !== -1) {
      Object.keys(content).forEach((item) => {
        state.buildingarray[index][item] = content[item];
      });
      // state.buildingarray[index] = content;
    }
  },
  deleteBuildingList({ commit }, id) {
    var deleteList = id.split(",");
    var obj = state.buildingarray.filter((item) => {
      return deleteList.findIndex((obj) => obj === item.id) == -1;
    });
    commit("SET_BUILDINGLIST", obj);
  },
  //建築物資訊-正在選取的建築物才更新
  setBuildingInfo({ commit }, buildinginfo) {
    return new Promise((resolve, reject) => {
      // console.log(buildinginfo)
      commit("SET_BUILDINGINFO", buildinginfo);
      resolve();
    });
  },
  //角色-正在選取的建築物才更新
  async setroles({ commit }) {
    var data = await Role.get();
    commit("SET_ROLES", data);
  },
  addRole({ commit }, content) {
    content.forEach((element) => {
      state.roles.push(element);
    });
  },
  updateRole({ commit }, content) {
    var index = state.roles.findIndex((item) => {
      return item.id === content.id;
    });
    if (index !== -1) {
      Object.keys(content).forEach((item) => {
        state.roles[index][item] = content[item];
      });
      //state.roles[index] = content;
    }
  },
  deleteRole({ commit }, id) {
    var deleteList = id.split(",");
    var obj = state.roles.filter((item) => {
      return deleteList.findIndex((obj) => obj === item.id) == -1;
    });
    commit("SET_ROLES", obj);
  },
  //帳號-正在選取的建築物才更新
  async setaccounts({ commit }) {
    var data = await Account.get();
    commit("SET_ACCOUNT", data);
  },
  addAccount({ commit }, content) {
    content.forEach((element) => {
      state.account.push(element);
    });
  },
  updateAccount({ commit }, content) {
    var index = state.account.findIndex((item) => {
      return item.id === content.id;
    });
    if (index !== -1) {
      Object.keys(content).forEach((item) => {
        state.account[index][item] = content[item];
      });
      //state.account[index] = content;
    }
  },
  deleteAccount({ commit }, id) {
    var deleteList = id.split(",");
    var obj = state.account.filter((item) => {
      return deleteList.findIndex((obj) => obj === item.id) == -1;
    });
    commit("SET_ACCOUNT", obj);
  },
  //設定-正在選取的建築物才更新
  async setoptions({ commit }, data = null) {
    var data = data == null ? await Setting.getAllOption() : data;
    commit("SET_BUILDINGOPTIONS", data);
  },
  addOption({ commit }, content) {
    state.buildingoptions.push(content);
  },
  updateOption({ commit }, content) {
    var index = state.buildingoptions.findIndex((item) => {
      return item.id === content.id;
    });
    if (index !== -1) {
      Object.keys(content).forEach((item) => {
        state.buildingoptions[index][item] = content[item];
      });
    }
  },
  deleteOption({ commit }, id) {
    var obj = state.buildingoptions.filter((item) => {
      return item.id !== id;
    });
    commit("SET_BUILDINGOPTIONS", obj);
  },
  //樓層-正在選取的建築物才更新
  async setFloors({ commit }) {
    var data = await Floors.get();
    commit("SET_BUILDINGFLOORS", data);
  },
  updateFloor({ commit }, content) {
    var index = state.buildingfloors.findIndex((item) => {
      return item.id === content.id;
    });
    if (index !== -1) {
      Object.keys(content).forEach((item) => {
        state.buildingfloors[index][item] = content[item];
      });
      //state.buildingfloors[index] = content;
    }
  },
  //管委會資料
  async setCommittee({ commit }) {
    var data = await Committee.get();
    commit("SET_BUILDINGCOMMITTEE", data);
  },
  addCommittee({ commit }, content) {
    content.forEach((element) => {
      state.buildingcommittee.push(element);
    });
  },
  updateCommittee({ commit }, content) {
    var index = state.buildingcommittee.findIndex((item) => {
      return item.id === content.id;
    });
    if (index !== -1) {
      Object.keys(content).forEach((item) => {
        state.buildingcommittee[index][item] = content[item];
      });
      //state.buildingcommittee[index] = content;
    }
  },
  deleteCommittee({ commit }, id) {
    var deleteList = id.split(",");
    var obj = state.buildingcommittee.filter((item) => {
      return deleteList.findIndex((obj) => obj === item.id) == -1;
    });
    commit("SET_BUILDINGCOMMITTEE", obj);
  },
  //廠商資料
  async setContactunit({ commit }) {
    var data = await Contactunit.get();
    commit("SET_BUILDINGCONTACTUNIT", data);
  },
  addContactunit({ commit }, content) {
    content.forEach((element) => {
      state.buildingcontactunit.push(element);
    });
  },
  updateContactunit({ commit }, content) {
    var index = state.buildingcontactunit.findIndex((item) => {
      return item.id === content.id;
    });
    if (index !== -1) {
      Object.keys(content).forEach((item) => {
        state.buildingcontactunit[index][item] = content[item];
      });
      //state.buildingcontactunit[index] = content;
    }
  },
  deleteContactunit({ commit }, id) {
    var deleteList = id.split(",");
    var obj = state.buildingcontactunit.filter((item) => {
      return deleteList.findIndex((obj) => obj === item.id) == -1;
    });
    commit("SET_BUILDINGCONTACTUNIT", obj);
  },
  //門牌
  async setFloorOfHouse({ commit }) {
    var data = await UsageOfFloor.getAll();
    commit("SET_BUILDINGFLOOROFHOUSE", data);
  },
  addFloorOfHouse({ commit }, content) {
    content.forEach((element) => {
      state.buildingfloorOfHouse.push(element);
    });
  },
  updateFloorOfHouse({ commit }, content) {
    var index = state.buildingfloorOfHouse.findIndex((item) => {
      return item.id === content.id;
    });
    if (index !== -1) {
      Object.keys(content).forEach((item) => {
        state.buildingfloorOfHouse[index][item] = content[item];
      });
      //state.buildingfloorOfHouse[index] = content;
    }
  },
  deleteFloorOfHouse({ commit }, id) {
    var deleteList = id.split(",");
    var obj = state.buildingfloorOfHouse.filter((item) => {
      return deleteList.findIndex((obj) => obj === item.id) == -1;
    });
    commit("SET_BUILDINGFLOOROFHOUSE", obj);
  },
  //設備
  async setDevice({ commit }) {
    var data = await Device.get();
    commit("SET_BUILDINGDEVICES", data);
  },
  addDevice({ commit }, content) {
    content.forEach((element) => {
      state.buildingdevices.push(element);
    });
  },
  updateDevice({ commit }, content) {
    var index = state.buildingdevices.findIndex((item) => {
      return item.id === content.id;
    });
    if (index !== -1) {
      Object.keys(content).forEach((item) => {
        state.buildingdevices[index][item] = content[item];
      });
      //state.buildingdevices[index] = content;
    }
  },
  deleteDevice({ commit }, id) {
    var deleteList = id.split(",");
    var obj = state.buildingdevices.filter((item) => {
      return deleteList.findIndex((obj) => obj === item.id) == -1;
    });
    commit("SET_BUILDINGDEVICES", obj);
  },
  //設備種類
  async setDeviceType({ commit }) {
    var data = await DeviceType.get();
    commit("SET_DEVICETYPE", data);
  },
  addDeviceType({ commit }, content) {
    content.forEach((element) => {
      state.buildingdeviceType.push(element);
    });
  },
  updateDeviceType({ commit }, content) {
    var index = state.buildingdeviceType.findIndex((item) => {
      return item.id === content.id;
    });
    if (index !== -1) {
      Object.keys(content).forEach((item) => {
        state.buildingdeviceType[index][item] = content[item];
      });
      //state.buildingdeviceType[index] = content;
    }
  },
  deleteDeviceType({ commit }, id) {
    var deleteList = id.split(",");
    var obj = state.buildingdeviceType.filter((item) => {
      return deleteList.findIndex((obj) => obj === item.id) == -1;
    });
    commit("SET_DEVICETYPE", obj);
  },
  updateDeviceOfDeviceType({ commit }, id) {
    // var deviceList = state.buildingdevices
    // var obj = deviceList.filter((item)=>{
    //   return
    // })
  },
  //點位
  async setAddressManagement({ commit }) {
    var data = await DeviceAddressManagement.get();
    commit("SET_ADDRESSMANAGEMENT", data);
  },
  addAddressManagement({ commit }, content) {
    content.forEach((element) => {
      state.buildingaddress.push(element);
    });
  },
  updateAddressManagement({ commit }, content) {
    var index = state.buildingaddress.findIndex((item) => {
      return item.id === content.id;
    });
    if (index !== -1) {
      Object.keys(content).forEach((item) => {
        state.buildingaddress[index][item] = content[item];
      });
      //state.buildingaddress[index] = content;
    }
  },
  deleteAddressManagement({ commit }, id) {
    var deleteList = id.split(",");
    var obj = state.buildingaddress.filter((item) => {
      return deleteList.findIndex((obj) => obj === item.id) == -1;
    });
    commit("SET_ADDRESSMANAGEMENT", obj);
  },
  //預設設備種類
  setDefaultDeviceType({ commit }, deviceType) {
    return new Promise((resolve, reject) => {
      commit("SET_DEFAULTDEVICETYPE", deviceType);
      var data = [];
      for (let item of deviceType) {
        var v = item.value;
        for (let children of item.children) {
          var c = children.value;
          var childrenValueArray = c.split(".");
          if (children.children == undefined) {
            data.push({
              value: children.value,
              label: children.label,
              typelabel: item.label,
              typevalue: [v],
              icontype: childrenValueArray[2],
              status: children.status !== undefined ? children.status : [],
              action: children.action !== undefined ? children.action : [],
            });
          } else {
            for (let element of children.children) {
              var e = element.value;
              var elementValueArray = e.split(".");
              data.push({
                value: element.value,
                label: element.label,
                typelabel: item.label + "/" + children.label,
                typevalue: [v, c],
                icontype: elementValueArray[2],
                status: element.status !== undefined ? element.status : [],
                action: element.action !== undefined ? element.action : [],
              });
            }
          }
        }
      }
      commit("SET_DEFAULTDEVICETYPENOLEVEL", data);
      resolve();
    });
  },
  resetBuildingid({ commit }) {
    return new Promise((resolve) => {
      removeBuildingid();
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
