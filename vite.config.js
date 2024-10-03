import UnoCSS from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { copyFile } from './vite.build.js'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// import {VitePluginVueComponentsResolver} from 'unplugin-auto-import/resolvers'
import { viteExternalsPlugin } from 'vite-plugin-externals'
export default defineConfig({
  plugins: [
    UnoCSS(),
    vue(),
    viteExternalsPlugin({
      vue: 'Vue'
    }),
    AutoImport({
      imports:['vue','vue-router'],
      // dirs:['src/utils/'],
      dirs:['src/composables','src/directives'],
      extensions:['vue'],
      dts:'types/auto-imports.d.ts',
      vueTemplate:true
    }),
    Components({
      dts:'types/auto-components.d.ts',
      // resolvers:[VitePluginVueComponentsResolver],
      // dirs:[], 
      
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
    sourcemap: false,
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