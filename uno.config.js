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
      extraProperties:{
        'display': 'inline-block',
        'vertical-align':'middle',
      },
    }),
  ],
  preflights:[{
    getCSS:()=>`
      a{text-decoration: none;}
      *{box-sizing:border-box;padding:0;margin: 0;}
    `
  }]
})