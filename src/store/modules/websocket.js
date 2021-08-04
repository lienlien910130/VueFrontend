
const getDefaultState = () => {
    return {
      wsmsg: '',
      wsuserId:''
    }
  }
  
  const state = getDefaultState()

  const mutations = {
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    },
    SET_MSG: (state, wsmsg) => {
      state.wsmsg = wsmsg
    },
    SET_MSGUSERID: (state, wsuserId) => {
      state.wsuserId = wsuserId
    },
}
  
const actions = {
  sendMsg({ commit } , wsmsg){
      commit('SET_MSG', wsmsg)
  },
  saveUserId({ commit } , wsuserId){
      commit('SET_MSGUSERID', wsuserId)
  },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  