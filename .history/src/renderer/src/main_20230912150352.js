import { createApp } from 'vue'
import App from './App.vue'
import 'animate.css'
import { createPinia } from 'pinia'
import { router } from '@renderer/router/index'

import { create } from 'naive-ui'

const pinia = createPinia()
const naive = create({
  components: []
})

createApp(App).use(router).use(naive).use(pinia).mount('#app')
