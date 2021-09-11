
const getDefaultState = () => {
    return {
      role_record: 0,
      menu_record: 0,
      contactunit_record: 0,
      device_record: 0,
      floor_record: 0,
      deviceType_record: 0,
      setting_record: 0,
      floorOfHouse_record: 0,
      householder_record: 0,
      addressManagement_record: 0,
      account_record: 0
    }
  }
  
  const state = getDefaultState()

  const mutations = {
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    },
    SET_ROLECORD: (state, record) => {
      state.role_record = record
    },
    SET_ACCOUNTCORD: (state, record) => {
      state.account_record = record
    },
    // SET_MENUCORD: (state, record) => {
    //     state.menu_record = record
    // },
    SET_CONTACTUNITCORD: (state, record) => {
        state.contactunit_record = record
    },
    SET_DEVICECORD: (state, record) => {
        state.device_record = record
    },
    SET_SETTINGCORD: (state, record) => {
      state.setting_record = record
    },
    SET_FLOORCORD: (state, record) => {
      state.floor_record = record
    },
    SET_FLOOROFHOUSECORD: (state, record) => {
      state.floorOfHouse_record = record
    },
    SET_HOUSEHOLDERCORD: (state, record) => {
      state.householder_record = record
    },
    SET_DEVICETYPECORD: (state, record) => {
      state.deviceType_record = record
    },
    SET_ADDRESSMANAGEMENTCORD: (state, record) => {
      state.addressManagement_record = record
    },
}
  
const actions = {
    saveRoleRecord({ commit } ,data){
      commit('SET_ROLECORD', data)
    },
    saveAccountRecord({ commit } ,data){
      commit('SET_ACCOUNTCORD', data)
    },
    saveSettingRecord({ commit } ,data){
      commit('SET_SETTINGCORD', data)
    },
    saveFloorRecord({ commit } ,data){
      commit('SET_FLOORCORD', data)
    },
    saveFloorOfHouseRecord({ commit } ,data){
      commit('SET_FLOOROFHOUSECORD', data)
    },
    saveHouseHolderRecord({ commit } ,data){
      commit('SET_HOUSEHOLDERCORD', data)
    },
    saveDeviceRecord({ commit } ,data){
      commit('SET_DEVICECORD', data)
    },
    saveContactunitRecord({ commit } ,data){
      commit('SET_CONTACTUNITCORD', data)
    },
    saveDeviceTypeRecord({ commit } ,data){
      commit('SET_DEVICETYPECORD', data)
    },
    saveAddressManagementRecord({ commit } ,data){
      commit('SET_ADDRESSMANAGEMENTCORD', data)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  