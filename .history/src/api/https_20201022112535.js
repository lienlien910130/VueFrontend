import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

import NProgress from 'nprogress'

const tip = msg => {
    Message.error(msg)
}

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API2, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout,
  headers: { 'Content-Type': 'application/json; charset=utf-8' }
})

const errorHandle = (status,msg) =>{
    switch (error.response.status) {
        case 400:
            tip(msg)
            break;
        case 401:
            tip('登入過期，請重新登入')
            store.dispatch('user/resetToken')
            location.reload()
            break;
        case 403:
            tip('權限不足')
            break;
        case 404:
            tip(msg)
            break;
        default:
          console.log('resq未攔截到的錯誤:'+msg);
    }
}

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) { 
        config.headers.Authorization = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
//200	OK	請求已成功。
//201	Created	請求已成功，而且有一個新的資源被建立。
//400	Bad Request	由於明顯的客戶端錯誤（例如，格式錯誤的請求語法、無效的請求訊息、或欺騙性路由請求），伺服器不能或不會處理該請求。
//401	Unauthorized	當前的請求需要使用者驗證。
//500	Internal Server Error	通用錯誤訊息，伺服器遇到了一個未曾預料的狀況，導致了它無法完成對請求的處理。
// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
    // if (response.status !== 200) {
    //   Message({
    //     message: res.mes || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.mes || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
      const { response } = error
      if(response) {
          //成功發出請求且收到resp，但有error
          errorHandle(response.status,response.data.error)
          return Promise.reject(error)
      } else {
        if(!window.navigator.onLine) {
            tip('網路出問題')
        } else {
            return Promise.reject(error)
        }
      }
    // if (error && error.response) {
    //   switch (error.response.status) {
    //     case 401:
    //       console.log("權限過時");
    //       store.dispatch('user/resetToken')
    //       Message.error(error || 'Has Error')
    //       location.reload()
    //       break;
    //     case 404:
    //       console.log("找不到該頁面");
    //       break;
    //     case 500:
    //       console.log("伺服器出錯");
    //       break;
    //     case 503:
    //       console.log("服務失效");
    //       break;
    //     default:
    //       console.log(`連接錯誤${error.response.status}`);
    //   }
    // } else {
    //   console.log("連接到服務器失敗");
    // }
    
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    // return Promise.reject(error)
  }
)

export default service
