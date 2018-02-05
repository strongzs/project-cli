/**
 * 导出所有模块需要用到接口
 * 一级属性：模块名
 * 一级属性中的方法：当前模块需要用的接口
 * @type {Object}
 */
export default [{
  module: 'basic',
  name: '通用接口',
  list: require('./basic')
}, {
  module: 'user',
  name: '用户接口',
  list: require('./user')
}, {
  module: 'menu',
  name: '菜单接口',
  list: require('./menu')
}]
