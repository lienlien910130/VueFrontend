import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {

  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()

  if(to.meta.needLogin == true){ //判斷頁面是否需要登入
    
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
            next()
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
    // if (hasToken) {
    //   console.log('a')
    //   if (to.path === '/login') {
    //     console.log('b')
    //     // if is logged in, redirect to the home page
    //     next({ path: '/equipment' }) //登入後頁面跳轉
    //     NProgress.done()
    //   } else {
    //     console.log('c')
    //     // determine whether the user has obtained his permission roles through getInfo
    //     const hasRoles = store.getters.roles && store.getters.roles.length > 0
    //     console.log(store.getters.roles)
    //     console.log(store.getters.roles.length)
    //     if (hasRoles) {
    //       console.log('d')
    //       next()
    //     } else { 
    //       try {
    //         console.log('e')
    //         // get user info
    //         // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
    //         //const { roles } = await store.dispatch('user/getInfo')
    //         await store.dispatch('user/getInfo')
    //         // generate accessible routes map based on roles
    //         //const accessRoutes = await store.dispatch('permission/generateRoutes', roles) //設置權限的頁面
    //         // dynamically add accessible routes
            
    //         //router.addRoutes(accessRoutes)
  
    //         // hack method to ensure that addRoutes is complete
    //         // set the replace: true, so the navigation will not leave a history record
    //         next({ ...to, replace: true })
    //       } catch (error) {
    //         console.log('f')
    //         // remove token and go to login page to re-login
    //         await store.dispatch('user/resetToken')
    //         Message.error(error || 'Has Error')
    //         next(`/login?redirect=${to.path}`)
    //         NProgress.done()
    //       }
    //     }
    //   }
    // } else {
    //   console.log('g')
    //   /* has no token*/
    //   if (whiteList.indexOf(to.path) !== -1) {
    //     // in the free login whitelist, go directly
    //     next()
    //   } else {
    //     // other pages that do not have permission to access are redirected to the login page.
    //     next(`/login?redirect=${to.path}`)
    //     NProgress.done()
    //   }
    // }
  }else{
    next();
  }
  
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
