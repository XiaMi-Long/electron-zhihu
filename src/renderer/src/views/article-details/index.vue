<script setup>
import { useRoute } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import { useLoginStore } from '@renderer/paina/login'

const route = useRoute()
const answerList = ref([])
const answerTtile = ref('')
const loginStore = useLoginStore()
const isAddFirstArticleDetail = ref(true)

console.log(route.params)

const getArticleDetail = async function () {
  const { acc_cookie } = await window.api.store.get(loginStore.localCacheKey)
  const res = await window.api.http.getArticleDetails(
    route.params.questionId,
    {
      limit: 3,
      order: 'default',
      platform: 'desktop'
    },
    'z_c0=' + acc_cookie + ';'
  )
  const obj = JSON.parse(res)
  answerList.value = [...answerList.value, ...obj.data]

  // 获取存储,把上个爷们展示的数据放到第一个展示
  const articleDetail = window.localStorage.getItem('article-detail')
  if (articleDetail.length > 0 && isAddFirstArticleDetail) {
    const obj = JSON.parse(articleDetail)
    answerList.value = answerList.value.filter((item) => item.target.id !== obj.target.id)
    obj.target.excerpt = obj.target.content
    answerList.value.unshift(obj)
    isAddFirstArticleDetail.value = false
  }

  if (answerList.value.length > 0) {
    answerTtile.value = answerList.value[0].target.question.title
  }

  // 对每一项的回答图片做处理
  answerList.value.forEach((item) => {
    const regex = /<figure[^>]*>(.*?)<img src=\"(.*?)\"[^>]*>(.*?)<\/figure>/g
    const text = item.target.excerpt
    // 使用replace方法替换匹配到的内容
    const newText = text.replace(regex, function (match, p1, p2, p3) {
      return `<div data-v-0ef3d734="" class="img n-image" role="none"><img onclick="previewPhoto(event)" src="${p2}" loading="eager" data-error="false" data-preview-src="${p2}" data-group-id="" style="object-fit: fill;"><!----><!----></div>`
    })
    item.target.excerpt = newText
  })

  console.log(answerList.value)
}

onMounted(() => {
  getArticleDetail()
})

watch(
  () => route.params.questionId,
  () => {
    getArticleDetail()
  }
)
</script>

<template>
  <div class="background">
    <n-scrollbar>
      <div class="container">
        <div class="questionTitle">{{ answerTtile }}</div>
        <div v-for="(item, index) of answerList" :key="index" class="answer-list">
          <div class="answer" v-html="item.target.excerpt"></div>
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

    .questionTitle {
      font-style: italic;

      border-radius: 5px;

      background-color: #86c5a2;

      color: white;

      padding: 20px;
    }

    .answer-list {
      box-sizing: border-box;

      width: 100%;
      min-height: 150px;

      background-color: #ffffff;

      border-bottom: 1px solid #f6f4f4;

      padding: 10px 20px 20px 20px;
      border-bottom: 1px #8fa18f dashed;

      .answer {
      }
    }
  }
}
</style>
