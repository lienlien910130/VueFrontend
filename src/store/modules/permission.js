import { notfound,mercuryfireRoutes, constantRoutes  } from '@/router'
import idb from '@/utils/indexedDB'
import store from '@/store'
import router from '@/router'
import { resetRouter } from '@/router'
import  Menu  from '@/object/menu'
import _import from '@/router/_import'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

// /**
//  * Filter asynchronous routing tables by recursion
//  * @param routes asyncRoutes
//  * @param roles
//  */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

function addRouter(routerlist) {
  routerlist.forEach(e => {
    delete e.description
    delete e.status
    delete e.sort
    delete e.removable
    delete e.linkAccessAuthorities
    delete e.isDelete
    delete e.createTime
    delete e.id
    var hasToCycle
    if(e.linkMainMenus.length !== 0){ //有子階層
      hasToCycle = true
      e.children = e.linkMainMenus
    }else if(e.linkMainMenus.length == 0 && e.redirect !== ''){ //只有一個階層
      hasToCycle = false
      e.children = [
        {
          path: e.redirect,
          name:e.code,
          component:_import(e.code),
          meta:{ title:e.name, icon:e.icon }
        }
      ]
      if(e.code == 'sys-Setting' || e.code == 'sys-Building' || e.code == 'sys-Index'){
        e.hidden = true
      }
    }
    //有子階層的父層級
    if(e.linkMainMenus !== undefined && e.linkMainMenus.length !== 0 && e.redirect !== ''){
      e.meta = { title: e.name, icon: e.icon }
      e.name = e.code
    }

    if (e.redirect === '') { //第二階層
      e.component = _import(e.code) // 動態匹配元件
      e.meta = { title: e.name, icon: e.icon }
      e.name = e.code
      delete e.redirect
    }else{ //第一階層
      e.component = Layout 
    }
    delete e.linkMainMenus
    delete e.code
    delete e.icon
    
    if (e.children !== undefined && hasToCycle == true) {
      // 存在子路由就遞迴
      addRouter(e.children)
    }
  })
  return routerlist
}

const state = {
  menuId:'',
  menu:[],
  menuNoLevel:[],
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
  SET_MENU_NOLEVEL: (state, menuNoLevel) => {
    state.menuNoLevel = menuNoLevel
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
      for(let element of menu){
          array.push(element)
          array.push(element.linkMainMenus)
      }
      var concatarray = array.reduce(
          function(a, b) {
              return a.concat(b)
          },[]
      )
      commit('SET_MENU_NOLEVEL', concatarray)
      resolve()
    })
  },
  async generateRoutes({ commit }, roles) { //起始選單
    let accessedRoutes = []
    if (roles) {
      accessedRoutes = mercuryfireRoutes || []
    } 
    accessedRoutes = accessedRoutes.concat(notfound)
    commit('SET_ROUTES', accessedRoutes)
    return accessedRoutes
  },
  async setRoutes({ commit }) { //設定側邊選單
    resetRouter()
    var data = await Menu.get()
    store.dispatch('permission/setmenu',data)
    var menucopy = data.map(item=>{ return item.clone(item)})
    var getRouter = addRouter(menucopy)
    getRouter = getRouter.filter(item => { 
      return item.path !== '/' 
    }).concat(notfound)
    commit('SET_ROUTES', getRouter)
    router.addRoutes(getRouter)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
