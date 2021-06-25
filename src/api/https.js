import axios from 'axios'
import { Message } from 'element-ui'
import { Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

let requestCount = 0;
let loading;
let timer;
// (客户端请求前)显示loading
function showLoading() {
    if (requestCount === 0) {
      loading = Loading.service({
        lock: true,
        text: '請稍後...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    //   loading = this.$loading({
    //     lock: true,
    //     text: '更新資料中，請稍後...',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   })
    }
    requestCount++
}
// (服务器响应后)尝试隐藏loading
function tryHideLoading() {
    requestCount-- 
    //采用setTimeout是为了解决一个请求结束后紧接着有另一请求发起导致loading闪烁的问题
    timer = setTimeout(() => {    
      if (requestCount === 0) {
        loading.close()
        clearTimeout(timer)
      }
    })
}

const tip = msg => {
    Message.error(msg)
}

const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API2, // url = base url + request url
    baseURL: 'http://192.168.88.65:59119', // url = base url + request url
    // baseURL: 'https://192.168.88.65:59110',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000, 
  headers: { 
      'Content-Type': 'application/json; charset=utf-8;' }
})

const errorHandle = (status,error) =>{
    switch (status) {
        case 400:
            //tip('帳號密碼輸入錯誤，請重新輸入')
            // if(error.response.data.errorMessage !== undefined && 
            //     error.response.data.errorMessage == '0x06E0'){
            //         tip('不可重複新增') 
            // }
            break;
        case 401:
            tip('登入過期，請重新登入')
            store.dispatch('user/resetToken')
            //location.reload()
            break;
        case 403:
            tip('權限不足')
            break;
        case 423:
            tip('請勿刪除正在使用之設定')
            break;
        case 404:
            tip(error.response.data.error)
            break;
        default:
          console.log('resq未攔截到的錯誤:'+error.response.data.error)
    }
    tryHideLoading()
}

// request interceptor
service.interceptors.request.use(
  config => {
    showLoading()
    if (store.getters.token) { 
        config.headers.Authorization = 'Bearer ' + getToken()
    }
    if(store.getters.menuId){
        config.headers.menu = store.getters.menuId
    }
    config.headers.loadReverse = true
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
    tryHideLoading()
    const res = response.data
    return res
  },
  error => {
      if(error) {
          //成功發出請求且收到resp，但有error
          //alert(error)
          console.log(error.response.status,error.response.data.errorMessage)
          errorHandle(error.response.status,error)
          return Promise.reject(error)
      } else {
        if(!window.navigator.onLine) {
            tip('網路出問題')
        } else {
            return Promise.reject(error)
        }
      }
  }
)

// export default service
export default function(method,url,data = null,isHeader = false) {
    console.log('method:'+method+' || url:'+url+' || data:'+JSON.stringify(data)+' || isHeader:'+isHeader)
    method = method.toLowerCase()
    if(method == 'post'){   
        if(isHeader !== false){ //檔案上傳
            return service.request({
                url: url,
                method: 'post',
                headers: {'Content-Type': 'multipart/form-data'},
                data
            })
        } else{
            return service.post(url,data)
        }
    }else if(method == 'get'){
        if(isHeader !== false){ //下載圖片檔&檔案
            return service.request({
                url: url,
                method: 'get',
                responseType: 'arraybuffer'
            })
        } else{
            return service.get(url)
        }
    }else if(method == 'delete'){
        return service.delete(url)
    }else if(method == 'put'){
        return service.request({
            url: url,
            method: 'put',
            headers: {'Content-Type': 'application/json;charset=UTF-8;'},
            data
        })
    }else if(method == 'patch'){
        return service.patch(url,data)
    }else {
        console.error('未知的method:'+method)
        return false
    }
}
