import  { 
  // getGraphicJson,setGraphicJson,removeGraphicJson 
}  from '../../utils/auth'

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
    sendJson({ commit } , json){
      return new Promise((resolve, reject) => {
        commit('SET_JSON', json)
        //setGraphicJson(json)
        resolve()
      })
    },
    resetGraphicJson({ commit }) {
      return new Promise(resolve => {
        //removeGraphicJson()
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
  