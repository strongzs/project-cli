import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'{{#if_eq cliType "PC"}}
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'{{/if_eq}}
import Login from '@/components/login'{{#if_eq cliType "mobile"}}
import MenuGrid from '@/components/menu-grid'{{/if_eq}}

Vue.use(Router)

let router = new Router({
  routes: [{
    path: '/',
    redirect: { name: 'login' }
  }, {
    path: '/login/:module?',
    name: 'login',
    components: {
      login: Login
    }
  }{{#if_eq cliType "mobile"}}, {
    path: '/menu',
    name: 'menu',
    component: MenuGrid
  }{{/if_eq}}]
})

router.beforeEach((to, from, next) => {
  {{#if_eq cliType "PC"}}NProgress.start()
  {{/if_eq}}// 当前用户未登录时，访问非登录模块时
  if (to.name !== 'login' && !store.getters['global/userInfo']) {
    next({ name: 'login', params: { module: to.path.substr(1) } }){{#if_eq cliType "PC"}}
    NProgress.done(){{/if_eq}}
  }
  // 访问登录模块时
  if (to.name === 'login') {
  // 清空登录信息
    store.commit('global/setUserInfo', null)
  }
  next()
}){{#if_eq cliType "PC"}}

router.afterEach(() => {
  NProgress.done()
}){{/if_eq}}

store.registerModule('router', {
  namespaced: true,
  state: {
    router
  },
  mutations: {
    addRoutes (state, routes) {
      state.router.addRoutes(routes)
    }
  }
})

export default router
