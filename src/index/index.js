import { createApp } from 'vue'
import App from './index.vue'
import youloge from "youloge"

createApp(App).use(youloge,{
  ukey:'jWm6lKGBL6fOZ-eK9qzcPKpeC8j9qrHCMoFn9ZOx1H1OQDIV2yhDbUlg3gshuRWd-bJYUtIWl6BMHoOe-b5qRg',
  APIURL:'https://api.youloge.com',
  VIPURL:'https://www.youloge.com',
  fontsize:'12px'
}).mount('#app')
