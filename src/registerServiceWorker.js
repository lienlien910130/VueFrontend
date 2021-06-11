/* eslint-disable */

import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import { Message, MessageBox } from 'element-ui'

OfflinePluginRuntime.install({

  onUpdateReady: () => {
    // 更新完成之后，调用applyUpdate即skipwaiting()方法
    OfflinePluginRuntime.applyUpdate()
  },
  onUpdated: () => {
    // 弹一个确认框
    MessageBox({        
        title: '更新',        
        message: '新版本内容下载完成，点击确定按钮立即使用新版',        
        confirmButtonText: '确定',        
        showClose: false,        
        showCancelButton: false,        
        closeOnClickModal: false,        
        closeOnPressEscape: false,        
        type: 'success',        
        callback() {          
          window.location.reload()       
        }      
    })      
    console.log('New content is available; please refresh.') 
  }
})

if (!navigator.serviceWorker) {
  console.log('請使用指定瀏覽器')
}

navigator.serviceWorker && navigator.serviceWorker.ready.then((registration) => {
  // publicKey和后台的publicKey对应保持一致

  const publicKey = 'BIeLIMiIXA-V3MPD9zid-9kL1959CLyTx7YgxyMcsvSjBOCNl9O6FTQiuF-uaKK1S4FGfVtg42NxsZ9GFIJj7k0'// 和后台保持一致
        
  // 获取订阅请求（浏览器会弹出一个确认框，用户是否同意消息推送）
  try {
    if (window.PushManager) {
      registration.pushManager.getSubscription().then(subscription => {
        // weui.topTips(subscription)
        // 如果用户没有订阅 并且是一个登录用户
        if (!subscription) {
          const subscription = registration.pushManager.subscribe({
            userVisibleOnly: true, // 表明该推送是否需要显性地展示给用户，即推送时是否会有消息提醒。如果没有消息提醒就表明是进行“静默”推送。在Chrome中，必须要将其设置为true，否则浏览器就会在控制台报错
            applicationServerKey: urlBase64ToUint8Array(publicKey)// web-push定义的客户端的公钥，用来和后端的web-push对应，需要进行一次转换
          })
          // 用户同意
            .then(function (subscription) {
              console.log('用戶同意訂閱:'+JSON.stringify(subscription))
              if (subscription && subscription.endpoint) {
                // 存入数据库
              }
            })

          // 用户不同意或者生成失败
            .catch(function (err) {
              console.log('用戶不同意訂閱：'+err)
            })
        } else { // 用户已经订阅过
          console.log('已訂閱過')
        }
      })
    }
  } catch (e) {
    // alert(e)
    console.log('註冊失敗:'+err)
  }
})

function urlBase64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
