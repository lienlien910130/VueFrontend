import { notfound, mercuryfireRoutes, constantRoutes } from "@/router";
import store from "@/store";
import router from "@/router";
import { resetRouter } from "@/router";
import Menu from "@/object/menu";
import _import from "@/router/_import";
import Layout from "@/layout";

function addRouter(routerlist) {
  routerlist.forEach((e) => {
    delete e.description;
    delete e.status;
    delete e.sort;
    delete e.removable;
    delete e.linkAccessAuthorities;
    delete e.isDelete;
    delete e.createTime;
    delete e.id;
    var hasToCycle;
    if (e.linkMainMenus.length !== 0) {
      //有子階層
      hasToCycle = true;
      e.children = e.linkMainMenus;
    } else if (e.linkMainMenus.length == 0 && e.redirect !== "") {
      //只有一個階層
      hasToCycle = false;
      e.children = [
        {
          path: e.redirect,
          name: e.code,
          component: _import(e.code),
          meta: { title: e.name, icon: e.icon },
        },
      ];
      if (
        e.code == "sys-Setting" ||
        e.code == "sys-Building" ||
        e.code == "sys-Index"
      ) {
        e.hidden = true;
      }
    }
    //有子階層的父層級
    if (
      e.linkMainMenus !== undefined &&
      e.linkMainMenus.length !== 0 &&
      e.redirect !== ""
    ) {
      e.meta = { title: e.name, icon: e.icon };
      e.name = e.code;
    }
    if (e.code.indexOf("sys-") !== -1) {
      //第一階層
      e.component = Layout;
    } else {
      e.component = _import(e.code); // 動態匹配元件
      e.meta = { title: e.name, icon: e.icon };
      e.name = e.code;
      delete e.redirect;
    }
    // if (e.redirect === '') { //第二階層

    // }else if(e.code.indexOf('sys-') !== -1){ //第一階層
    //   e.component = Layout
    // }
    delete e.linkMainMenus;
    delete e.code;
    delete e.icon;
    if (e.children !== undefined && hasToCycle == true) {
      // 存在子路由就遞迴
      addRouter(e.children);
    }
  });
  return routerlist;
}

const state = {
  menuId: "",
  menuAuthority: [],
  menu: [],
  menuNoLevel: [],
  routes: [],
  addRoutes: [],
  needreload: false,
  navbarButton: false,
};

const mutations = {
  SET_MENUID: (state, menuId) => {
    state.menuId = menuId;
  },
  SET_MENUAUTHORITY: (state, menuAuthority) => {
    state.menuAuthority = menuAuthority;
  },
  SET_MENU: (state, menu) => {
    state.menu = menu;
  },
  SET_MENU_NOLEVEL: (state, menuNoLevel) => {
    state.menuNoLevel = menuNoLevel;
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
  SET_NEEDRELOAD: (state, needreload) => {
    state.needreload = needreload;
  },
  SET_NAVBARBUTTONVISIBLE: (state, isvisible) => {
    state.navbarButton = isvisible;
  },
};

const actions = {
  setmenuId({ commit }, menuId) {
    return new Promise((resolve, reject) => {
      commit("SET_MENUID", menuId);
      resolve();
    });
  },
  setmenuAuthority({ commit }, menuAuthority) {
    return new Promise((resolve, reject) => {
      commit("SET_MENUAUTHORITY", menuAuthority);
      resolve();
    });
  },
  setmenu({ commit }, menu) {
    return new Promise((resolve, reject) => {
      commit("SET_MENU", menu);
      var array = [];
      for (let element of menu) {
        array.push(element);
        array.push(element.linkMainMenus);
        element.linkMainMenus.forEach((obj) => {
          array.push(obj.linkMainMenus);
        });
      }
      var concatarray = array.reduce(function (a, b) {
        return a.concat(b);
      }, []);
      commit("SET_MENU_NOLEVEL", concatarray);
      resolve();
    });
  },
  async generateRoutes({ commit }, roles) {
    //起始選單
    let accessedRoutes = [];
    if (roles) {
      accessedRoutes = mercuryfireRoutes || [];
    }
    accessedRoutes = accessedRoutes.concat(notfound);
    commit("SET_ROUTES", accessedRoutes);
    return accessedRoutes;
  },
  async setRoutes({ commit }) {
    //設定側邊選單
    resetRouter();
    var data = await Menu.get();
    store.dispatch("permission/setmenu", data);
    var menucopy = data.map((item) => {
      if (item.linkMainMenus.length) {
        item.linkMainMenus = item.linkMainMenus.sort((x, y) => x.sort - y.sort);
      }
      item.linkMainMenus.forEach((obj) => {
        obj.linkMainMenus = obj.linkMainMenus.sort((x, y) => x.sort - y.sort);
      });
      return item.clone(item);
    });
    var getRouter = addRouter(menucopy);
    getRouter = getRouter
      .filter((item) => {
        return item.path !== "/";
      })
      .concat(notfound);
    commit("SET_ROUTES", getRouter);
    router.addRoutes(getRouter);
  },
  // setneedreload({ commit }, needreload) {
  //   return new Promise((resolve, reject) => {
  //     commit('SET_NEEDRELOAD', needreload)
  //     resolve()
  //   })
  // },
  setnavbarButton({ commit }, isVisible) {
    return new Promise((resolve, reject) => {
      commit("SET_NAVBARBUTTONVISIBLE", isVisible);
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
