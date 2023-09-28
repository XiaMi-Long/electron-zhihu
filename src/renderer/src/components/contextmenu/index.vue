<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  menu: Object
})
const showMenu = ref(false)

// 初始化右击事件
const initContextMenuEvent = function () {
  console.log(props.menu)
  props.menu.addEventListener('contextmenu', (e) => {
    // 取消默认的浏览器自带右键，很重要！
    e.preventDefault()
    console.log(e)
    showMenu.value = true
  })
}

watch(
  () => props.menu,
  (newVal, oldVal) => {
    if (newVal) {
      initContextMenuEvent()
    }
  }
)
</script>

<template>
  <div v-show="showMenu">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>6</li>
    <li>4</li>
    <li>5</li>
  </div>
</template>

<style scoped lang="scss"></style>
