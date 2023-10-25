<script setup>
import { ref, onMounted, watch } from 'vue'
import { cssVarUtils } from '@renderer/util/css.js'
import { useStyleStore } from '@renderer/pinia/style'
import fixedMenu from '@renderer/components/fixed-menu/index.vue'

const styleStore = useStyleStore()

const configForm = ref({
  dark: true
})
const mark = ref(null)
const disabledDark = ref(false)

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

const showDark = function () {
  mark.value.style.borderColor = '#2a272b73'
  mark.value.style.visibility = 'inherit'
  mark.value.classList.add('showDark')

  const setCss = new cssVarUtils()
  setCss.setVar('--title-color', 'lightgrey')
}

const showLight = function () {
  styleStore.dark = false
  mark.value.style.visibility = 'inherit'
  mark.value.classList.add('showLight')
}

const onMarkAnimationendEvent = function () {
  mark.value.addEventListener('animationend', function (event) {
    if (event.animationName.includes('showlight')) {
      mark.value.style.visibility = 'hidden'
      mark.value.classList.remove('showLight')
    }

    if (event.animationName.includes('showdark')) {
      mark.value.style.visibility = 'hidden'
      mark.value.classList.remove('showDark')
      styleStore.dark = true
    }
    disabledDark.value = false
  })
}

onMounted(() => {
  configForm.value.dark = styleStore.dark
  onMarkAnimationendEvent()

  watch(
    () => configForm.value.dark,
    (newVal) => {
      disabledDark.value = true
      if (newVal) {
        showDark()
      }

      if (!newVal) {
        showLight()
      }
    }
  )
})
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
              <n-switch
                v-model:value="configForm.dark"
                :disabled="disabledDark"
                :rail-style="railStyle"
                class="dark-mask"
              >
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

    <div ref="mark" class="mask"></div>
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

        z-index: 2;
        position: relative;

        color: var(--title-color);
        .color {
        }
      }
    }
  }
}

.mask {
  position: fixed;

  width: 1px;
  height: 1px;

  /* border-radius: 50%; */
  top: -60px;
  left: -60px;

  border: 10px solid #2a272b73;

  background: #2a272b;

  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;

  visibility: hidden;
}

.showDark {
  animation: showdark 1.5s;
}

@keyframes showdark {
  0% {
    border-left-width: 1px;
    border-bottom-width: 1px;
  }
  100% {
    border-left-width: 150vw;
    border-bottom-width: 150vh;
  }
}

.showLight {
  animation: showlight 1.5s;
}

@keyframes showlight {
  0% {
    border-left-width: 150vw;
    border-bottom-width: 150vh;
  }
  100% {
    border-left-width: 1px;
    border-bottom-width: 1px;
  }
}
</style>
