<script setup>
import { useRouter } from 'vue-router'
import { useLoginStore } from '@renderer/pinia/login'

const props = defineProps({
  data: { type: Array, required: true },
  openBrowserUrl: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const loginStore = useLoginStore()

const back = function () {
  router.go(-1)
}

const openBrowser = function () {
  window.api.shell.openExternal(props.openBrowserUrl)
}

const setToken = function () {
  window.api.store.del(loginStore.localCacheKey)
  router.replace('/')
}

const goThemeConfig = function () {
  router.push('/config')
}
</script>

<template>
  <n-popover placement="top" trigger="hover" @update:show="true">
    <template #trigger>
      <div class="fixed-menu">菜单</div>
    </template>
    <div>
      <n-list>
        <n-list-item v-if="props.data.includes('token')" class="list-item-box" @click="setToken">
          重新设置token
        </n-list-item>
        <n-list-item v-if="props.data.includes('back')" class="list-item-box" @click="back">
          返回上一个页面
        </n-list-item>
        <n-list-item v-if="props.data.includes('open')" class="list-item-box" @click="openBrowser">
          用浏览器打开此页面
        </n-list-item>

        <n-list-item
          v-if="props.data.includes('config')"
          class="list-item-box"
          @click="goThemeConfig"
        >
          页面样式配置
        </n-list-item>
      </n-list>
    </div>
  </n-popover>
</template>

<style scoped lang="scss">
.fixed-menu {
  z-index: 2;

  position: fixed;
  width: 44px;
  height: 44px;

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  bottom: 100px;

  right: 100px;

  border-radius: 22px;

  background-color: #ffffff;

  color: rgb(51, 54, 57);

  box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.12);

  &:hover {
    color: #36ad6a;
  }
}

.list-item-box {
  cursor: pointer;

  &:hover {
    color: #36ad6a;
  }
}
</style>
