import { resolve } from 'path'
import http from 'http'
import httpProxy from 'http-proxy'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

// 创建一个代理服务器
const proxy = httpProxy.createProxyServer({})

// // 监听 error 事件，防止代理服务器崩溃
// proxy.on('error', (err, req, res) => {
//   res.writeHead(500, {
//     'Content-Type': 'text/plain'
//   })
//   res.end('Something went wrong.')
// })

// // 创建一个 HTTP 服务器
// const server = http.createServer((req, res) => {
//   console.log(req.url)
//   // 如果请求的 URL 以 /api/zhihu/ 开头
//   if (req.url.startsWith('/api/zhihu/')) {
//     // 修改请求的 URL，将 /api/zhihu/ 替换为 https://www.zhihu.com/api/v3
//     req.url = req.url.replace('/api/zhihu/', 'https://www.zhihu.com/api/v3')
//     // 使用代理服务器转发请求
//     proxy.web(req, res, { target: req.url })
//   } else {
//     // 如果请求的 URL 不符合条件，返回 404 错误
//     res.writeHead(404)
//     res.end()
//   }
// })

// 监听本地的 5173 端口
// server.listen(5173)

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()]
  },
  server: {
    proxy: {
      '^/api/zhihu/.*': {
        target: 'https://www.zhihu.com/api/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/zhihu/, '')
      }
    }
  }
})
