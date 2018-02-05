// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'{{#if_eq cliType "PC"}}
// Element-UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 清除浏览器默认的样式
import 'reset.css'{{/if_eq}}
// 动画库
import 'animate.css'
// 全局状态管理器
import store from '@/store'
// 路由配置
import router from '@/router'
// API配置信息
import apiConfig from '@/api'
// 接口请求工具
import $api from '@strongsoft/vue-axios'
{{#if_eq cliType "mobile"}}
// 移除移动端点击延迟
const FastClick = require('fastclick')

FastClick.attach(document.body)
{{/if_eq}}

Vue.use($api, {
  {{#if_eq cliType "mobile"}}nprogressConfig: {
    enable: false
  },
  {{/if_eq}}apiConfig
})
{{#if_eq cliType "PC"}}

Vue.use(ElementUI)
{{/if_eq}}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    const setLoadingState = () => {
      store.commit('global/setLoadingState', false)
    }
    store.dispatch('global/loginByCookie').then(() => {
      {{#if_eq cliType "PC"}}if (router.currentRoute.params.module) {
        router.push({ path: '/' + router.currentRoute.params.module, query: router.currentRoute.query }, setLoadingState)
      } else {
        router.push({ path: '/' + (store.getters['global/firEndMenu'].navigateuri || store.getters['global/firEndMenu'].args) }, setLoadingState)
      }{{/if_eq}}{{#if_eq cliType "mobile"}}router.push({name: 'menu'}, setLoadingState){{/if_eq}}
    }).catch(() => {
      router.push({name: 'login'}, setLoadingState, setLoadingState)
    })
  }
})
