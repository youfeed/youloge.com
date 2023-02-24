import { createApp } from "vue"
import youloge from 'youloge'
import Document from '../components/document.vue'
createApp(Document).use(youloge,{
  // 配置参数 s
  APIURL:'//api.youloge.com',
  VIPURL:'//vip.youloge.com',
  fontsize:'12px'
}).mount('#app')
