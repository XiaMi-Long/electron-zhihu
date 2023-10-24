<script setup>
import { ref, onMounted, watch } from 'vue'

import { useStyleStore } from '@renderer/pinia/style'
import fixedMenu from '@renderer/components/fixed-menu/index.vue'

const styleStore = useStyleStore()

const configForm = ref({
  dark: true
})

const railStyle = function ({ focused, checked }) {
  const style = {}
  if (checked) {
    style.background = '#403e41'
    if (focused) {
      style.boxShadow = '#403e41d9'
    }
  } else {
    style.background = '#4098fc'
    if (focused) {
      style.boxShadow = '#4098fcb3'
    }
  }
  return style
}

onMounted(() => {
  configForm.value.dark = styleStore.dark
})

watch(
  () => configForm.value.dark,
  (newVal) => {
    if (newVal) {
      styleStore.dark = true
    }

    if (!newVal) {
      styleStore.dark = false
    }
  }
)
</script>

<template>
  <div class="background">
    <n-scrollbar>
      <div class="container">
        <div class="config-form">
          <div class="list">
            <div class="text">
              <span>夜间模式</span>
            </div>
            <div class="color">
              <n-switch v-model:value="configForm.dark" :rail-style="railStyle" class="dark-mask">
                <template #unchecked> light </template>
                <template #checked> dark </template>
              </n-switch>
            </div>
          </div>
          <!-- <n-space justify="center" size="large">
            <n-button type="" @click="reset"> 重置 </n-button>
            <n-button type="info" @click="confirm"> 确定 </n-button>
          </n-space> -->
        </div>

        <div class="style-preview"></div>
      </div>
    </n-scrollbar>
    <fixedMenu :data="['back']" />

    <div class="mask"></div>
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
        justify-content: space-evenly;

        color: var(--title-color);
        .color {
        }
      }
    }
  }
}

.mask {
  position: fixed;

  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  /* 背景颜色为黑色 */
  background-color: rgba(0, 0, 0, 0.8);

  visibility: hidden;

  transition: visibility 1s;
}

.dark-mask {
  position: relative;
}
.dark-mask::after {
  content: '';
}
</style>
