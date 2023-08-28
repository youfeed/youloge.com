import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  build:{
    cssCodeSplit:false,
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
