export default {
  namespaced: true,
  state: {
    /* --------------------------根级容器Begin-------------------------- */
    app: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      overflow: 'hidden'
    },
    /* --------------------------根级容器End-------------------------- */
    {{#if_eq cliType "PC"}}
    /* -------------------------顶部导航栏Begin------------------------- */
    topNavigation: { // 顶部导航栏
      top: 0,
      left: 0,
      right: 0,
      zIndex: 199201092417,
      height: '80px',
      position: 'absolute'
    },
    /* -------------------------顶部导航栏Begin------------------------- */
    {{/if_eq}}

    /* ------------------------中间内容主体Begin------------------------ */
    centerMain: { // 中间主体内容部分
      {{#if_eq cliType "mobile"}}top: 0,
      {{/if_eq}}left: 0,
      right: 0,
      bottom: 0,
      overflow: 'visible',
      position: 'absolute'
    }
    /* -------------------------中间内容主体End------------------------- */

  },
  getters: {
    /**
     * [appStyle 返回根级容器最终的样式]
     */
    appStyle (state) {
      return [state.app]
    },{{#if_eq cliType "PC"}}
    /**
     * [topNavigationStyle 返回顶部导航栏最终的样式]
     */
    topNavigationStyle (state) {
      return [state.topNavigation]
    },{{/if_eq}}
    /**
     * [centerMainStyle 返回中间主体内容最终的样式]
     */
    centerMainStyle (state) {
      return [state.centerMain{{#if_eq cliType "PC"}}, {top: state.topNavigation.height}{{/if_eq}}]
    }
  }
}
