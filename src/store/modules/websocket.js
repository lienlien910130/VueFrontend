
const getDefaultState = () => {
    return {
      wsmsg: ''
    }
  }
  
  const state = getDefaultState()

  const mutations = {
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    },
    SET_MSG: (state, wsmsg) => {
      state.wsmsg = wsmsg
    }
}
  
const actions = {
    sendMsg({ commit } , wsmsg){
        commit('SET_MSG', wsmsg)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  