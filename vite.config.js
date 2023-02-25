import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build:{
    cssCodeSplit:false,
    modulePreload:{
      polyfill:false
    },
    rollupOptions: {
      external: ['vue','youloge'],
      // input:'article.html',
      // input:'document.html',
      // input:'index.html',
      input:{
        index: 'index.html',
        document: 'document.html',
        article: 'article.html',
      },
      output:{
        entryFileNames:'assets/[name].js',
        chunkFileNames: 'assets/[name].chunk.js',
        assetFileNames:'assets/[name][extname]',
        format: 'es',
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
