import {
  getToken,
  setToken,
  removeToken,
  getID,
  setID,
  removeID,
} from "../../utils/auth";
import idb from "../../utils/indexedDB";
import { resetRouter } from "../../router";
import user from "../../api/user.js";
import store from "../index.js";
import { Role, Building, PhysicalInfo } from "@/object/index";

// 個人資料
const getDefaultState = () => {
  return {
    token: getToken(),
    id: getID(),
    account: null,
    name: null,
    roles: "",
    level: "",
    mToken: "",
    physicalInfos: [],
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_USER: (state, id) => {
    state.id = id;
  },
  SET_LEVEL: (state, level) => {
    state.level = level;
  },
  SET_MToken: (state, token) => {
    state.mToken = token;
  },
  SET_PHYSICALINFOS: (state, physicalInfos) => {
    state.physicalInfos = physicalInfos;
  },
};

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      user
        .apiPostLogin({ account: username.trim(), password: password })
        .then((response) => {
          idb.getDb();
          commit("SET_TOKEN", response.accessToken); //store 儲存
          setToken(response.accessToken); //cookie儲存
          commit("SET_USER", response.userId); //store 儲存
          setID(response.userId); //cookie儲存
          resolve();
        })
        .catch((error) => {
          console.log("error.response.status=>" + error);
          alert("帳號密碼錯誤，請重新輸入");
          reject(error);
        });
    });
  },
  password({ commit }, data) {
    return new Promise((resolve, reject) => {
      user
        .apiPostPassword(data)
        .then((response) => {
          resolve("已寄送信件至信箱，請至信箱點選網址重設密碼!");
        })
        .catch((error) => {
          reject("此帳號尚未設定email，請聯繫水星服務人員");
        });
    });
  },
  checkReset({ commit }, data) {
    return new Promise((resolve, reject) => {
      user
        .apiPostCheckReset(data)
        .then((response) => {
          resolve(response.result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  resetPassword({ commit }, data) {
    return new Promise((resolve, reject) => {
      user
        .apiPatchResetPassword(data)
        .then((response) => {
          resolve(response.result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  ipconfig({ commit }) {
    return new Promise((resolve, reject) => {
      user
        .apiGetUserIP()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  async getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      user
        .apiGetUserInfo()
        .then(async (response) => {
          if (!response) {
            reject("登入失敗，請重新登入");
          }
          const {
            id,
            account,
            name,
            linkRoles,
            linkBuildings,
            linkPhysicalInfos,
          } = response.result[0];
          var roles =
            linkRoles !== undefined
              ? linkRoles.map((item) => {
                  return new Role(item);
                })
              : [];
          var buildingarray =
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
          commit("SET_ACCOUNT", account);
          commit("SET_NAME", name);
          commit("SET_ROLES", roles);
          commit("SET_PHYSICALINFOS", physicalInfos);
          store.dispatch(
            "building/setBuildingList",
            id == "1" ? await Building.get() : buildingarray
          );
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  saveToken({ commit }, token) {
    //手機_ws登入後取回token儲存
    commit("SET_TOKEN", token);
  },
  saveMToken({ commit }, cToken) {
    //手機_取得messageToken後儲存
    commit("SET_MToken", cToken);
  },
  saveUserID({ commit }, uid) {
    //手機_ws登入後取回userid儲存
    commit("SET_USER", uid);
  },
  saveUserRole({ commit }, role) {
    //手機_ws登入後取回userid儲存
    commit("SET_ROLES", role);
  },
  async setMessageToken({ commit, state }, value) {
    return new Promise(async (resolve, reject) => {
      var device = value.OsModel.split(",");
      var index = state.physicalInfos.findIndex((obj) => {
        return obj.name == device[0] && obj.model == device[1];
      });
      if (index !== -1 && state.physicalInfos[index].cToken !== value.token) {
        //更新
        var result = await PhysicalInfo.update({
          id: state.physicalInfos[index].id,
          cToken: value.token,
        });
        if (result) {
          state.physicalInfos[index].cToken = value.token;
        }
      } else if (index == -1) {
        //新增
        var result = await PhysicalInfo.create({
          name: device[0],
          cToken: value.token,
          model: device[1],
        });
        if (Object.keys(result).length !== 0) {
          var phy = _.cloneDeep(state.physicalInfos);
          phy.push({ id: result.id });
          user
            .apiPatchUserInfo({ id: state.id, linkPhysicalInfos: phy })
            .then(async (response) => {
              if (!response) {
                reject("更新訂閱失敗");
              }
              state.physicalInfos.push(result);
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        }
      } else {
        resolve();
      }
      commit("SET_MToken", value.token);
    });
  },
  // user logout
  logout({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      idb.deleteDb();
      store.dispatch("app/closeSideBar", { withoutAnimation: false });
      var phyIndex = state.physicalInfos.findIndex((item) => {
        return item.cToken == state.mToken;
      });
      if (phyIndex !== -1) {
        await PhysicalInfo.delete(state.physicalInfos[phyIndex].id);
      }

      removeToken();
      removeID();
      store.dispatch("building/resetBuildingid");
      commit("RESET_STATE");
      resetRouter();
      resolve();
    });
  },

  // remove token
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     removeToken()
  //     removeID()
  //     removeVersion()
  //     store.dispatch('building/resetBuildingid')
  //     idb.deleteDb()
  //     commit('RESET_STATE')
  //     resetRouter()
  //     resolve()
  //   })
  // }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
