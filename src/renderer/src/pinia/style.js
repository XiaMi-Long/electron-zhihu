import { watch } from 'vue'
import { defineStore } from 'pinia'
import { cssVarUtils } from '@renderer/util/css.js'

export const useStyleStore = defineStore('style', {
  // 其他配置...
  state: () => {
    return {
      style: {},
      // 本地缓存key常量名
      localCacheKey: 'STYLE'
    }
  },
  getters: {},
  actions: {
    watchStyle() {
      // 使用watch函数，传入一个匿名函数，返回style的值
      watch(
        () => this.style,
        (newStyle) => {
          const setCss = new cssVarUtils()
          setCss.setVar('--title-color', newStyle.title)
          setCss.setVar('--title-answer-text', newStyle.answerText)
          setCss.setVar('--a-back', newStyle.a)
          setCss.setVar('--b-back', newStyle.b)
          setCss.setVar('--border-bottom-color', newStyle.borderBottom)
        }
      )
    }
  }
})
