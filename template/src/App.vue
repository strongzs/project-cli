<template>
  <div id="app" :style="appStyle">
    <div v-if="$route.name==='login'" v-show="!isLoading">
      <router-view name="login" />
    </div>
    <template v-else>
      {{#if_eq cliType "PC"}}
      <!-- 导航栏 -->
      <div :style="topNavigationStyle">
        <navigation :default-active="$route.name"></navigation>
      </div>
      <!-- 页面中间主体 -->
      <div :style="centerMainStyle">
        <transition appear enter-active-class="animated fadeInLeftBig" leave-active-class="animated fadeOutLeftBig" mode="out-in" :duration="{leave:300}">
          <router-view :key="$route.path"></router-view>
        </transition>
      </div>
      {{/if_eq}}
      {{#if_eq cliType "mobile"}}
      <div :style="centerMainStyle">
        <transition appear enter-active-class="animated fadeInLeftBig" leave-active-class="animated fadeOutLeftBig" mode="out-in" :duration="{leave:300}">
          <router-view :key="$route.path"></router-view>
        </transition>
      </div>
      {{/if_eq}}
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
{{#if_eq cliType "PC"}}
import navigation from '@/components/navigation'
{{/if_eq}}

export default {
  components: {
    {{#if_eq cliType "PC"}}
    navigation
    {{/if_eq}}
  },
  computed: {
    ...mapGetters('global', [
      'isLoading'
    ]),
    ...mapGetters('layout', [
      'appStyle',
      'centerMainStyle'{{#if_eq cliType "PC"}},
      'topNavigationStyle'{{/if_eq}}
    ])
  }
}

</script>
<style {{#if_eq cliType "mobile"}}lang="less"{{/if_eq}}>
{{#if_eq cliType "mobile"}}
@import '~vux/src/styles/reset.less';
{{/if_eq}}
#app {
  font-family: Microsoft YaHei;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
