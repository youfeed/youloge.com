import { defineConfig,presetUno,presetTypography,presetAttributify,presetIcons } from 'unocss'

export default defineConfig({
  presets:[
    presetUno(),
    presetAttributify(),
    // presetTypography(),
    presetIcons({
      autoInstall: false,
      cdn: 'https://esm.sh/',
      extraProperties:{
        'display': 'inline-block',
        'vertical-align':'text-bottom',
      },
    }),
  ],
  preflights:[{
    getCSS:()=>`
      a{
        text-decoration: unset !important;
        user-select:none;
        color: #24292e;
        transition: color 0.2s ease;
      }
      a:hover { 
        color: #0969da; 
      }
      *{
        box-sizing:border-box;
        padding:0;margin: 0;
      }
    `
  }]
})