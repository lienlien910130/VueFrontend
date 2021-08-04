import { 
  getToken,setToken,removeToken, 
  getID,setID,removeID
}  from '../../utils/auth'
import idb from '../../utils/indexedDB'
import { resetRouter } from '../../router'
import user from '../../api/user.js'
import store from '../index.js'
import { Message } from 'element-ui'
import { Role, Building } from '@/object/index'

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
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      user.apiPostLogin({ account: username.trim(), password: password }).then(response => {
        idb.getDb()
        commit('SET_TOKEN', response.accessToken) //store 儲存
        setToken(response.accessToken) //cookie儲存
        commit('SET_USER', response.userId) //store 儲存
        setID(response.userId) //cookie儲存
        resolve()
      }).catch(error => {
        console.log("error.response.status=>" + error)
        Message.error('帳號密碼錯誤，請重新輸入')
        reject(error)
      })
    })
  },
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      user.apiGetUserInfo().then(response => {
        if (!response) {
          reject('登入失敗，請重新登入')
        }
        const { account, name, linkRoles, linkBuildings } = response.result[0]
        var roles = linkRoles.map(item=>{ return new Role(item)})
        var buildingarray = linkBuildings.map(item=>{ return new Building(item)})
        commit('SET_ACCOUNT', account)
        commit('SET_NAME', name)
        commit('SET_ROLES', roles)
        store.dispatch('building/setBuildingList',buildingarray)
        resolve(roles)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      idb.deleteDb()
      store.dispatch('app/closeSideBar', { withoutAnimation: false })
      removeToken() 
      removeID()
      store.dispatch('building/resetBuildingid')
      commit('RESET_STATE')
      resetRouter()
      resolve()
    })
  },

  // remove token
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     removeToken() 
  //     removeID()
  //     removeVersion()
  //     store.dispatch('building/resetBuildingid')
  //     idb.deleteDb()
  //     commit('RESET_STATE')
  //     resetRouter()
  //     resolve()
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

