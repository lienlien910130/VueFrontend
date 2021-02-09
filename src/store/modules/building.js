import { 
  setBuildingid, getBuildingid, removeBuildingid,
  setBuildingArray, getBuildingArray, removeBuildingArray } from '../../utils/auth'

import obj from '@/object'
// 個人資料
const getDefaultState = () => {
  return {
    buildingid: getBuildingid() ,
    buildingarray : []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_BUILDINGID: (state, buildingid) => {
    state.buildingid = buildingid
  },
  SET_BUILDINGARRAY: (state, buildingarray) => {
    state.buildingarray = buildingarray
  }
}

const actions = {
  setbuildingid({ commit }, buildingid) {
    return new Promise((resolve, reject) => {
        commit('SET_BUILDINGID', buildingid)
        setBuildingid(buildingid)
        var ok = obj.Building.getBuildingInfo()
        resolve(ok)
    })
  },
  setbuildingarray({ commit }, buildingarray) {
    return new Promise((resolve, reject) => {
        commit('SET_BUILDINGARRAY', buildingarray)
        setBuildingArray(buildingarray)
        resolve()
    })
  },
  resetBuildingid({ commit }) {
    return new Promise(resolve => {
      removeBuildingid()
      commit('RESET_STATE')
      resolve()
    })
  },
  resetBuildingarray({ commit }) {
    return new Promise(resolve => {
      removeBuildingArray()
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

