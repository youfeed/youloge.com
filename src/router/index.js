import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/views/Index.vue'
import NotFound from '@/views/NotFound.vue'
import User from '@/views/User.vue'
import UserIndex from '@/views/UserIndex.vue'
import UserProfile from '@/views/UserProfile.vue'
import Article from '@/views/Article.vue'
import ArticlePreview from '@/views/ArticlePreview.vue'
import Drive from '@/views/Drive.vue'
import DrivePreview from '@/views/DrivePreview.vue'
import Video from '@/views/Video.vue'
import VideoWatch from '@/views/VideoWatch.vue'
const routes = [
  {
    path: '/',
    component: Index
  },{
    path: '/article',
    component: Article,
    children:[
      {
        path: ':uuid',
        component: ArticlePreview,
      }
    ]
  },{
    path: '/video',
    component: Video,
    children:[
      {
        path: ':uuid',
        component: VideoWatch,
      }
    ]
  },{
    path: '/drive',
    component: Drive,
    children:[
      {
        path: ':uuid',
        component: DrivePreview,
      }
    ]
  },{
    path: '/:user',
    component: User,
    children:[
      {
        path: 'index',
        component: UserIndex,
      },{
        path: 'profile',
        component: UserProfile,
      }
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
  router.beforeEach((to, from, next) => {
    // console.log(to, from)
    // whitelist.includes(to.name) || useAuth() ? next() : next({ name: 'login' });
    next();
  })
  app.use(router)
}
export default router