import { createApp } from 'vue'
import App from './App.vue'
import 'animate.css'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { createPinia } from 'pinia'
import { router } from '@renderer/router/index'

import highlight from 'highlight.js'
import 'highlight.js/styles/dark.css'

import {
  create,
  NButton,
  NMessageProvider,
  NScrollbar,
  NImage,
  NSkeleton,
  NBackTop,
  NPopover,
  NList,
  NListItem,
  NColorPicker,
  NSpace,
  NSwitch,
  NDialogProvider,
  NNotificationProvider
} from 'naive-ui'

const pinia = createPinia()
const naive = create({
  components: [
    NButton,
    NMessageProvider,
    NScrollbar,
    NImage,
    NSkeleton,
    NBackTop,
    NPopover,
    NList,
    NListItem,
    NColorPicker,
    NSpace,
    NSwitch,
    NDialogProvider,
    NNotificationProvider
  ]
})

window.Viewer = Viewer
window.highlight = highlight

createApp(App).use(router).use(naive).use(pinia).mount('#app')
