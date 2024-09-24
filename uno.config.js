import { defineConfig,presetUno,presetMini,presetTypography,presetAttributify,presetIcons } from 'unocss'

export default defineConfig({
  presets:[
    // presetMini(),
    presetUno(),
    presetAttributify(),
    presetTypography(),
    presetIcons({
      autoInstall: false,
      cdn: 'https://esm.sh/',
    //   collections:{
    //     mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
    //   }
    })
  ]
})