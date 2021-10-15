
const getDefaultState = () => {
    return {
      wsmsg: [],
      wsuserId:'',
      graphicMsg:''
    }
  }
  
  const state = getDefaultState()

  const mutations = {
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    },
    SET_MSG: (state, wsmsg) => {
      state.wsmsg.push(wsmsg)
    },
    SET_MSGUSERID: (state, wsuserId) => {
      state.wsuserId = wsuserId
    },
    SET_GRAPHICMSG: (state, graphicMsg) => {
      state.graphicMsg = graphicMsg
    },
}
  
const actions = {
  sendMsg({ commit } , wsmsg){
      console.log('sendMsgsendMsgsendMsg')
      commit('SET_MSG', wsmsg)
  },
  saveUserId({ commit } , wsuserId){
      commit('SET_MSGUSERID', wsuserId)
  },
  sendGraphicMsg({ commit } , msg){
      commit('SET_GRAPHICMSG', msg)
  }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  