
const getDefaultState = () => {
    return {
      wsmsg: [], //訊號
      realTimeaction:[], //是否有動作
      options:[],
      wsuserId:'',
      process:false, //是否有啟動應變
      graphicMsg:'', //圖控編輯限制
      flowMsg:'', //流程圖編輯限制
      nodeResult:[],
      selectResult:null,
      firstNodeList:[], //processws初始節點資料
      isReturn:false
    }
  }

  const state = getDefaultState()

  const mutations = {
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    },
    SET_MSG: (state, wsmsg) => {
      state.wsmsg.push(wsmsg)  //插入第0筆
    },
    SET_ACTION: (state, action) => {
      state.realTimeaction.push(action)
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
    SET_NODERESULT: (state, nodeResult) =>{
      var index = state.nodeResult.findIndex(obj=>
          obj.cNodeId == nodeResult.cNodeId &&
          obj.nodeId == nodeResult.nodeId &&
          obj.state == nodeResult.state
      )
      if(index == -1){ //不重複
        state.nodeResult.push(nodeResult)
      }
    },
    SET_SELECTRESULT: (state, selectResult) =>{
      state.selectResult = selectResult
    },
    SET_RETURN: (state, isReturn) =>{
      state.isReturn = isReturn
    }
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
  },
  saveNodeResult({ commit } , nodeResult){ //儲存節點結果
    commit('SET_NODERESULT', nodeResult)
  },
  saveSelectResult({ commit } , selectResult){ //儲存節點結果
    commit('SET_SELECTRESULT', selectResult)
  },
  updateNodeResult({ commit }, content){ //更新節點狀態
    var index = state.nodeResult.findIndex((item) => {
      return item.nodeId === content.nodeId
    })
    if(index !== -1){
      state.nodeResult[index].state = 1
      state.nodeResult[index].message = content.message
    }
  },
  saveReturn({ commit } , isReturn){ //復歸
    commit('SET_RETURN', isReturn)
  },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
