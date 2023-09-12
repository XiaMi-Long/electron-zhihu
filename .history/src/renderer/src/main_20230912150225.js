import { createApp } from 'vue'
import App from './App.vue'
import 'animate.css'
import { createPinia } from 'pinia'
import { router } from '@renderer/router/index'

import {
  // create naive ui
  create
} from 'naive-ui'

const naive = create({
  components: []
})

createApp(App).use(router).use(naive).use(pinia).mount('#app')
