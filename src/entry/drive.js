import { createApp } from "vue"
import youloge from 'youloge'
import Drive from '../components/drive.vue'
createApp(Drive).use(youloge,{
  // 配置参数
  ukey:'6FGakMxMJe1mBPs9pFD-Ixyxv3j__eo5vnu36jkILEwn6LnZ5QOXfNAlJ6EburKIxSKkB1O59FHJedrefDCSvw==',
  APIURL:'https://api.youloge.com',
  VIPURL:'https://vip.youloge.com',
  fontsize:'12px'
}).mount('#app')
