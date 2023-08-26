import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
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
        entryFileNames:'assets/[name].js',
        chunkFileNames: 'assets/[name].chunk.js',
        assetFileNames:'assets/[name][extname]',
        format: 'umd',
        globals: {
          vue: 'Vue',
          'youloge':'youloge'
        },
        // inlineDynamicImports:true,
        // plugins: [
        //   {
        //     name: 'inline-css',
        //     options: {
        //       enabled: true
        //     }
        //   }
        // ]
      }
    }
  }
})
