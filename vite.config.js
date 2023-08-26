import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  base:'/youloge.com/',
  plugins: [vue()],
  build:{
    cssCodeSplit:true,
    modulePreload:{ polyfill:false },
    rollupOptions: {
      external: ['vue','youloge'],
      input:{
        index: 'index.html',
        drive: 'drive.html',
        article: 'article.html'
      },
      output:{
        globals: {
          vue: 'Vue',
          'youloge':'youloge'
        },
      }
    }
  }
})
