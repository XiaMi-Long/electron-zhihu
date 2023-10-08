<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@renderer/pinia/login'

const token = ref('')
const cookie = ref('')
const router = useRouter()
const message = useMessage()
const loginStore = useLoginStore()

const enterClick = function () {
  if (token.value.length === 0 || cookie.value.length === 0) {
    message.error('请输入token')
    return
  }

  loginStore.acc_token = token.value
  loginStore.acc_cookie = cookie.value
  loginStore.isLogin = true
  window.api.store.set(loginStore.localCacheKey, {
    acc_token: token.value,
    acc_cookie: cookie.value
  })
  router.replace('/home')
  console.log(loginStore)
}
</script>

<template>
  <div class="background">
    <div class="input">
      <input v-model.trim="token" type="text" class="input-field" autofocus placeholder="token" />
      <input v-model.trim="cookie" type="text" class="input-field" autofocus placeholder="cookie" />
      <div class="button" @click="enterClick">
        <n-button text color="#fff"> Enter </n-button>
      </div>
    </div>
    <div class="title">
      <span>输入TOKEN-COOKIE</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.background {
  background-color: #26292a;

  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .title {
    color: white;

    padding: 20px;

    font-size: 35px;

    margin-top: 100px;
  }

  .input {
    display: flex;
    align-items: center;

    .input-field {
      border: none;
      border-bottom: 2px solid #fff;

      color: #fff;

      outline: none;

      background-color: transparent;

      padding: 10px;

      margin: 0 10px;
    }
  }
}
</style>
