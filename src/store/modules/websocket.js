
const getDefaultState = () => {
    return {
      wsmsg: [], //訊號
      action:false, //是否有動作
      options:[],
      wsuserId:'',
      process:false, //是否有啟動應變
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
      state.wsmsg.unshift(wsmsg)  //插入第0筆
    },
    SET_ACTION: (state, action) => {
      state.action = action
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
    SET_PROCESS: (state, process) => {
      state.process = process
    },
}

const actions = {
  sendMsg({ commit } , wsmsg){ //硬體設備動作資訊顯示
      commit('SET_MSG', wsmsg)
  },
  saveAction({ commit } , action){ //圖控動畫使用
    commit('SET_ACTION', action)
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
  saveProcess({ commit } , process){ //手機通知網址使用
    commit('SET_PROCESS', process)
  }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
