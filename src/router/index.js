import { createRouter, createWebHistory } from 'vue-router'

import NotFound from '@/views/NotFound.vue'
import Index from '@/views/Index.vue'

import User from '@/views/User.vue'
import UserIndex from '@/views/UserIndex.vue'
import UserProfile from '@/views/UserProfile.vue'
import UserArticle from '@/views/UserArticle.vue'
import UserMessage from '@/views/UserMessage.vue'

import Article from '@/views/Article.vue'
import ArticleIndex from '@/views/ArticleIndex.vue'
import ArticleSearch from '@/views/ArticleSearch.vue'
import ArticlePreview from '@/views/ArticlePreview.vue'
// import ArticleDraft from '@/views/ArticleDraft.vue' // 编辑草稿

import Drive from '@/views/Drive.vue'
import DriveIndex from '@/views/DriveIndex.vue'
import DriveSearch from '@/views/DriveSearch.vue'
import DrivePreview from '@/views/DrivePreview.vue'

import Video from '@/views/Video.vue'
import VideoIndex from '@/views/VideoIndex.vue'
import VideoSearch from '@/views/VideoSearch.vue'
import VideoWatch from '@/views/VideoWatch.vue'

const routes = [
  {
    path: '/',
    component: Index,
    beforeEnter: (to, from) => {}
  },{
    path: '/video',
    component: Video,
    children:[
      {
        path: '',
        component: VideoIndex,
      },{
        path: 'search',
        component: VideoSearch,
      },{
        path: ':uuid',
        component: VideoWatch,
      }
      
    ]
  },{
    path: '/article',
    component: Article,
    children:[
      {
        path: '',
        component: ArticleIndex,
      },{
        path: 'search',
        component: ArticleSearch,
      },{
        path: ':uuid',
        component: ArticlePreview,
      }
    ]
  },{
    path: '/drive',
    component: Drive,
    children:[
      {
        path: '',
        component: DriveIndex,
      },{
        path: 'search',
        component: DriveSearch,
      },{
        path: ':uuid',
        component: DrivePreview,
      }
    ]
  },{
    path:'/-',
    component: Index,
  },{
    path: '/:user',
    component: User,
    children:[
      {
        path: '',
        component: UserIndex,
      },{
        path: 'article',
        component: UserArticle,
      },{
        path: 'profile',
        component: UserProfile,
      },{
        path: 'message',
        component: UserMessage,
      },{
        path: 'message',
        component: UserProfile,
      },
    ]
  },{
    path: '/:pathMatch(.*)',
    component: NotFound
  }
];
// console.log('init-routes',routes)
const router = createRouter({
  history:createWebHistory(),
  strict:true,
  routes:routes,
  scrollBehavior:()=>({left:0,top:0})
})
export const resetRouter = (app) => {
  router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next()
  })
}
export const setupRouter = (app) => {
  // 未登录 加载不同的路由
  router.beforeEach((to, from, next) => {
    // console.log(to, from)
    // whitelist.includes(to.name) || useAuth() ? next() : next({ name: 'login' });
    next();
  })
  app.use(router)
}
export default router