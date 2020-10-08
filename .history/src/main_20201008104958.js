import Vue from 'vue'
import qs from 'qs'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import fabric from 'fabric'
import vcolorpicker from 'vcolorpicker'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App.vue'
import store from './store/index.js'
import router from './router.js'
import SIdentify from './views/login/components/identify.vue'
import socket from './utils/socket';

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

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(SIdentify)
Vue.use(fabric)
Vue.use(vcolorpicker)

Vue.config.productionTip = false

Vue.prototype.$socket = socket
Vue.prototype.$qs = qs

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
