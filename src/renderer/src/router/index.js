import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    name: 'Login',
    path: '/',
    component: () => import('@renderer/views/Login/index.vue'),
    meta: {
      title: '登录',
      keepAlive: false
    }
    // children: [
    //   {
    //     name: 'Util',
    //     path: '/util',
    //     component: () => import('@renderer/components/util/index.vue'),
    //     meta: {
    //       title: '工具集',
    //       keepAlive: true
    //     }
    //   }
    // ]
  },
  {
    name: 'Home',
    path: '/home',
    component: () => import('@renderer/views/Home/index.vue'),
    meta: {
      title: '推荐',
      keepAlive: false
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/**
 * 获取所有需要缓存的路由name
 * @returns 需要缓存的路由name
 */
const getAllKeepAlive = function () {
  const result = []
  const stack = []
  routes.forEach((item) => {
    stack.push(item)
  })

  while (stack.length > 0) {
    const item = stack.pop()
    if (item.children) {
      item.children.forEach((item2) => {
        if (item2.meta.keepAlive) {
          result.push(item2.name)
        }
        if (item2.children) {
          stack.push(item2)
        }
      })
    }
  }

  return result
}

export { router, getAllKeepAlive }
