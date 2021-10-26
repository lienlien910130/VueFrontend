
const getDefaultState = () => {
    return {
      wsmsg: [], //訊號
      actions:[], //圖控只用
      options:[],
      wsuserId:'',
      graphicMsg:'', //圖控編輯限制
      flowMsg:'' //流程圖編輯限制
    }
  }

  const state = getDefaultState()

  const mutations = {
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    },
    SET_MSG: (state, wsmsg) => {
      state.wsmsg.unshift(wsmsg)
    },
    SET_ACTIONS: (state, action) => {
      state.actions.push(action)
    },
    SET_MSGUSERID: (state, wsuserId) => {
      state.wsuserId = wsuserId
    },
    SET_GRAPHICMSG: (state, graphicMsg) => {
      state.graphicMsg = graphicMsg
    },
    SET_OPTIONS: (state, options) => {
      state.options = options
    },
}

const actions = {
  sendMsg({ commit } , wsmsg){ //硬體設備動作資訊顯示
      commit('SET_MSG', wsmsg)
  },
  sendActions({ commit } , actions){ //圖控動畫使用
    commit('SET_ACTIONS', actions)
  },
  saveUserId({ commit } , wsuserId){
      commit('SET_MSGUSERID', wsuserId)
  },
  sendGraphicMsg({ commit } , msg){ //圖控編輯頁面使用
      commit('SET_GRAPHICMSG', msg)
  },
  sendOptions({ commit } , options){ //手機通知網址使用
    commit('SET_OPTIONS', options)
  },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
