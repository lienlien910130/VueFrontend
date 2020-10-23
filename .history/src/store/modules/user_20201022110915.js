import { login, logout, getInfo } from '../../api/user'
import { getToken, setToken, removeToken, 
  setID, getID, removeID, removeVersion,
  removeBuildingid } from '../../utils/auth'
import { resetRouter } from '../../router'


// 個人資料
const getDefaultState = () => {
  return {
    token: getToken(),
    id: getID(),
    account: '',
    name: '',
    roles: '',
    level: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER: (state, id) => {
    state.id = id
  },
  SET_LEVEL: (state, level) => {
    state.level = level
  }
}

const actions = {
  // 線上
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: username.trim(), password: password }).then(response => {
        commit('SET_TOKEN', response.accessToken) //store 儲存
        setToken(response.accessToken) //cookie儲存
        commit('SET_USER', response.userId) //store 儲存
        setID(response.userId) //cookie儲存
        resolve()
      }).catch(error => {
        console.log("error.response.status=>" + error.response.status);
        reject(error)
      })
    })
  },
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.id).then(response => {
        
        if (!response) {
          reject('登入失敗，請重新登入')
        }

        const { account, name, accountLevel } = response.result[0]

        // roles must be a non-empty array
        // if (!roles) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

        commit('SET_ROLES', ['admin'])
        commit('SET_ACCOUNT', account)
        commit('SET_NAME', name)
        commit('SET_LEVEL', accountLevel)
        resolve(response[0])
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
        resetRouter()
        removeID()
        removeVersion()
        removeBuildingid()
        commit('RESET_STATE')
        resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeID()
      removeVersion()
      commit('RESET_STATE')
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

