<script setup>
import { debounce } from 'lodash'
import { question } from './text'
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

  const res = await window.api.http.getRecommend(params)
  const obj = JSON.parse(res)
  // 过滤掉不是正常问题的答案
  obj.data = obj.data.filter((item) => {
    return item.target.question
  })
  bodyList.value = [...bodyList.value, ...obj.data]
  console.log(bodyList.value)
}

const getRecommendTest = async function () {
  const obj = question
  bodyList.value = obj
  console.log(obj)
}

// 定义处理滚动事件的函数
const handleScroll = ({ target }) => {
  if (target.scrollTop + target.clientHeight >= target.scrollHeight * 0.8) {
    page.value.pageNumber++
    getRecommend()
  }
}

// 前往文章页
const goPage = function (item) {
  console.log(item)
}

getRecommendTest()
// getRecommend()

onMounted(() => {
  const scroll = document.getElementsByClassName('n-scrollbar-container')[0]
  scroll.addEventListener('scroll', debounce(handleScroll, 200))
})
</script>

<template>
  <div class="background">
    <n-scrollbar>
      <div class="container">
        <div v-for="(item, index) of bodyList" :key="index" class="list-item" @click="goPage(item)">
          <div class="title">{{ item.target.question.title }}</div>
          <div class="article">
            <div v-if="item.target.thumbnail" class="left">
              <n-image class="img" :src="item.target.thumbnail" />
            </div>

            <div v-if="item.target.thumbnail" class="space"></div>

            <div class="right">
              <div class="author">{{ item.target.author.name }}：</div>
              <div>
                <span> {{ item.target.excerpt_new }} </span>
              </div>
              <div>
                <span> </span>
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
          :deep(.n-image img) {
            width: 100%;
            height: 100%;
          }
        }

        .space {
          width: 70px;
        }

        .right {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
