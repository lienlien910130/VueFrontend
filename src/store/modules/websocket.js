const getDefaultState = () => {
  return {
    wsmsg: [], //訊號
    realTimeaction: [], //是否有動作
    options: [],
    wsuserId: "",
    process: false, //是否有啟動應變
    graphicMsg: null, //圖控編輯限制
    processMsg: null,
    flowMsg: "", //流程圖編輯限制
    nodeResult: [],
    selectResult: null,
    firstNodeList: [], //processws初始節點資料
    isReturn: false,
    waitingNode: [],
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_MSG: (state, wsmsg) => {
    state.wsmsg.push(wsmsg); //插入第0筆
    // state.wsmsg = state.wsmsg.sort(function (a, b) {
    //   return new Date(b.date) - new Date(a.date);
    // });
  },
  SET_ACTION: (state, action) => {
    state.realTimeaction.push(action);
  },
  SET_MSGUSERID: (state, wsuserId) => {
    state.wsuserId = wsuserId;
  },
  SET_GRAPHICMSG: (state, graphicMsg) => {
    state.graphicMsg = graphicMsg;
  },
  SET_PROCESSMSG: (state, processMsg) => {
    state.processMsg = processMsg;
  },
  SET_OPTIONS: (state, options) => {
    state.options = options;
  },
  SET_PROCESS: (state, process) => {
    state.process = process;
  },
  SET_NODERESULT: (state, nodeResult) => {
    var index = state.nodeResult.findIndex(
      (obj) =>
        obj.cNodeId == nodeResult.cNodeId &&
        obj.nodeId == nodeResult.nodeId &&
        obj.state == nodeResult.state
    );
    if (index == -1) {
      //不重複
      state.nodeResult.push(nodeResult);
    }
  },
  SET_SELECTRESULT: (state, selectResult) => {
    state.selectResult = selectResult;
  },
  SET_RETURN: (state, isReturn) => {
    state.isReturn = isReturn;
  },
  SET_WAITINGNODE: (state, waitingNode) => {
    var index = state.waitingNode.findIndex(
      (obj) =>
        obj.cNodeId == waitingNode.cNodeId && obj.nodeId == waitingNode.nodeId
    );
    if (index == -1) {
      //不重複
      state.waitingNode.push(waitingNode);
    }
  },
};

const actions = {
  sendMsg({ commit }, wsmsg) {
    //硬體設備動作資訊顯示
    commit("SET_MSG", wsmsg);
  },
  saveAction({ commit }, action) {
    //圖控動畫使用
    commit("SET_ACTION", action);
  },
  saveUserId({ commit }, wsuserId) {
    commit("SET_MSGUSERID", wsuserId);
  },
  sendGraphicMsg({ commit }, msg) {
    //圖控編輯頁面使用
    commit("SET_GRAPHICMSG", msg);
  },
  sendProcessMsg({ commit }, msg) {
    //流程圖編輯頁面使用
    commit("SET_PROCESSMSG", msg);
  },
  sendOptions({ commit }, options) {
    //手機通知網址使用
    commit("SET_OPTIONS", options);
  },
  saveProcess({ commit }, process) {
    //手機通知網址使用
    commit("SET_PROCESS", process);
  },
  saveNodeResult({ commit }, nodeResult) {
    //儲存節點結果
    commit("SET_NODERESULT", nodeResult);
  },
  saveSelectResult({ commit }, selectResult) {
    //儲存節點結果
    commit("SET_SELECTRESULT", selectResult);
  },
  updateNodeResult({ commit }, content) {
    //更新節點狀態
    var index = state.nodeResult.findIndex((item) => {
      return item.nodeId === content.nodeId;
    });
    if (index !== -1) {
      state.nodeResult[index].state = 1;
      state.nodeResult[index].message = content.message;
    }
    var waitingNodeIndex = state.waitingNode.findIndex((item) => {
      return item.nodeId == content.nodeId;
    });
    if (waitingNodeIndex !== -1) {
      state.waitingNode[waitingNodeIndex].state = 1;
      state.waitingNode[waitingNodeIndex].message = content.message;
      state.waitingNode[waitingNodeIndex].cOptions = content.cOptions;
      state.waitingNode[waitingNodeIndex].replyUser = content.linkAccountList;
    }
  },
  saveReturn({ commit }, isReturn) {
    //復歸
    commit("SET_RETURN", isReturn);
  },
  saveWaitingNode({ commit }, waitingNode) {
    commit("SET_WAITINGNODE", waitingNode);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
