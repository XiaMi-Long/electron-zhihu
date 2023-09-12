import { createApp } from 'vue'
import App from './App.vue'

import {
  // create naive ui
  create
} from 'naive-ui'

const naive = create({
  components: []
})

createApp(App).mount('#app')
