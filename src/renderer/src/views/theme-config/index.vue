<script setup>
import { ref } from 'vue'

import { useStyleStore } from '@renderer/pinia/style'
import fixedMenu from '@renderer/components/fixed-menu/index.vue'

const styleStore = useStyleStore()

const defaultColor = {
  title: 'black',
  answerText: 'black',
  a: '#f6f6f6',
  b: '#ffffff',
  borderBottom: '#f6f4f4'
}

const configForm = ref({
  title: '',
  answerText: '',
  a: '',
  b: '',
  borderBottom: ''
})

const confirm = function () {
  window.api.store.set(styleStore.localCacheKey, {
    title: configForm.value.title,
    answerText: configForm.value.answerText,
    a: configForm.value.a,
    b: configForm.value.b,
    borderBottom: configForm.value.borderBottom
  })

  styleStore.style = {
    title: configForm.value.title,
    answerText: configForm.value.answerText,
    a: configForm.value.a,
    b: configForm.value.b,
    borderBottom: configForm.value.borderBottom
  }
}

const reset = function () {
  window.api.store.set(styleStore.localCacheKey, {
    title: defaultColor.title,
    answerText: defaultColor.answerText,
    a: defaultColor.a,
    b: defaultColor.b,
    borderBottom: defaultColor.borderBottom
  })

  styleStore.style = {
    title: defaultColor.title,
    answerText: defaultColor.answerText,
    a: defaultColor.a,
    b: defaultColor.b,
    borderBottom: defaultColor.borderBottom
  }

  configForm.value.title = defaultColor.title
  configForm.value.answerText = defaultColor.answerText
  configForm.value.a = defaultColor.a
  configForm.value.b = defaultColor.b
  configForm.value.borderBottom = defaultColor.borderBottom
}
</script>

<template>
  <div class="background">
    <n-scrollbar>
      <div class="container">
        <div class="config-form">
          <div class="list">
            <div class="text">
              <span>标题</span>
            </div>
            <div class="color">
              <n-color-picker
                :modes="['hex']"
                v-model:value="configForm.title"
                :show-preview="true"
                :show-alpha="false"
              />
            </div>
          </div>

          <div class="list">
            <div class="text">
              <span>回答</span>
            </div>
            <div class="color">
              <n-color-picker
                :modes="['hex']"
                v-model:value="configForm.answerText"
                :show-preview="true"
                :show-alpha="false"
              />
            </div>
          </div>

          <div class="list">
            <div class="text">
              <span>区域A</span>
            </div>
            <div class="color">
              <n-color-picker
                :modes="['hex']"
                v-model:value="configForm.a"
                :show-preview="true"
                :show-alpha="false"
              />
            </div>
          </div>

          <div class="list">
            <div class="text">
              <span>区域B</span>
            </div>
            <div class="color">
              <n-color-picker
                :modes="['hex']"
                v-model:value="configForm.b"
                :show-preview="true"
                :show-alpha="false"
              />
            </div>
          </div>

          <div class="list">
            <div class="text">
              <span>下边框</span>
            </div>
            <div class="color">
              <n-color-picker
                :modes="['hex']"
                v-model:value="configForm.borderBottom"
                :show-preview="true"
                :show-alpha="false"
              />
            </div>
          </div>
          <n-space justify="center" size="large">
            <n-button type="" @click="reset"> 重置 </n-button>
            <n-button type="info" @click="confirm"> 确定 </n-button>
          </n-space>
        </div>
      </div>
    </n-scrollbar>
    <fixedMenu :data="['back']" />
  </div>
</template>

<style scoped lang="scss">
.background {
  width: 100%;
  height: 100%;

  background-color: var(--a-back);

  overflow: auto;
  .container {
    display: flex;
    flex-direction: column;

    height: 100%;

    padding: 50px 50px 0 50px;

    .config-form {
      box-sizing: border-box;

      width: 100%;
      min-height: 150px;

      background-color: var(--b-back);

      padding: 10px 20px 20px 20px;

      .list {
        display: flex;
        align-items: center;
        justify-content: space-around;

        .color {
          width: 70%;
        }
      }
    }
  }
}
</style>
