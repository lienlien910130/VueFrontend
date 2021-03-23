import idb from '../../utils/indexedDB'

const getDefaultState = () => {
    return {
      json: ''
    }
  }
  
  const state = getDefaultState()

  const mutations = {
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    },
    SET_JSON: (state, json) => {
      state.json = json
    }
}
  
const actions = {
    async getJson({ commit }) { //從網頁資料庫取出來儲存在store上
      let json = await idb.getValue('graphicJson')
      commit('SET_JSON', json)
    },
    sendJson({ commit } ,data){
      return new Promise((resolve, reject) => {
        commit('SET_JSON', data[0].content)
        idb.deleteData('graphicJson')
        idb.saveValue('graphicJson',data)
        resolve()
      })
    },
    resetGraphicJson({ commit }) {
      return new Promise(resolve => {
        commit('RESET_STATE')
        resolve()
      })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  