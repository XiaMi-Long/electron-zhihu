<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@renderer/paina/login'
import { Colors, coloredLog } from '@renderer/util/log'
import { getAllKeepAlive } from '@renderer/router/index'

const router = useRouter()
const loginStore = useLoginStore()

onMounted(() => {
  if (loginStore.isLogin === false) {
    // 检验登录状态判断是否跳转登录
    router.push('/')
    coloredLog('当前的登录状态为：未登录', Colors.YELLOW)
  }
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
