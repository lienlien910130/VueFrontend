import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {

  NProgress.start()
  document.title = `${to.meta.title} - 智慧消防管理平台`
  const hasToken = getToken()
  
  // if (localStorage.getItem("store") ) {
  //   store.replaceState(Object.assign({}, store.state ,JSON.parse(sessionStorage.getItem("store"))))
  //   console.log(JSON.stringify( store.getters.permission_routes))
  // }

  //if(to.meta.needLogin == true){ //判斷頁面是否需要登入
    
    if (hasToken) {
      
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done()
      } else {
        const hasGetUserInfo = store.getters.name
        
        if (hasGetUserInfo) {
          next()
        } else {
          try {
            // get user info
            await store.dispatch('user/getInfo')
            const isMercuryfire = store.getters.account == 'mf01'
            const accessRoutes = await store.dispatch('permission/generateRoutes', isMercuryfire)
            router.addRoutes(accessRoutes)
            
            next({ ...to, replace: true })

          } catch (error) {
            // remove token and go to login page to re-login
            await store.dispatch('user/resetToken')
            await store.dispatch('building/resetBuildingid')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  // }else{
  //   next();
  // }
  
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
