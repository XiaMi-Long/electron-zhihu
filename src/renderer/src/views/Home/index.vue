<script setup>
import { ref, onMounted } from 'vue'
import { useLoginStore } from '@renderer/paina/login'

const page = ref({
  pageNumber: 2
})
const bodyList = ref([])

const loginStore = useLoginStore()

// window.api.store.del(loginStore.localCacheKey)
// 获取推荐文章
const getRecommend = async function () {
  const params = {
    action: 'down',
    ad_interval: -10,
    after_id: 5,
    desktop: true,
    page_number: page.value.pageNumber,
    session_token: loginStore.acc_token
  }

  // const res = await window.api.http.getRecommend(params)
  const obj = JSON.parse(res)
  bodyList.value = obj.data
  console.log(JSON.stringify(bodyList.value))
}
getRecommend()
</script>

<template>
  <div class="background">
    <n-scrollbar>
      <div class="container">
        <div v-for="(item, index) of bodyList" :key="index" class="list-item">
          <div class="title">{{ item.target.question.title }}</div>
          <div class="article">
            <div class="left">
              <n-image class="img" src="src/assets/image/1.jpg" />
            </div>

            <div class="right">
              <div>
                <span> {{ item.target.question.title }} </span>
              </div>
              <div>
                <span>
                  globalShortcut 模块可以在操作系统中注册/注销全局快捷键,
                  以便可以为操作定制各种快捷键。 注意: 快捷方式是全局的; 即使应用程序没有键盘焦点,
                  它也仍然在持续监听键盘事件。 在 app 模块的 ready 事件就绪之前，这个模块不能使用。
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.background {
  width: 100%;
  height: 100%;

  background-color: #f6f6f6;

  overflow: auto;
  .container {
    display: flex;
    flex-direction: column;

    height: 100%;

    padding: 50px 50px 0 50px;

    .list-item {
      box-sizing: border-box;

      width: 100%;
      min-height: 150px;

      background-color: #ffffff;

      border-bottom: 1px solid #f6f4f4;

      padding: 10px 20px 20px 20px;

      .title {
        font-weight: bold;
      }

      .article {
        display: flex;

        margin-top: 10px;

        .left {
          width: 20%;

          :deep(.n-image img) {
            width: 100%;
            height: 100%;
          }
        }

        .right {
          width: 80%;

          font-size: 12px;

          padding-left: 10px;
        }
      }
    }
  }
}
</style>
