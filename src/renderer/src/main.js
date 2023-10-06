import { createApp } from 'vue'
import App from './App.vue'
import 'animate.css'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { createPinia } from 'pinia'
import { router } from '@renderer/router/index'

import { create, NButton, NMessageProvider, NScrollbar, NImage } from 'naive-ui'

const pinia = createPinia()
const naive = create({
  components: [NButton, NMessageProvider, NScrollbar, NImage]
})

// 添加全局图片预览事件
window.previewPhoto = function (event) {
  var img = document.createElement('img')
  img.src = event.target.src
  const viewer = new Viewer(img, {
    hidden: function () {
      const viewerContainer = document.querySelector('.viewer-container')
      if (viewerContainer) {
        viewerContainer.parentNode.removeChild(viewerContainer)
      }
    }
  })
  viewer.show()
}

createApp(App).use(router).use(naive).use(pinia).mount('#app')
