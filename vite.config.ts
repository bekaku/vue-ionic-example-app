import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true
      },
      template: {
        compilerOptions: {
          // isCustomElement: (tag) => tag.startsWith('swiper-'),
          isCustomElement: (tag) =>
            ['swiper-container', 'swiper-slide'].includes(tag),
        },
      },
    }),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // server: {
  //   watch: {
  //     usePolling: true
  //   }
  // }
  // test: {
  //   globals: true,
  //   environment: 'jsdom'
  // }
})
