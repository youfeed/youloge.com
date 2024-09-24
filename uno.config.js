import { defineConfig,presetUno,presetMini,presetAttributify,presetIcons } from 'unocss'

export default defineConfig({
  presets:[
    presetMini(),
    presetUno(),
    presetAttributify(),
    // presetIcons(),
    presetIcons({
    //   autoInstall: false,
      // cdn: 'https://esm.sh/',
    //   collections:{
    //     mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
    //   }
    })
  ]
})