import Vue from 'vue'
import qs from 'qs'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import fabric from 'fabric'
import vcolorpicker from 'vcolorpicker'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App.vue'
import store from './store/index.js'
import router from './router'
import SIdentify from './views/login/components/identify.vue'
import socket from './utils/socket';
import api from './api'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(ElementUI)
Vue.use(SIdentify)
Vue.use(fabric)
Vue.use(vcolorpicker)

Vue.config.productionTip = false
Vue.config.debug = false
Vue.config.devtools = false
Vue.prototype.$socket = socket
Vue.prototype.$qs = qs
Vue.prototype.$api = api;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
