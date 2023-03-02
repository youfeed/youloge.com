import { createApp } from "vue"
import Index from '../components/index.vue'
import youloge from "youloge"

createApp(Index).use(youloge,{
  ak:'j1KvLbGE6eK2bPQv9Zp1DdTgz8xHo',
  APIURL:'//api.youloge.com',
  VIPURL:'//vip.youloge.com',
  fontsize:'12px'
}).mount('#app')
