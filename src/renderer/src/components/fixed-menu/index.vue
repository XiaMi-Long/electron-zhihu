<script setup>
import { useDialog } from 'naive-ui'
import { useRouter } from 'vue-router'
import { FirefoxBrowser } from '@vicons/fa'
import { ArrowBackUp } from '@vicons/tabler'
import { KeyOutline } from '@vicons/ionicons5'
import { DarkTheme20Filled } from '@vicons/fluent'
import { useLoginStore } from '@renderer/pinia/login'

const props = defineProps({
  data: { type: Array, required: true },
  openBrowserUrl: {
    type: String,
    default: ''
  }
})

const dialog = useDialog()
const router = useRouter()
const loginStore = useLoginStore()

const back = function () {
  router.push(`/home`)
}

const openBrowser = function () {
  window.api.shell.openExternal(props.openBrowserUrl)
}

const setToken = function () {
  dialog.warning({
    title: '提 示',
    content: '你确定重新设置token吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      window.api.store.del(loginStore.localCacheKey)
      router.replace('/')
    },
    onNegativeClick: () => {}
  })
}

const goThemeConfig = function () {
  router.push('/config')
}
</script>

<template>
  <div class="fixed-menu">
    <div v-if="props.data.includes('token')" class="item" @click="setToken">
      <n-popover placement="top" trigger="hover" @update:show="true">
        <template #trigger>
          <n-icon size="25">
            <KeyOutline />
          </n-icon>
        </template>
        <span>重新设置token</span>
      </n-popover>
    </div>

    <div v-if="props.data.includes('back')" class="item" @click="back">
      <n-popover placement="top" trigger="hover" @update:show="true">
        <template #trigger>
          <n-icon size="25">
            <ArrowBackUp />
          </n-icon>
        </template>
        <span>返回上一个页面</span>
      </n-popover>
    </div>

    <div v-if="props.data.includes('open')" class="item" @click="openBrowser">
      <n-popover placement="top" trigger="hover" @update:show="true">
        <template #trigger>
          <n-icon size="25">
            <FirefoxBrowser />
          </n-icon>
        </template>
        <span>用浏览器打开此页面</span>
      </n-popover>
    </div>

    <div v-if="props.data.includes('config')" class="item" @click="goThemeConfig">
      <n-popover placement="top" trigger="hover" @update:show="true">
        <template #trigger>
          <n-icon size="25">
            <DarkTheme20Filled />
          </n-icon>
        </template>
        <span>页面样式配置</span>
      </n-popover>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fixed-menu {
  z-index: 2;

  position: fixed;
  height: 40px;

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);

  border-radius: 22px;

  background-color: #ffffff24;

  color: rgb(51, 54, 57);

  box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.12);

  .item {
    width: 80px;

    display: flex;
    justify-content: center;
    align-items: center;

    color: white;
    &:hover {
      color: #36ad6a;
    }
  }
}

.list-item-box {
  cursor: pointer;

  &:hover {
    color: #36ad6a;
  }
}
</style>
