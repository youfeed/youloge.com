import 'virtual:uno.css'
import 'virtual:unocss-devtools'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupRouter } from './router'

const storage = {
  APIKEY:'n8ABGn5_bZcVGnm2-J6mbhSLFeiXCxvB4cKo0ow9NixmPVTVfMLX5kIpF4xlFdnQVqLiLGJtxPAJbjRyRFKsnyFChssy-HBlmYqjZXkrq6oVxPKWUm3QchVYY7TTd8qo',
  NOTIFY:'https://www.youloge.com',
  APIURL:'https://api.youloge.com',
  VIPURL:'https://www.youloge.com',
}
sessionStorage.setItem('youloge',JSON.stringify(storage))
const app = createApp(App), pinia = createPinia();
app.use(pinia);
app.directive('login', vLogin);
app.directive('copy', vCopy);
app.directive('ripple', vRipple);
setupRouter(app)
app.mount('#app')
