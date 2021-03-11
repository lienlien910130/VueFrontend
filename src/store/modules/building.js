import  {
  getBuildingid,setBuildingid,removeBuildingid
 }  from '../../utils/auth'
import idb from '../../utils/indexedDB'

// 個人資料
const getDefaultState = () => {
  return {
    roles:[],
    buildingid: getBuildingid() ,
    buildinginfo: [],
    buildingarray : [],
    buildingoptions: [],
    buildingcontactunit : [],
    buildingusers : [],
    buildingdevices : [],
    buildingfloors:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_BUILDINGID: (state, buildingid) => {
    state.buildingid = buildingid
  },
  SET_BUILDINGINFO: (state, buildinginfo) => {
    state.buildinginfo = buildinginfo
  },
  SET_BUILDINGARRAY: (state, buildingarray) => {
    state.buildingarray = buildingarray
  },
  SET_BUILDINGOPTIONS: (state, buildingoptions) => {
    state.buildingoptions = buildingoptions
  },
  SET_BUILDINGCONTACTUNIT: (state, buildingcontactunit) => {
    state.buildingcontactunit = buildingcontactunit
  },
  SET_BUILDINGUSERS: (state, buildingusers) => {
    state.buildingusers = buildingusers
  },
  SET_BUILDINGDEVICES: (state, buildingdevices) => {
    state.buildingdevices = buildingdevices
  },
  SET_BUILDINGFLOORS: (state, buildingfloors) => {
    state.buildingfloors = buildingfloors
  }
}

const actions = {
  async getroles({ commit }) { //從網頁資料庫取出來儲存在store上
    let roles = await idb.getValue('roles')
    console.log('roles',roles)
    commit('SET_ROLES', roles)
  },
  setroles({ commit }, roles) { 
    return new Promise((resolve, reject) => {
      commit('SET_ROLES', roles)
      idb.deleteData('roles')
      idb.saveValue('roles',roles)
      resolve()
    })
  },
  async setbuildingid({ commit }, buildingid){
    commit('SET_BUILDINGID', buildingid)
    setBuildingid(buildingid)
  },
  async getbuildinginfo({ commit }) { //從網頁資料庫取出來儲存在store上
    let buildinginfo = await idb.getValue('buildingInfo')
    commit('SET_BUILDINGINFO', buildinginfo)
  },
  setbuildinginfo({ commit }, buildinginfo) { 
    return new Promise((resolve, reject) => {
      commit('SET_BUILDINGINFO', buildinginfo)
      idb.deleteData('buildingInfo')
      idb.saveValue('buildingInfo',buildinginfo)
      resolve()
    })
  },
  async getbuildingarray({ commit }) { //從網頁資料庫取出來儲存在store上
    let buildingarray = await idb.getValue('buildingList')
    commit('SET_BUILDINGARRAY', buildingarray)
  },
  setbuildingarray({ commit }, buildingarray) { //登入時儲存再網頁資料庫&store
    return new Promise((resolve, reject) => {
        commit('SET_BUILDINGARRAY', buildingarray)
        idb.deleteData('buildingList')
        idb.saveValue('buildingList',buildingarray)
        resolve()
    })
  },
  async getbuildingoptions({ commit }) { //從網頁資料庫取出來儲存在store上
    let buildingoptions = await idb.getValue('buildingOptions')
    commit('SET_BUILDINGOPTIONS', buildingoptions)
  },
  setbuildingoptions({ commit }, buildingoptions) {
    return new Promise((resolve, reject) => {
        commit('SET_BUILDINGOPTIONS', buildingoptions)
        idb.deleteData('buildingOptions')
        idb.saveValue('buildingOptions',buildingoptions)
        resolve()
    })
  },
  async getbuildingcontactunit({ commit }) { //從網頁資料庫取出來儲存在store上
    let buildingcontactunit = await idb.getValue('buildingContactunit')
    commit('SET_BUILDINGCONTACTUNIT', buildingcontactunit)
  },
  setbuildingcontactunit({ commit }, buildingcontactunit) {
    return new Promise((resolve, reject) => {
        commit('SET_BUILDINGCONTACTUNIT', buildingcontactunit)
        idb.deleteData('buildingContactunit')
        idb.saveValue('buildingContactunit',buildingcontactunit)
        resolve()
    })
  },
  async getbuildingusers({ commit }) { //從網頁資料庫取出來儲存在store上
    let buildingusers = await idb.getValue('buildingUsers')
    commit('SET_BUILDINGUSERS', buildingusers)
  },
  setbuildingusers({ commit }, buildingusers) {
    return new Promise((resolve, reject) => {
        commit('SET_BUILDINGUSERS', buildingusers)
        idb.deleteData('buildingUsers')
        idb.saveValue('buildingUsers',buildingusers)
        resolve()
    })
  },
  async getbuildingdevices({ commit }) { //從網頁資料庫取出來儲存在store上
    let buildingdevices = await idb.getValue('buildingDevices')
    commit('SET_BUILDINGDEVICES', buildingdevices)
  },
  setbuildingdevices({ commit }, buildingdevices) {
    return new Promise((resolve, reject) => {
        commit('SET_BUILDINGDEVICES', buildingdevices)
        idb.deleteData('buildingDevices')
        idb.saveValue('buildingDevices',buildingdevices)
        resolve()
    })
  },
  async getbuildingfloors({ commit }) { //從網頁資料庫取出來儲存在store上
    let buildingfloors = await idb.getValue('buildingFloors')
    commit('SET_BUILDINGFLOORS', buildingfloors)
  },
  setbuildingfloors({ commit }, buildingfloors) {
    return new Promise((resolve, reject) => {
        commit('SET_BUILDINGFLOORS', buildingfloors)
        idb.deleteData('buildingFloors')
        idb.saveValue('buildingFloors',buildingfloors)
        resolve()
    })
  },
  resetBuildingid({ commit }) {
    return new Promise(resolve => {
      removeBuildingid()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

