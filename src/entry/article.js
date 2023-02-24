import { createApp } from "vue"
import youloge from 'youloge'
import Article from '../components/article.vue'

createApp(Article).use(youloge,{
  // 配置参数 s
  APIURL:'//api.youloge.com',
  VIPURL:'//vip.youloge.com',
  fontsize:'12px'
}).mount('#app')
