import vue from '@vitejs/plugin-vue'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

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
    plugins: [vue()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          loading: resolve(__dirname, 'src/renderer/loading.html')
        }
      }
    }
  }
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://www.zhihu.com/api/v3',
  //       changeOrigin: true,
  //       rewrite: (path) => {
  //         return path.replace(/^\/api/, '')
  //       }
  //     }
  //   }
  // }
})
