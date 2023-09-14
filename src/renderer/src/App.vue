<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@renderer/paina/login'
import { Colors, coloredLog } from '@renderer/util/log'
import { getAllKeepAlive } from '@renderer/router/index'

const router = useRouter()
const loginStore = useLoginStore()

// 先判断本地缓存中是否有
const getLocal = async function () {
  // window.api.store.del(loginStore.localCacheKey)
  const hasLocal = await window.api.store.has(loginStore.localCacheKey)
  if (hasLocal) {
    const { acc_token, acc_cookie } = await window.api.store.get(loginStore.localCacheKey)
    loginStore.acc_token = acc_token
    loginStore.acc_cookie = acc_cookie
    loginStore.isLogin = true
  }

  // 检验登录状态判断是否跳转登录
  if (loginStore.isLogin === false) {
    router.push('/')
    coloredLog('当前的登录状态为：未登录', Colors.YELLOW)
  }

  if (loginStore.isLogin === true) {
    router.push('/home')
    coloredLog('当前的登录状态为：已登录', Colors.GREEN)
  }
}

onMounted(() => {
  getLocal()
})
</script>

<template>
  <n-message-provider>
    <router-view v-slot="{ Component, route }">
      <transition name="fade" enter-active-class="animate__animated animate__fadeInDown">
        <KeepAlive :include="getAllKeepAlive()">
          <component :is="Component" />
        </KeepAlive>
      </transition>
    </router-view>
  </n-message-provider>
</template>

<style lang="less">
@import './assets/css/styles.less';
@import './assets/css//base.scss';
</style>
