import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import {resolve} from 'path'
export default defineConfig({
  plugins: [vue(),UnoCSS(),viteExternalsPlugin({
    vue: 'Vue'
  })],
  build:{
    cssCodeSplit:false,
    modulePreload:{ polyfill:false },
    rollupOptions: {
      // external: ['vue','youloge'],
      // input:{
      //   index: 'index.html',
      //   drive: 'drive.html',
      //   article: 'article.html'
      // },
      // output:{
      //   globals: {
      //     vue: 'Vue',
      //     'youloge':'youloge'
      //   },
      // }
    }
  },
  resolve:{
    alias:{
      '@':resolve(__dirname, './src')
    }
  }
})
