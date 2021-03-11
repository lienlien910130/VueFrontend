import router from './router'
import store from './store'
import obj from './object'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken,getBuildingid } from '@/utils/auth' // get token from cookie
import idb from '@/utils/indexedDB'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  //logForTranslate.logtoLocal('router=>'+to.name,from.name)
  console.log(to.name,from.name)
  NProgress.start()
  document.title = `${to.meta.title} - 智慧消防管理平台`
  const hasToken = getToken()
  const buildingID = getBuildingid()
  
    if (hasToken) { //已經登入過了
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done()
      } else {
        if(to.name !== null){ 
          var menuId = await idb.getValueByIndex(to.name) //檢查有無ID
          console.log('menuId',menuId)
          if(menuId !== undefined){
            await store.dispatch('permission/setmenuId', await idb.getValueByIndex(to.name)) //儲存要進入的頁面ID
          }
        }
        
        const hasGetUserInfo = store.getters.name
        if (hasGetUserInfo) {
          next()
        } else { //重新整理時會執行該段
          try {
            // get user info
            await store.dispatch('user/getInfo')
            await store.dispatch('building/setroles',await obj.Authority.getAllRole()) //跟大樓無關連
            await store.dispatch('building/setbuildingusers',await obj.Building.getBuildingUser()) ////跟大樓無關連
            const isSystem = store.getters.id == '1'
            console.log('isSystem',isSystem,buildingID)
            if(isSystem){ //系統管理員=>取得所有大樓清單
              store.dispatch('building/setbuildingarray',await obj.Building.getAllBuilding())
            }
            if(buildingID){ //已經有選過大樓
              console.log('已選擇過建築物大樓')
              await store.dispatch('building/setbuildingid', buildingID)
              await store.dispatch('building/getbuildinginfo')
              if(!isSystem) await store.dispatch('building/getbuildingarray') 
              await store.dispatch('permission/setRoutes') //設定選單資料庫&側邊選單欄
              await store.dispatch('building/getbuildingoptions')
              await store.dispatch('building/getbuildingfloors')
              await store.dispatch('building/getbuildingcontactunit')
              await store.dispatch('building/getbuildingdevices')
            }else{ //第一次登入 選單初始化
              const accessRoutes = await store.dispatch('permission/generateRoutes', isSystem) //設定選單
              router.addRoutes(accessRoutes)
            }
            next({ ...to, replace: true }) 
          } catch (error) {
            // remove token and go to login page to re-login
            await store.dispatch('user/logout')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            alert('error'+error)
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
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
