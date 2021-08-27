

const getDefaultState = () => {
    return {
        jspInit: null,
        flowMenuObj: {
          type: 'drag-drop',
          connector: 'Bezier'
        },
        // flowData:{ "offsetX": -2993, "offsetY": -2991,nodes:[],links:[]},
        flowData: { "offsetX": -3000, "offsetY": -3000, "title": "数据处理流程图", "nodes": [], "links": [] },
        // 添加新节点
        newNode: {
          state: false,
          node: {}
        },
        //选中的节点、连线数据
        selectContent: {
          type: "",
          data: {}
        },
        //步骤缓存
        flowStepData: [],
        stepIndex: 0,
    }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
    
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}