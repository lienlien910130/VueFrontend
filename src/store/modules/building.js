import  {
  getBuildingid,setBuildingid,removeBuildingid
 }  from '../../utils/auth'
import idb from '../../utils/indexedDB'
import { Device, User, Contactunit, Floors, Building, Role, Setting, UsageOfFloor, DeviceType, DeviceAddressManagement } from '@/object/index'

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
    buildingfloors:[],
    buildingfloorOfHouse:[],
    buildingdeviceType:[],
    buildingaddress:[],
    deviceType:[]
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
  SET_BUILDINGLIST: (state, buildingarray) => {
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
  },
  SET_BUILDINGFLOOROFHOUSE: (state, buildingfloorOfHouse) => {
    state.buildingfloorOfHouse = buildingfloorOfHouse
  },
  SET_DEFAULTDEVICETYPE: (state, deviceType) => {
    state.deviceType = deviceType
  },
  SET_DEVICETYPE: (state, deviceType) => {
    state.buildingdeviceType = deviceType
  },
  SET_ADDRESSMANAGEMENT: (state, buildingaddress) => {
    state.buildingaddress = buildingaddress
  }
}

const actions = {
  async setBuildingID({ commit }, buildingid){
    commit('SET_BUILDINGID', buildingid)
    setBuildingid(buildingid)
  },
  //建築物清單-系統管理員
  setBuildingList({ commit }, buildingarray) { //登入時儲存store
    return new Promise((resolve, reject) => {
        commit('SET_BUILDINGLIST', buildingarray)
        resolve()
    })
  },
  addBuildingList({ commit }, content){
    state.buildingarray.push(content)
  },
  updateBuildingList({ commit }, content){
    var index = state.buildingarray.findIndex((item) => {
      return item.id === content.id
    })
    if(index !== -1){
      state.buildingarray[index] = content
    }
  },
  deleteBuildingList({ commit }, id){
    var obj = state.buildingarray.filter((item) => {
        return item.id !== id
    })
    commit('SET_BUILDINGLIST', obj)
  },
  //建築物資訊-正在選取的建築物才更新
  setBuildingInfo({ commit }, buildinginfo) { 
    return new Promise((resolve, reject) => {
      // console.log(buildinginfo)
      commit('SET_BUILDINGINFO', buildinginfo)
      resolve()
    })
  },
  //角色-正在選取的建築物才更新
  async setroles({ commit }) { 
    var data =  await Role.get()
    commit('SET_ROLES', data)
  },
  addRole({ commit }, content){
    state.roles.push(content)
  },
  updateRole({ commit }, content){
    var index = state.roles.findIndex((item) => {
      return item.id === content.id
    })
    if(index !== -1){
      state.roles[index] = content
    }
  },
  deleteRole({ commit }, id){
    var obj = state.roles.filter((item) => {
        return item.id !== id
    })
    commit('SET_ROLES', obj)
  },
  //設定-正在選取的建築物才更新
  async setoptions({ commit }, data = null){
    var data = data == null ? await Setting.getAllOption() : data
    commit('SET_BUILDINGOPTIONS', data)
  },
  addOption({ commit }, content){
    state.buildingoptions.push(content)
  },
  updateOption({ commit }, content){
    var index = state.buildingoptions.findIndex((item) => {
      return item.id === content.id
    })
    if(index !== -1){
      state.buildingoptions[index] = content
    }
  },
  deleteOption({ commit }, id){
    var obj = state.buildingoptions.filter((item) => {
        return item.id !== id
    })
    commit('SET_BUILDINGOPTIONS', obj)
  },
  //樓層-正在選取的建築物才更新
  async setFloors({ commit }) {
    var data =  await Floors.get()
    commit('SET_BUILDINGFLOORS', data)
  },
  updateFloor({ commit }, content){
    var index = state.buildingfloors.findIndex((item) => {
      return item.id === content.id
    })
    if(index !== -1){
      state.buildingfloors[index] = content
    }
  },
  //廠商資料
  async setContactunit({ commit }) {
    var data =  await Contactunit.get()
    commit('SET_BUILDINGCONTACTUNIT', data)
  },
  addContactunit({ commit }, content){
    state.buildingcontactunit.push(content)
  },
  updateContactunit({ commit }, content){
    var index = state.buildingcontactunit.findIndex((item) => {
      return item.id === content.id
    })
    if(index !== -1){
      state.buildingcontactunit[index] = content
    }
  },
  deleteContactunit({ commit }, id){
    var obj = state.buildingcontactunit.filter((item) => {
        return item.id !== id
    })
    commit('SET_BUILDINGCONTACTUNIT', obj)
  },
  //住戶
  async setHouseHolders({ commit }) {
    var data =  await User.get()
    commit('SET_BUILDINGUSERS', data)
  },
  addHouseHolder({ commit }, content){
    state.buildingusers.push(content)
  },
  updateHouseHolder({ commit }, content){
    var index = state.buildingusers.findIndex((item) => {
      return item.id === content.id
    })
    if(index !== -1){
      state.buildingusers[index] = content
    }
  },
  deleteHouseHolder({ commit }, id){
    var obj = state.buildingusers.filter((item) => {
        return item.id !== id
    })
    commit('SET_BUILDINGUSERS', obj)
  },
  //門牌
  async setFloorOfHouse({ commit }) {
    var data =  await UsageOfFloor.getAll()
    commit('SET_BUILDINGFLOOROFHOUSE', data)
  },
  addFloorOfHouse({ commit }, content){
    state.buildingfloorOfHouse.push(content)
  },
  updateFloorOfHouse({ commit }, content){
    var index = state.buildingfloorOfHouse.findIndex((item) => {
      return item.id === content.id
    })
    if(index !== -1){
      state.buildingfloorOfHouse[index] = content
    }
  },
  deleteFloorOfHouse({ commit }, id){
    var obj = state.buildingfloorOfHouse.filter((item) => {
        return item.id !== id
    })
    commit('SET_BUILDINGFLOOROFHOUSE', obj)
  },
  //設備
  async setDevice({ commit }) {
    var data =  await Device.get()
    commit('SET_BUILDINGDEVICES', data)
  },
  addDevice({ commit }, content){
    state.buildingdevices.push(content)
  },
  updateDevice({ commit }, content){
    var index = state.buildingdevices.find((item) => {
        return item.id === content.id
    })
    if(index !== -1){
      state.buildingdevices[index] = content
    }
  },
  deleteDevice({ commit }, id){
    var obj = state.buildingdevices.filter((item) => {
        return item.id !== id
    })
    commit('SET_BUILDINGDEVICES', obj)
  },
  //設備種類
  async setDeviceType({ commit }) {
    var data =  await DeviceType.get()
    commit('SET_DEVICETYPE', data)
  },
  addDeviceType({ commit }, content){
    state.buildingdeviceType.push(content)
  },
  updateDeviceType({ commit }, content){
    var index = state.buildingdeviceType.find((item) => {
        return item.id === content.id
    })
    if(index !== -1){
      state.buildingdeviceType[index] = content
    }
  },
  deleteDeviceType({ commit }, id){
    var obj = state.buildingdeviceType.filter((item) => {
        return item.id !== id
    })
    commit('SET_DEVICETYPE', obj)
  },
  //點位
  async setAddressManagement({ commit }) {
    var data =  await DeviceAddressManagement.get()
    commit('SET_ADDRESSMANAGEMENT', data)
  },
  addAddressManagement({ commit }, content){
    state.buildingaddress.push(content)
  },
  updateAddressManagement({ commit }, content){
    var index = state.buildingaddress.find((item) => {
        return item.id === content.id
    })
    if(index !== -1){
      state.buildingaddress[index] = content
    }
  },
  deleteAddressManagement({ commit }, id){
    var obj = state.buildingaddress.filter((item) => {
        return item.id !== id
    })
    commit('SET_ADDRESSMANAGEMENT', obj)
  },
  // setbuildingoptions({ commit }, buildingoptions) {
  //   return new Promise((resolve, reject) => {
  //       commit('SET_BUILDINGOPTIONS', buildingoptions)
  //       resolve()
  //   })
  // },
  

  // async getroles({ commit }) { //從網頁資料庫取出來儲存在store上
  //   let roles = await idb.getValue('roles')
  //   var array = roles.map(item=>{ return new Role(item)})
  //   commit('SET_ROLES', array)
  // },
  
 
  // async getBuildingList({ commit }) { //從網頁資料庫取出來儲存在store上
  //   let list = await idb.getValue('BuildingInfo')
  //   commit('SET_BUILDINGLIST', list)
  // },
 
  // async getbuildinginfo({ commit }) { //從網頁資料庫取出來儲存在store上
  //   let buildinginfo = await idb.getValue('buildingInfo')
  //   var array = buildinginfo.map(item=>{ return new Building(item)})
  //   commit('SET_BUILDINGINFO', array)
  // },
 

 
  // async getbuildingoptions({ commit }) { //從網頁資料庫取出來儲存在store上
  //   let buildingoptions = await idb.getValue('buildingOptions')
  //   commit('SET_BUILDINGOPTIONS', buildingoptions)
  // },
  
  // async getbuildingcontactunit({ commit }) { //從網頁資料庫取出來儲存在store上
  //   let buildingcontactunit = await idb.getValue('buildingContactunit')
  //   var array = buildingcontactunit.map(item=>{ return new Contactunit(item)})
  //   commit('SET_BUILDINGCONTACTUNIT', array)
  // },
  
  // async getbuildingusers({ commit }) { //從網頁資料庫取出來儲存在store上
  //   let buildingusers = await idb.getValue('buildingUsers')
  //   var array = buildingusers.map(item=>{ return new User(item)})
  //   commit('SET_BUILDINGUSERS', array)
  // },
  
  // async getbuildingdevices({ commit }) { //從網頁資料庫取出來儲存在store上
  //   let buildingdevices = await idb.getValue('buildingDevices')
  //   var array = buildingdevices.map(item=>{ return new Device(item)})
  //   commit('SET_BUILDINGDEVICES', array)
  // },
  
  // async getbuildingfloors({ commit }) { //從網頁資料庫取出來儲存在store上
  //   let buildingfloors = await idb.getValue('buildingFloors')
  //   var array = buildingfloors.map(item=>{ return new Floors(item)})
  //   commit('SET_BUILDINGFLOORS', array)
  // },
  
  setDefaultDeviceType({ commit }, deviceType) {
    return new Promise((resolve, reject) => {
        commit('SET_DEFAULTDEVICETYPE', deviceType)
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

