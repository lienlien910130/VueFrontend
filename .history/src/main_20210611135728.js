import Vue from 'vue'
import qs from 'qs'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'

import fabric from 'fabric'
import vcolorpicker from 'vcolorpicker'
import locale from 'element-ui/lib/locale/lang/zh-TW'
import 'element-ui/lib/theme-chalk/index.css'
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

// import * as OfflinePluginRuntime from 'offline-plugin/runtime';
// OfflinePluginRuntime.install();
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

Vue.use(ElementUI, {locale})
Vue.use(SIdentify)
Vue.use(fabric)
Vue.use(vcolorpicker)


Vue.config.productionTip = false
Vue.config.debug = false
Vue.config.devtools = true
Vue.prototype.$socket = socket
Vue.prototype.$indexedDB = indexedDB
Vue.prototype.$qs = qs
Vue.prototype.$api = api
Vue.prototype.$logForTranslate = logForTranslate

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
