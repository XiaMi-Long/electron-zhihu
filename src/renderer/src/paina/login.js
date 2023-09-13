import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
  // 其他配置...
  state: () => {
    return {
      // 是否登录
      isLogin: false,
      // token
      acc_token: '',
      // cookie
      acc_cookie: ''
    }
  },
  getters: {},
  actions: {}
})
