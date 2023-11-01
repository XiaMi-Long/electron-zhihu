<script setup>
import { debounce } from 'lodash'
import { question } from './test'
import { useDialog } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from 'naive-ui'
import { useLoginStore } from '@renderer/pinia/login'
import fixedMenu from '@renderer/components/fixed-menu/index.vue'

const page = ref({
  pageNumber: 2
})
const bodyList = ref([])
const router = useRouter()
const dialog = useDialog()

const loginStore = useLoginStore()
const notification = useNotification()

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
  window.localStorage.setItem('article-detail', JSON.stringify(item))
  router.push(`/detail/${item.target.id}/question/${item.target.question.id}`)
}

// 添加全局图片预览事件
window.previewPhoto = function (event) {
  var img = document.createElement('img')
  img.src = event.target.src
  const viewer = new window.Viewer(img, {
    hidden: function () {
      const viewerContainer = document.querySelector('.viewer-container')
      if (viewerContainer) {
        viewerContainer.parentNode.removeChild(viewerContainer)
      }
    }
  })
  viewer.show()
}

// 添加全局拦截的网页跳转
window.interceptHref = function (event) {
  const href = event.currentTarget.href
  event.preventDefault()
  dialog.warning({
    title: '提 示',
    content: '你正在准备跳转网页，链接会在你默认浏览器打开',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      window.api.shell.openExternal(href)
    },
    onNegativeClick: () => {}
  })
}

// 检测更新
window.api.app.onAppCheckingForUpdate(() => {
  notification.info({
    content: '正在检测是否有更新.....',
    closable: false
  })
})

// 检测更新
window.api.app.onAppUpdateNotAvailable(() => {
  notification.destroyAll()
  notification.info({
    content: '当前已是最新版本',
    closable: false
  })

  setTimeout(() => {
    notification.destroyAll()
  }, 4000)
})

window.api.app.onAppUpdateError(() => {
  notification.destroyAll()
  notification.error({
    content: '更新失败，出现未知问题',
    closable: false
  })

  setTimeout(() => {
    notification.destroyAll()
  }, 4000)
})

window.api.app.onAppUpdateAvailable(() => {
  notification.destroyAll()
  notification.info({
    content: '发现新版本，开始下载更新.....',
    closable: false
  })
})

window.api.app.onAppUpdateDownloaded((event) => {
  notification.destroyAll()

  dialog.warning({
    title: '提 示',
    content: '更新下载完成，是否要重启安装应用',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      event.sender.send('install-app')
    },
    onNegativeClick: () => {}
  })
})

onMounted(() => {
  // getRecommendTest()
  getRecommend()
  const scroll = document.getElementsByClassName('n-scrollbar-container')[0]
  scroll.addEventListener('scroll', debounce(handleScroll, 200))
})
</script>
<script>
export default {
  name: 'Home'
}
</script>

<template>
  <div class="background">
    <n-scrollbar>
      <div class="container">
        <div v-for="(item, index) of bodyList" :key="index" class="list-item">
          <div class="title">{{ item.target.question.title }}</div>

          <div class="article">
            <div v-if="item.target.thumbnail" class="left">
              <n-image class="img" :src="item.target.thumbnail" />
            </div>

            <div v-if="item.target.thumbnail" class="space"></div>

            <div class="right" @click="goPage(item)">
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

    <fixedMenu :data="['token', 'config']" />
  </div>
</template>

<style scoped lang="scss">
.background {
  width: 100vw;
  height: 100vh;

  background-color: var(--a-back);

  .container {
    display: flex;
    flex-direction: column;

    height: 100%;

    padding: 50px 50px 0 50px;

    .list-item {
      box-sizing: border-box;

      width: 100%;
      min-height: 150px;

      background-color: var(--b-back);

      border-bottom: 1px solid var(--border-bottom-color);

      padding: 10px 20px 20px 20px;

      .title {
        font-weight: bold;

        color: var(--title-color);
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

          color: var(--title-answer-text);
        }
      }
    }
  }
}
</style>
