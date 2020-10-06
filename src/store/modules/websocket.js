
const getDefaultState = () => {
    return {
      msg: ''
    }
  }
  
  const state = getDefaultState()

  const mutations = {
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    },
    SET_MSG: (state, msg) => {
      state.msg = msg
    }
}
  
const actions = {
    sendMsg({ commit } , msg){
        commit('SET_MSG', msg)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  