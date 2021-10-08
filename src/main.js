// import Vue from 'vue'
const Vue = require('vue')
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-TW'
// const ElementUI = require('element-ui')
import 'element-ui/lib/theme-chalk/index.css'
import qs from 'qs'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import vcolorpicker from 'vcolorpicker'
import logForTranslate from '@/utils/logForTranslate.js'
import '@/components/componentRegister.js'

import '@/styles/index.scss' // global css

import App from './App.vue'
import store from './store/index.js'
import router from './router'
import SIdentify from './views/login/components/identify.vue'
import socket from './utils/socket'
import indexedDB from './utils/indexedDB'
import api from './api'

import '@/icons' // icon
import '@/permission' // permission control
// import '@/_registerServiceWorker.js'
import firebase from "firebase/app"
import '@firebase/messaging'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// Vue.use(ElementUI)
Vue.use(ElementUI, { locale })
Vue.use(SIdentify)
// Vue.use(fabric)
Vue.use(vcolorpicker)

Vue.config.productionTip = false
Vue.config.debug = false
Vue.config.devtools = true
Vue.prototype.$socket = socket
Vue.prototype.$indexedDB = indexedDB
Vue.prototype.$qs = qs
Vue.prototype.$api = api
Vue.prototype.$logForTranslate = logForTranslate

const firebaseConfig = {
  apiKey: "AIzaSyBXIfFxYh6c6Jb6Haa3zWr2RtS22nFVQEs",
  authDomain: "mercuryfire-886cf.firebaseapp.com",
  databaseURL: "https://mercuryfire-886cf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mercuryfire-886cf",
  storageBucket: "mercuryfire-886cf.appspot.com",
  messagingSenderId: "656647175001",
  appId: "1:656647175001:web:8255534ebbedb4a5d22a48",
  measurementId: "G-3CQ60MXFKF"
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()
Vue.prototype.$messaging = messaging
navigator.serviceWorker.register('/firebase-messaging-sw.js',{scope: '/'})
  .then((registration) => {
    console.log('firebase-messaging-sw.js')
    Vue.prototype.$messaging.useServiceWorker(registration)
}).catch(err => {
    console.log(err)
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
