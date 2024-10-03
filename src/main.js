import 'virtual:uno.css'
import 'virtual:unocss-devtools'

import App from './App.vue'
import { createApp } from 'vue'
import { setupRouter } from './router'

const storage = {
  APIKEY:'it-lk1ER3z-iVEDdHRtIxh-jwymtE65cfZwjh2OUOYbBg3E6Z54DILcVgfbi5KYyn5J0OVyCTReXCIaFtgGxdw',
  NOTIFY:'https://www.youloge.com',
  APIURL:'https://api.youloge.com',
  VIPURL:'https://www.youloge.com',
}
sessionStorage.setItem('youloge',JSON.stringify(storage))
const app = createApp(App)
setupRouter(app)
app.mount('#app')
