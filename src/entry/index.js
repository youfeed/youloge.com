import { createApp } from "vue"
import Index from '../components/index.vue'
import youloge from "youloge"

createApp(Index).use(youloge,{
  ukey:'6FGakMxMJe1mBPs9pFD-Ixyxv3j__eo5vnu36jkILEwn6LnZ5QOXfNAlJ6EburKIxSKkB1O59FHJedrefDCSvw==',
  APIURL:'https://api.youloge.com',
  VIPURL:'https://vip.youloge.com',
  fontsize:'12px'
}).mount('#app')
