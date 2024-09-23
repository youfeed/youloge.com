import { createRouter, createWebHistory } from 'vue-router'

import NotFound from '@/views/NotFound.vue'
import Index from '@/views/Index.vue'
import User from '@/views/User.vue'
import UserIndex from '@/views/UserIndex.vue'
import UserProfile from '@/views/UserProfile.vue'
import UserArticle from '@/views/UserArticle.vue'

import Article from '@/views/Article.vue'
import ArticlePreview from '@/views/ArticlePreview.vue'
import Drive from '@/views/Drive.vue'
import DrivePreview from '@/views/DrivePreview.vue'
import Video from '@/views/Video.vue'
import VideoWatch from '@/views/VideoWatch.vue'
const routes = [
  {
    path: '/',
    component: Index,
    beforeEnter: (to, from) => {
      console.log('/',to, from)

    }
  },{
    path: '/article',
    component: Article,
    children:[
      {
        path: '',
        component: ArticlePreview,
      },{
        path: ':uuid',
        component: ArticlePreview,
      }
    ]
  },{
    path: '/video',
    component: Video,
    children:[
      {
        path: '',
        component: VideoWatch,
      },{
        path: ':uuid',
        component: VideoWatch,
      }
    ]
  },{
    path: '/drive',
    component: Drive,
    children:[
      {
        path: '',
        component: DrivePreview,
      },{
        path: ':uuid',
        component: DrivePreview,
      }
    ]
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
      },
    ]
  },{
    path: '/:pathMatch(.*)',
    component: NotFound
  }
];
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