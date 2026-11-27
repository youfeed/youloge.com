import "./style.css";
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
const storage = {
  APIKEY:'9999-9d20755cecabb3b8a4d48c3f6986e091',
  NOTIFY:'https://www.youloge.com',
  APIURL:'https://api.youloge.com',
  VIPURL:'https://www.youloge.com',
}
sessionStorage.setItem('youloge',JSON.stringify(storage))
// 
const app = createApp(App), pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount('#app')