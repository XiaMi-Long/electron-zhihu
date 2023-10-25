<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@renderer/pinia/login'
import { useStyleStore } from '@renderer/pinia/style'
import { Colors, coloredLog } from '@renderer/util/log'
import { getAllKeepAlive } from '@renderer/router/index'

const router = useRouter()
const loginStore = useLoginStore()
const styleStore = useStyleStore()

// 先判断本地缓存中是否有
const getLocal = async function () {
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

// 获取本地样式记录
const setLocalStyle = async function () {
  // window.api.store.del(styleStore.localCacheKey)
  const hasLocal = await window.api.store.has(styleStore.localCacheKey)
  if (hasLocal) {
    const dark = await window.api.store.get(styleStore.localCacheKey)
    styleStore.watchStyle()
    styleStore.dark = dark
    coloredLog(`当前的背景为${dark ? '暗色' : '亮色'}`, Colors.YELLOW)
  }

  if (!hasLocal) {
    window.api.store.set(styleStore.localCacheKey, false)
  }
}

onMounted(() => {
  getLocal()
  setLocalStyle()
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

<style lang="scss">
@import './assets/css/styles.scss';
@import './assets/css/base.scss';
</style>
