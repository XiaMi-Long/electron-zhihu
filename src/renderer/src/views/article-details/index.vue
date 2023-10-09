<script setup>
import { debounce } from 'lodash'
import { useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import { ref, watch, onMounted, nextTick } from 'vue'
import { useLoginStore } from '@renderer/pinia/login'
import { asyncClipboardUtils } from 'async-clipboard-utils'
import fixedMenu from '@renderer/components/fixed-menu/index.vue'

const route = useRoute()
const answerList = ref([])
const answerTitle = ref('')
const message = useMessage()
const answerIsEnd = ref(false)
const interfaceParams = ref({
  answerSessionId: '',
  httpUrl: ''
})
const loginStore = useLoginStore()
const isAddFirstArticleDetail = ref(true)

console.log(route.params)

const getArticleDetail = async function () {
  let result = null
  const { acc_cookie } = await window.api.store.get(loginStore.localCacheKey)

  // 如果是第一次发送请求
  if (interfaceParams.value.answerSessionId.length === 0) {
    const res = await window.api.http.getArticleDetails(
      route.params.questionId,
      {
        offset: null,
        limit: 3,
        order: 'default',
        platform: 'desktop'
      },
      'z_c0=' + acc_cookie + ';'
    )
    result = JSON.parse(res)

    // 获取下次请求url和session
    interfaceParams.value.answerSessionId = result.session.id
    interfaceParams.value.httpUrl = result.paging.next
    answerList.value = [...answerList.value, ...result.data]

    // 获取存储,把上个页面展示的数据放到第一个展示
    const articleDetail = window.localStorage.getItem('article-detail')
    if (articleDetail.length > 0 && isAddFirstArticleDetail) {
      const obj = JSON.parse(articleDetail)
      answerList.value = answerList.value.filter((item) => item.target.id !== obj.target.id)
      obj.target.excerpt = obj.target.content
      answerList.value.unshift(obj)
      isAddFirstArticleDetail.value = false
    }

    nextTick(() => {
      const scroll = document.getElementsByClassName('n-scrollbar-container')[0]
      scroll.addEventListener('scroll', debounce(handleScroll, 1000))
    })
  } else {
    interfaceParams.value.answerSessionId.length > 0
    // 如果是获取剩余问题
    const res = await window.api.http.getArticleDetailsByPage(
      interfaceParams.value.httpUrl,
      'z_c0=' + acc_cookie + ';'
    )
    result = JSON.parse(res)

    //判断本次是否是最后一页
    if (result.paging.is_end === true) {
      answerIsEnd.value = true
    }
    // 获取下次请求url和session
    interfaceParams.value.answerSessionId = result.session.id
    interfaceParams.value.httpUrl = result.paging.next
    answerList.value = [...answerList.value, ...result.data]
  }

  if (answerList.value.length > 0) {
    answerTitle.value = answerList.value[0].target.question.title
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

  // 对文章代码片段进行处理
  document.querySelectorAll('.answer-list pre code').forEach((el) => {
    window.highlight.highlightElement(el)
  })

  createPreDocument()

  console.log(result)
}

// 生成代码区域生成copy等按钮
const createPreDocument = () => {
  const createFragment = (item) => {
    const fragment = new DocumentFragment()

    const copy = document.createElement('div')
    copy.setAttribute('class', 'copy-button pre-button')
    copy.innerText = 'Copy'

    // 复制代码区域的文字到剪贴板
    copy.addEventListener('click', function () {
      const code = item.querySelectorAll('code')
      if (code.length !== 1) {
        throw new Error('复制事件解析错误')
      }
      asyncClipboardUtils({
        type: 'write-text',
        text: code[0].innerText,
        clipboardItem: null,
        writeSuccess: function () {
          message.success('复制成功')
        },
        writeError: function () {
          message.error('复制失败')
        },
        error: function () {
          message.error('复制失败')
        }
      })
    })

    const full = document.createElement('div')
    full.setAttribute('class', 'full-button pre-button')
    full.innerText = 'FullScreen'

    // 改变css使其全屏
    full.addEventListener('click', function () {
      const code = item.getElementsByTagName('code')
      const buttonGroup = item.getElementsByClassName('pre-button-group')
      if (code.length === 1 && buttonGroup.length === 1) {
        code[0].classList.toggle('full-screen-code')
        buttonGroup[0].classList.toggle('full-screen-button-group')
      } else {
        throw new Error('全屏事件解析错误')
      }
    })

    const div = document.createElement('div')
    div.setAttribute('class', 'pre-button-group')
    div.appendChild(copy)
    div.appendChild(full)

    fragment.appendChild(div)
    return fragment
  }
  const pre = document.querySelectorAll('.answer-list pre')
  pre.forEach((item) => {
    item.appendChild(createFragment(item))
  })
}

// 定义处理滚动事件的函数
const handleScroll = ({ target }) => {
  // 如果到底部退出
  if (answerIsEnd.value) {
    return
  }

  if (target.scrollTop + target.clientHeight >= target.scrollHeight * 0.95) {
    getArticleDetail()
  }
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
        <div class="questionTitle">{{ answerTitle }}</div>
        <div v-for="(item, index) of answerList" :key="index" class="answer-list">
          <div class="answer" v-html="item.target.excerpt"></div>
        </div>
        <div v-if="answerIsEnd === false" class="answer-list loading">
          <div class="answer">
            <n-skeleton text :repeat="2" />
            <n-skeleton text style="width: 60%" />
          </div>
        </div>
      </div>
      <n-back-top :right="100" />
    </n-scrollbar>
    <fixedMenu />
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

    .loading {
      border-bottom: none;
    }
  }
}
</style>

<style lang="scss">
.answer-list pre {
  position: relative;

  &:hover .pre-button-group {
    opacity: 1;
  }
}
.pre-button-group {
  display: inline-block;

  position: absolute;

  top: 10px;
  right: 10px;

  color: white;

  opacity: 0;

  transition: opacity 1s;

  .pre-button {
    display: inline-block;

    min-width: 60px;

    text-align: center;

    cursor: pointer;

    &:hover {
      font-weight: bold;
    }
  }
}

.full-screen-code {
  position: fixed;

  width: 100vw;
  height: 100vh;

  left: 0;
  top: 0;

  z-index: 10;
}

.full-screen-button-group {
  position: fixed;

  z-index: 10;
}
</style>
