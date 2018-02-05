// 异步组件库
export default {
  namespaced: true,
  state: {
    asyncComponents: {
      'vue-iframe': () =>
        import('@strongsoft/vue-iframe')
    }
  }
}
