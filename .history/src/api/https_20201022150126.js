import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'


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
    switch (status) {
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
  },
  error => {
      if(error) {
          //成功發出請求且收到resp，但有error
          errorHandle(error.response.status,error.response.data.error)
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
    console.log('method:'+method+'//url:'+url+'//data:'+data+'//isHeader:'+isHeader)
    method = method.toLowerCase()
    if(method == 'post'){   
        if(isHeader !== false){
            return service.request({
                url: url,
                method: 'post',
                headers: {'Content-Type': 'multipart/form-data'},
                data
            })
            //return service.post(url,data,config) //檔案上傳
        } else{
            return service.post(url,data)
        }
    }else if(method == 'get'){
        return service.get(url)
    }else if(method == 'delete'){
        return service.delete(url)
    }else if(method == 'put'){
        return service.put(url)
    }else if(method == 'patch'){
        return service.patch(url,data)
    }else {
        console.error('未知的method:'+method)
        return false
    }
}
