import { 
  setBuildingid, getBuildingid, removeBuildingid } from '~@/utils/auth'
// 個人資料
const getDefaultState = () => {
  return {
    buildingid: getBuildingid() 
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_BUILDINGID: (state, buildingid) => {
    state.buildingid = buildingid
  }
}

const actions = {
  setbuildingid({ commit }, buildingid) {
    return new Promise((resolve, reject) => {
     
        commit('SET_BUILDINGID', buildingid)
        setBuildingid(buildingid)
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

