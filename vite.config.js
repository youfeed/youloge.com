import UnoCSS from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { copyFile } from './vite.build.js'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { viteExternalsPlugin } from 'vite-plugin-externals'
export default defineConfig({
  plugins: [
    UnoCSS(),
    vue(),
    // viteExternalsPlugin({
    //   vue: 'Vue'
    // }),
    Components({
      dts:'types/auto-components.d.ts',
      dirs:['src/components'],
      directives: true,
      // extensions:['vue'],
    }),
    AutoImport({
      imports:['vue','vue-router',{
        'tinymce': [['default', 'tinymce']],
        'pako':[['default','pako']]
        // ['default as tinymce','init']
      }],
      dirs:['src/composables','src/directives'],
      dts:'types/auto-imports.d.ts',
      vueTemplate:true,
      eslintrc:{
        enabled:true,
        files:'src/**/*.vue',
        injectAutoImports:true,
        globalsPropValue:true,
        filepath: 'types/.eslintrc-auto-import.json',
      }
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
      output:{
        manualChunks: {
          vue:['vue','vue-router'],
          tinymce:['tinymce']
        }
      }
    }
  },
  resolve:{
    alias:{
      '@':resolve(__dirname, './src/'),
      '@components':resolve(__dirname, './src/components'),
    }
  }
})