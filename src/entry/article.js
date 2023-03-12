import { createApp } from "vue"
import youloge from 'youloge'
import Article from '../components/article.vue'

createApp(Article).use(youloge,{
  // 配置参数 s
  ukey:'6FGakMxMJe1mBPs9pFD-Ixyxv3j__eo5vnu36jkILEwn6LnZ5QOXfNAlJ6EburKIxSKkB1O59FHJedrefDCSvw==',
  APIURL:'//api.youloge.com',
  VIPURL:'//vip.youloge.com',
  fontsize:'12px'
}).mount('#app')
