import { createApp } from "vue"
import youloge from 'youloge'
import Document from '../components/document.vue'
createApp(Document).use(youloge,{
  // 配置参数 s
  ak:'j1KvLbGE6eK2bPQv9Zp1DdTgz8xHo',
  APIURL:'https://api.youloge.com',
  VIPURL:'https://vip.youloge.com',
  fontsize:'12px'
}).mount('#app')
