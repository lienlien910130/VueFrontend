import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'
import user from './modules/user.js'
import version from './modules/version'
import websocket from './modules/websocket'
import building from './modules/building'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    user,
    version,
    websocket,
    building
  },
  getters
})

export default store
