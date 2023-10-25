import { watch } from 'vue'
import { defineStore } from 'pinia'
import { cssVarUtils } from '@renderer/util/css.js'

export const useStyleStore = defineStore('style', {
  // 其他配置...
  state: () => {
    return {
      dark: false,
      // 本地缓存key常量名
      localCacheKey: 'STYLE'
    }
  },
  getters: {},
  actions: {
    watchStyle() {
      // 使用watch函数，传入一个匿名函数，返回style的值
      watch(
        () => this.dark,
        (newStyle) => {
          const setCss = new cssVarUtils()
          if (newStyle) {
            setCss.setVar('--title-color', 'lightgrey')
            setCss.setVar('--title-answer-text', '#a3a3a3')
            setCss.setVar('--a-back', '#2a272b')
            setCss.setVar('--b-back', '#2a272b')
            setCss.setVar('--border-bottom-color', '#2a272b')
            window.api.store.set(this.localCacheKey, true)
          }

          if (!newStyle) {
            setCss.setVar('--title-color', 'black')
            setCss.setVar('--title-answer-text', 'black')
            setCss.setVar('--a-back', '#f6f6f6')
            setCss.setVar('--b-back', '#ffffff')
            setCss.setVar('--border-bottom-color', '#f6f4f4')
            window.api.store.set(this.localCacheKey, false)
          }
        }
      )
    }
  }
})
