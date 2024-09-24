import UnoCSS from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { copyFile } from './vite.build.js'
import { viteExternalsPlugin } from 'vite-plugin-externals'
// const UnoCSS = (await import('unocss/vite')).default;
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    viteExternalsPlugin({
      vue: 'Vue'
    }),
    copyFile({
      targets:[
        {
          src:'dist/index.html',
          dest:'dist/404.html'
        }
      ]
    })
  ],
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