import Vue from 'vue'
import Vuex from 'vuex'
import layout from './layout'
import components from './components'
import global from '@strongsoft/framework-core-vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    global,
    layout,
    components
  }
})
