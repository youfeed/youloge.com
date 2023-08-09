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
      // input:'article.html',
      // input:'drive.html',
      // input:'index.html',
      // input:'sso.html',
      // input:'pay.html',
      input:'payment.html',
      // input:'discuss.html',
      // input:'video.html',

      // input:{
      //   index: 'index.html',
      //   document: 'document.html',
      //   article: 'article.html',
      //   sso: 'sso.html',
      //   pay: 'pay.html',
      // },
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
