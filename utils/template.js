exports.template = {
    "navigation": `<template>
  <div class="navigation">
    <div class="logo" style="background-image:url(static/top_log_new.png)"></div>
    <div class="menu">
      <nav-menu :menu-data="rawMenu" :first-end-menu="firEndMenu"></nav-menu>
    </div>
    <div class="login">
      <span style="color:#fff">{{ userInfo&&userInfo.realname||'' }}&nbsp;&nbsp;</span>
      <img src="static/login_out.png" @click="loginOutSystem">
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import NavMenu from './nav-menu'

export default {
  name: 'navigation',
  components: {
    NavMenu
  },
  computed: {
    ...mapGetters('global', [
      'userInfo',
      'firEndMenu',
      'rawMenu'
    ])
  },
  methods: {
    ...mapActions('global', [
      'loginOut'
    ]),
    loginOutSystem () {
      this.loginOut().then(() => {
        this.$router.push({ name: 'login' })
      })
    }
  }
}

</script>
<style scoped lang="less">
.navigation {
  display: flex;
  height: 80px;
  border-bottom: 1px solid #ccc;
  background-color: rgba(12, 19, 42, .8);
  .logo {
    width: 500px;
    height: 100%;
    background-repeat: no-repeat;
  }
  .menu {
    width: 100%;
    z-index: 100;
  }
  .login {
    cursor: pointer;
    width: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 15px;
  }
  .login:before {
    content: '';
    position: relative;
    right: 25px;
    background: #a7bde0;
    width: 1px;
    height: 20px;
  }
}

</style>
`,
"navMenu":`<template>
  <div class="nav-menu">
    <ul class="menu-ul">
      <li class="fir-menu" v-for="firMenu in firLevelMenu" :key="firMenu.args" :style="style" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave" @click="handleMenuClick(firMenu,firMenu)" :class="{'active-fir-menu':activeFirMenu&&activeFirMenu.args===firMenu.args}">
        <span class="fir-menu-name">{{firMenu.mname}}</span> <img v-if="firMenu.childMenu.length>0" class="arrow" src="static/nav_arrow_b_x.png" />
        <div class="menu-panel" v-if="firMenu.childMenu.length>0">
          <div class="sub-panel" v-for="secMenu in firMenu.childMenu" :key="secMenu.args">
            <div class="sec-menu" @click="handleMenuClick(secMenu,firMenu,secMenu)">
              <div class="sec-menu-title" :class="{'active-sub-menu':activeSubMenu&&activeSubMenu.args===secMenu.args}" :data-end="secMenu.childMenu.length>0?0:1">
                <span>{{secMenu.mname}}</span>
              </div>
              <div class="trd-panel" v-if="secMenu.childMenu.length>0">
                <div class="trd-menu" v-for="trdMenu in secMenu.childMenu" :key="trdMenu.args">
                  <span class="trd-menu-title" :class="{'active-sub-menu':activeSubMenu&&activeSubMenu.args===trdMenu.args}" @click="handleMenuClick(trdMenu,firMenu,trdMenu)">{{trdMenu.mname}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import $ from 'jquery'

export default {
  name: 'nav-menu',
  props: {
    menuData: {
      type: Array,
      default: () => []
    },
    firEndMenu: {
      type: Object
    }
  },
  data () {
    return {
      style: {
        width: '110px'
      },
      activeFirMenu: null, // 当前激活的一级菜单
      activeSubMenu: null // 当前激活的子级菜单
    }
  },
  computed: {
    firLevelMenu () {
      return this.menuData.filter(item => item.level === 1)
    }
  },
  created () {
    this.setActiveMenu()
  },
  mounted () {
    this.style.width = (this.$el.offsetWidth - 30) / this.firLevelMenu.length + 'px'
    $(this.$el).find('.menu-panel').hide()
  },
  methods: {
    handleMouseenter (e) {
      let firLevelMenuLi = $(e.currentTarget)
      firLevelMenuLi.find('.arrow').attr('src', 'static/nav_arrow_b_s.png')
      $(this.$el).find('.menu-panel').stop(true, false).animate({
        opacity: 0
      }, function () {
        $(this).hide()
      })
      if (firLevelMenuLi.find('.menu-panel').length > 0) {
        firLevelMenuLi.find('.menu-panel').stop(true, false).show().animate({
          opacity: 1
        })
      }
    },
    handleMouseleave (e) {
      let firLevelMenuLi = $(e.currentTarget)
      firLevelMenuLi.find('.arrow').attr('src', 'static/nav_arrow_b_x.png')
      $(this.$el).find('.menu-panel').stop(true, false).animate({
        opacity: 0
      }, 'fast', function () {
        $(this).hide()
      })
    },
    handleMenuClick (menu, activeFirMenu, activeSubMenu) {
      if (menu.childMenu.length === 0 || !menu.childMenu) {
        this.$router.push({ name: menu.args })
        this.activeFirMenu = activeFirMenu
        this.activeSubMenu = activeSubMenu
        $(this.$el).find('.menu-panel').hide()
      }
    },
    setActiveMenu () {
      if (this.$route) {
        let menu = this.$route.meta.menu
        this.activeFirMenu = this.findFirLevelMenu(menu)
        if (menu.level !== 1) {
          this.activeSubMenu = menu
        }
      } else {
        this.$router.push({ name: this.firEndMenu.args })
        this.activeFirMenu = this.findFirLevelMenu(this.firEndMenu)
        if (this.firEndMenu.level !== 1) {
          this.activeSubMenu = this.firEndMenu
        }
      }
    },
    findFirLevelMenu (menu) {
      if (menu.level === 1) {
        return menu
      }
      let parentMenu = this.menuData.find(item => item.menuid === menu.parentid)
      return this.findFirLevelMenu(parentMenu)
    }
  }
}

</script>
<style scoped lang="less">
.nav-menu {
  font-family: 'Microsoft YaHei';
  width: 100%;
  height: 100%;
  .menu-ul {
    margin: 0;
    list-style: none;
    .arrow {
      vertical-align: middle;
    }
    .active-fir-menu {
      width: 112.875px;
      border-bottom: 6px solid #259cf0;
      box-sizing: border-box;
    }
    .fir-menu {
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      float: left;
      height: 80px;
      width: 110px;
      line-height: 80px;
      text-align: center;
      letter-spacing: 0;
      box-sizing: border-box;
      transition: all 150ms linear 0s;
    }
    .fir-menu:after {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      border: 1px solid rgba(255, 255, 255, 0);
      bottom: 6px;
      content: " ";
      display: block;
      margin: 0 auto;
      position: relative;
      -webkit-transition: all 280ms ease-in-out;
      transition: all 280ms ease-in-out;
      width: 0;
    }
    .fir-menu:hover {
      letter-spacing: 3px;
    }
    .fir-menu:hover:after {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      border-color: #D1DDEB;
      border-width: 3px;
      -webkit-transition: width 350ms ease-in-out;
      transition: width 350ms ease-in-out;
      width: 95%;
    }
    .menu-panel {
      text-align: left;
      display: flex;
      flex-wrap: wrap;
      position: fixed;
      left: 0;
      right: 0;
      letter-spacing: normal;
      background-color: #F4F8FB;
      padding: 20px 30px 20px 30px;
      .sub-panel {
        width: 50%;
        display: flex;
        flex-direction: column;
        padding: 0 20px 20px 0;
        box-sizing: border-box;
        .sec-menu {
          color: #7793AE;
          line-height: 50px;
          .sec-menu-title {
            border-bottom: solid 1px #E5EBF2;
            box-sizing: border-box;
            height: 53px;
          }
          .sec-menu-title.active-sub-menu {
            color: #259cf0;
            border-bottom: solid 6px #259cf0;
          }
          .sec-menu-title[data-end='1']:after {
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            border: 1px solid rgba(255, 255, 255, 0);
            content: " ";
            bottom: 3px;
            display: block;
            margin: 0 auto;
            position: relative;
            -webkit-transition: all 280ms ease-in-out;
            transition: all 280ms ease-in-out;
            width: 0;
          }
          .sec-menu-title[data-end='1']:hover {
            border-bottom: none;
          }
          .sec-menu-title[data-end='1']:hover:after {
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            border-color: #D1DDEB;
            border-width: 3px;
            -webkit-transition: width 350ms ease-in-out;
            transition: width 350ms ease-in-out;
            width: 100%;
          }
          .trd-panel {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .trd-menu {
              font-size: 15px;
              color: #424F57;
              margin-right: 20px;
              height: 40px;
              width: 105px;
              line-height: 40px;
              box-sizing: border-box;
              display: inline;
              .trd-menu-title {
                height: 40px;
                position: absolute;
                box-sizing: border-box;
              }
              .trd-menu-title.active-sub-menu {
                color: #259cf0;
                border-bottom: solid 6px #259cf0;
              }

              .trd-menu-title:after {
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
                border: 1px solid rgba(255, 255, 255, 0);
                bottom: 6px;
                content: " ";
                display: block;
                margin: 0 auto;
                position: relative;
                -webkit-transition: all 280ms ease-in-out;
                transition: all 280ms ease-in-out;
                width: 0;
              }
              .trd-menu-title:hover:after {
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
                border-color: #D1DDEB;
                border-width: 3px;
                -webkit-transition: width 350ms ease-in-out;
                transition: width 350ms ease-in-out;
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}

</style>
`,
"PCLogin":`<template>
  <el-row style="margin-top: 10%">
    <el-col :span="8" :offset="8">
      <transition appear enter-active-class="animated zoomInUp" leave-active-class="animated zoomOutDown">
        <el-card style="width: 450px;margin:0 auto">
          <el-form label-position="right" :rules="rules" label-width="70px" :model="userInfo" ref="loginForm">
            <el-form-item prop="username" label="用户名">
              <el-input v-model.trim="userInfo.username" placeholder="用户名" auto-complete="off" @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input type="password" v-model.trim="userInfo.password" auto-complete="off" placeholder="密码" @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
            <el-form-item v-if="enableValidCode" prop="validCode" label="验证码">
              <el-col :span="16">
                <el-input v-model.trim="userInfo.validCode" placeholder="验证码"></el-input>
              </el-col>
              <el-col :span="8">
                <img @click="getValidCode" ref="validCodeImg" style="height:100%;" :src="validCodeUrl" />
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="remember" label="记住密码"></el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button style="width:100%;" type="primary" @click="onSubmit" :loading="loading">登录</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </transition>
    </el-col>
  </el-row>
</template>
<script>
import md5 from 'md5'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'login',
  props: {
    // 是否启用验证码
    enableValidCode: {
      type: Boolean,
      default: false
    },
    // 获取验证码的url地址
    validCodeUrl: {
      type: String
    },
    // 服务端返回的验证码cookie名称
    validCodeCookie: {
      type: String,
      default: 'checkCodeMD5'
    }
  },
  data () {
    return {
      loading: false,
      remember: true,
      userInfo: {
        username: '', // 用户名
        password: '', // 登录密码
        validCode: '' // 验证码
      },
      rules: {
        username: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入用户名'))
            } else {
              callback()
            }
          }
        }],
        password: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'))
            } else {
              callback()
            }
          }
        }],
        validCode: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入验证码'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  computed: {
    ...mapGetters('global', [
      'cookie',
      'firEndMenu'
    ])
  },
  mounted () {
    this.loadAccount()
  },
  methods: {
    ...mapMutations('global', [
      'setCookie',
      'removeCookie'
    ]),
    ...mapActions('global', [
      'loginByUserName'
    ]),
    onSubmit () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.enableValidCode) {
            let validCode = this.userInfo.validCode
            if (this.cookie[this.validCodeCookie].toUpperCase() !== md5(validCode.toUpperCase()).toUpperCase()) {
              this.$message.error('验证码有有误，请重新输入！')
              return
            }
          }
          this.loading = true
          this.loginByUserName(this.userInfo).then(resp => {
            this.loading = false // 登录成功
            this.remember ? this.rememberAccount() : this.removeAccount()
            this.enterSystem()
          }).catch(err => {
            this.loading = false
            this.$message.error(err.message) // 登录失败
          })
        }
      })
    },
    /**
     * 获取验证码
     * @return {[type]} [description]
     */
    getValidCode () {
      this.$refs.validCodeImg.src = this.validCodeUrl + '?random=' + Math.random()
    },
    /**
     * [rememberAccount 记住密码]
     */
    rememberAccount () {
      this.setCookie({ name: 'rememberAccount', value: 1 })
      this.setCookie({ name: 'accountInfo', value: escape(JSON.stringify(this.userInfo)) })
    },
    /**
     * [clearAccount 清除账户]
     * @return {[type]} [description]
     */
    removeAccount () {
      this.removeCookie('accountInfo')
      this.removeCookie('rememberAccount')
    },
    /**
     * [loadAccount 加载用户信息]
     */
    loadAccount () {
      if (this.cookie['rememberAccount']) {
        let accountInfo = JSON.parse(unescape(this.cookie['accountInfo']))
        this.userInfo.username = accountInfo.username
        this.userInfo.password = accountInfo.password
        this.remember = true
      }
    },
    enterSystem () {
      if (this.$route.params.module) {
        this.$router.push({ path: '/' + this.$route.params.module, query: this.$route.query })
      } else {
        this.$router.push({ path: '/' + (this.firEndMenu.navigateuri || this.firEndMenu.args) })
      }
    }
  }
}

</script>
<style scoped lang="less">
.login {
  width: 100%;
  height: 100%;
}

</style>
`,
"MobileLogin":`<template>
  <div class="login" style="background-image: url(static/bj.png);">
    <transition appear enter-active-class="animated zoomInUp">
      <box gap="50% 30px">
        <group>
          <x-input title="账号" v-model.trim="userInfo.username" placeholder="请填写账号" auto-complete="off"></x-input>
          <x-input title="密码" v-model.trim="userInfo.password" placeholder="请填写密码" type="password" auto-complete="off"></x-input>
        </group>
        <x-button type="primary" @click.native="onSubmit" style="margin-top:20px;border-radius: 10px" :show-loading="loading">登录</x-button>
      </box>
    </transition>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Box, Group, XInput, XButton, Toast, ToastPlugin } from 'vux'

Vue.use(ToastPlugin)

export default {
  name: 'login',
  components: {
    Box,
    Toast,
    Group,
    XInput,
    XButton
  },
  data () {
    return {
      loading: false,
      msgShow: false,
      userInfo: {
        username: '', // 用户名
        password: '' // 登录密码
      }
    }
  },
  computed: {
    ...mapGetters('global', [
      'cookie',
      'firEndMenu'
    ])
  },
  mounted () {
    this.loadAccount()
  },
  methods: {
    ...mapMutations('global', [
      'setCookie'
    ]),
    ...mapActions('global', [
      'loginByUserName'
    ]),
    valid () {
      return new Promise((resolve, reject) => {
        if (!this.userInfo.username) {
          return reject(new Error('请填写账号！'))
        }
        if (!this.userInfo.password) {
          return reject(new Error('请填写密码！'))
        }
        resolve()
      })
    },
    onSubmit () {
      this.valid().then(() => {
        this.loading = true
        this.loginByUserName(this.userInfo).then(resp => {
          this.loading = false // 登录成功
          this.rememberAccount()
          this.enterSystem()
        }).catch(() => {
          this.loading = false
          this.$vux.toast.text('账号或密码错误！', 'top') // 登录失败
        })
      }).catch(err => {
        this.$vux.toast.text(err.message, 'top')
      })
    },
    /**
     * [rememberAccount 记住密码]
     */
    rememberAccount () {
      this.setCookie({ name: 'rememberAccount', value: 1 })
      this.setCookie({ name: 'accountInfo', value: escape(JSON.stringify(this.userInfo)) })
    },
    /**
     * [loadAccount 加载用户信息]
     */
    loadAccount () {
      if (!this.cookie['accountInfo']) {
        return
      }
      let accountInfo = JSON.parse(unescape(this.cookie['accountInfo']))
      this.userInfo.username = accountInfo.username
      this.userInfo.password = accountInfo.password
    },
    enterSystem () {
      this.$router.push({ name: 'menu' })
    }
  }
}

</script>
<style>
.login .weui-cells {
  border-radius: 10px;
}

.login .weui-input {
  font-size: 15px !important;
  margin-left: 11px;
  margin-bottom: 5px;
}

.login .weui-label {
  font-size: 15px;
}

</style>
<style scoped lang="less">
.login {
  font-size: 20px;
  font-family: 微软雅黑;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  background-size: 100%;
  background-position: center;
  text-align: center;

  .weui-btn_primary {
    background-color: #5DE469;
  }

  .vux-x-input.weui-cell {
    border-bottom-color: #ccc;
    border-width: 0 0 1px 0;
    border-style: solid;
  }
}

</style>
`,
"menuGrid":`<template>
  <div class="menu-grid" style="background-image: url(static/bj.png);">
    <div class="menu-item" v-for="(menu,index) in rawMenu" :key="index" @click="handleMenuClick(menu)">{{menu.mname}}</div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'menu-grid',
  computed: {
    ...mapGetters('global', [
      'rawMenu'
    ])
  },
  methods: {
    handleMenuClick (menu) {
      this.$router.push({ name: menu.args })
    }
  }
}

</script>
<style scoped lang="less">
.menu-grid {
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  padding-top: 100px;
  background-size: 100%;
  background-position: center;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  .menu-item {
    text-align: center;
    width: 33%;
    height: 100px;
  }
}

</style>
`
}
