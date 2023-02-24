import { createApp } from "vue"
import Index from '../components/index.vue'
import youloge from "youloge"

createApp(Index).use(youloge,{
  APIURL:'//api.youloge.com',
  VIPURL:'//vip.youloge.com',
  fontsize:'12px'
}).mount('#app')
