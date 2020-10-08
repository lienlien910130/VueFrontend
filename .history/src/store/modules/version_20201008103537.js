import { getversion } from '@/api/user.js'
import { setVersion } from '@/utils/auth.js'



//業主資料 
const getDefaultVersion = () => {
    return {
      id: '',
      name: '',
      components: '',
      logo: ''
    }
  }

const state = getDefaultVersion()

const mutations = {
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultVersion())
    },
    SET_VER_ID: (state,id) => {
        state.id = id
    },
    SET_VER_NAME: (state,name) => {
        state.name = name
    },
    SET_VER_LOGO: (state,logo) => {
        state.logo = logo
    },
    SET_VER_COMPONENT: (state,components) => {
        state.components = components
    }
}
  
  const actions = {
    getversion({ commit }, url) {
        return new Promise((resolve, reject) => {
          getversion(url).then(response => {
            console.log('version=>'+JSON.stringify(response))
            commit('SET_VER_COMPONENT', response.data.version.components)
            commit('SET_VER_ID', response.data.version.id)
            commit('SET_VER_NAME', response.data.version.name)
            commit('SET_VER_LOGO', response.data.version.logo)
            setVersion(response.data.version.components)
            resolve()
          }).catch(error => {
            console.log('error=>'+error)
            reject(error)
          })
        })
      }
  }

  
export default {
    namespaced: true,
    state,
    mutations,
    actions
  }