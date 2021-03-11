import { DrawingControl,Setting,DevicesManagement,
  HistoryAnalysis,Basic,EmergencyResponse,AccessAuthority,mercuryfireRoutes, constantRoutes  } from '@/router'
import idb from '@/utils/indexedDB'
import store from '@/store'
import obj from '@/object'
import router from '@/router'
import { resetRouter } from '@/router'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

function checktemplate(menu){
  switch(menu){
      case 'sys-Setting':
        return Setting
      case 'drawingControl':
        return DrawingControl
      case 'devicesManagement':
        return DevicesManagement
      case 'sys-Basic':
        return Basic
      case 'historyAnalysis':
        return HistoryAnalysis
      case 'emergencyResponse':
        return EmergencyResponse
      case 'sys-AccessAuthority':
        return AccessAuthority
      default:
        break;
  }
}

const state = {
  menuId:'',
  menu:[],
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_MENUID: (state, menuId) => {
    state.menuId = menuId
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  setmenuId({ commit }, menuId) { 
    return new Promise((resolve, reject) => {
      commit('SET_MENUID', menuId)
      resolve()
    })
  },
  setmenu({ commit }, menu) { 
    return new Promise((resolve, reject) => {
      commit('SET_MENU', menu)
      var array = []
      menu.forEach(element=>{
        array.push(element)
        if(element.children.length >0){
          element.children.forEach(obj=>{
            array.push(obj)
          })
        }
      })
      idb.deleteData('menu')
      idb.saveValue('menu',array)
      resolve()
    })
  },
  async generateRoutes({ commit }, roles) {
    let accessedRoutes
    if (roles) {
      accessedRoutes = mercuryfireRoutes || []
    } 
    commit('SET_ROUTES', accessedRoutes)
    return accessedRoutes
  },
  async setRoutes({ commit }) {
    resetRouter()
    var data = await  obj.Authority.getBuildingMenu()
    store.dispatch('permission/setmenu',data)
    let accessedRoutes = []
    var newArray = []
    data.forEach(item=>{
      var router = checktemplate(item.code)
      accessedRoutes = accessedRoutes.length == 0 ? router : accessedRoutes.concat(router)
    })
    for (let item of accessedRoutes) {
      if (item) {
        newArray.push(item)
      }
    }
    if(store.getters.id == '1'){
      newArray = newArray.concat(mercuryfireRoutes)
    }
    commit('SET_ROUTES', newArray)
    router.addRoutes(newArray)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
