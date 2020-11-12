import { 
    getGraphicJson, setGraphicJson} from '../../utils/auth'

const getDefaultState = () => {
    return {
      json: getGraphicJson()
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
        setGraphicJson(json)
        resolve()
      })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  