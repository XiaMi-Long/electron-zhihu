<script setup>
import { ref } from 'vue'
import fixedMenu from '@renderer/components/fixed-menu/index.vue'

const configForm = ref({
  title: '',
  answerText: '',
  a: '',
  b: '',
  borderBottom: ''
})
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
                v-model:value="configForm.borderBottom"
                :show-preview="true"
                :show-alpha="false"
              />
            </div>
          </div>
        </div>
      </div>
    </n-scrollbar>
    <fixedMenu :data="['back']" :open-browser-url="openBrowserUrl" />
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
