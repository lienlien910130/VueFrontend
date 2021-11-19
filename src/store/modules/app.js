import Cookies from "js-cookie";

const state = {
  sidebar: {
    opened: Cookies.get("sidebarStatus")
      ? !!+Cookies.get("sidebarStatus")
      : false,
    withoutAnimation: false,
  },
  device: "desktop",
  fullscreen: false,
  redirect: undefined,
};

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  OPEN_SIDEBAR: (state) => {
    Cookies.set("sidebarStatus", 1);
    state.sidebar.opened = true;
    state.sidebar.withoutAnimation = false;
  },
  TOGGLE_SCREEN: (state, fullscreen) => {
    state.fullscreen = fullscreen;
  },
  SAVE_REDIRECT: (state, redirect) => {
    state.redirect = redirect;
  },
};

const actions = {
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device);
  },
  toggleScreen({ commit }, fullscreen) {
    commit("TOGGLE_SCREEN", fullscreen);
  },
  openSideBar({ commit }) {
    commit("OPEN_SIDEBAR");
  },
  saveRedirect({ commit }, redirect) {
    commit("SAVE_REDIRECT", redirect);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
