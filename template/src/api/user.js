/**
 * 用户接口
 * @type {Object}
 */
module.exports = [{
  name: '用户登录',
  method: 'login',
  url: '/api/v2/basic/data?key=s_user_validate',
  type: 'get'
}, {
  name: '根据手机号获取用户信息',
  method: 'getUerByCellphone',
  url: '/api/v2/basic/data?key=s_user_by_cellphone',
  type: 'get'
}]
