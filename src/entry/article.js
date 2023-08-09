import { createApp } from "vue"
import youloge from 'youloge'
import Article from '../components/article.vue'

createApp(Article).use(youloge,{
  // 配置参数 s
  ukey:'qRjE+HMLB8WcnAvdcon5Lx2BSGid7OdQUd5ozRV8QHj4sgP91+Y6xMfhrHZbONGpLErJGMZFZ8GAcEwINSE4VjwdEvna0DwHUJ3zzQNFlQg8s8nhqo4/I3y00q31eYi4',
  APIURL:'https://api.youloge.com',
  VIPURL:'https://vip.youloge.com',
  fontsize:'12px'
}).mount('#app')
