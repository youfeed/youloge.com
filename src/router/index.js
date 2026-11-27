import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent, defineComponent, computed, h } from 'vue'

// 视图懒加载:pages 公共页面 + views 登录后页面统一收集
const pages = import.meta.glob('/src/pages/*.vue')
const views = import.meta.glob('/src/views/*.vue')
const page = (name) => pages[`/src/pages/${name}.vue`]
const view = (name) => views[`/src/views/${name}.vue`]

// 首页:未登录展示公共 Index,已登录展示 Home
const IndexHome = defineComponent({
  setup() {
    const profile = storeProfile()
    const isLogin = computed(() => Boolean(profile.uuid))
    const Index = defineAsyncComponent(page('Index'))
    const Home = defineAsyncComponent(view('Home'))
    return () => h(isLogin.value ? Home : Index)
  },
})

const routes = [
  { path: '/', component: IndexHome },
  { path: '/about', component: page('About'), meta: { title: '关于我们 - Youloge.com' } },
  // 公共列表页:由 pages 承载,搜索作为 query 参数(?q=)由页面内部处理
  { path: '/feed', component: page('Feed') },
  { path: '/video', component: page('Video') },
  { path: '/article', component: page('Article') },
  { path: '/drive', component: page('Drive') },
  { path: '/goods', component: page('Goods') },
  { path: '/risk', component: view('RiskIndex') },
  { path: '/risk/history', component: view('RiskHistory') },
  { path: '/risk/:uuid', component: view('RiskProcess') },
  // 布局侧栏入口:登录后页面(复用现有视图)
  { path: '/history', component: view('RiskHistory') },
  { path: '/chat', component: view('Message') },
  { path: '/profile', component: view('Home') },
  { path: '/setting', component: view('Setting'), meta: { title: '账户设置 - Youloge.com' } },
  { path: '/apikey', component: view('Apikey'), meta: { title: '开发密钥 - Youloge.com' } },
  { path: '/wallet', component: view('Wallet'), meta: { title: '我的钱包 - Youloge.com' } },
  { path: '/mail', component: view('Mail') },
  { path: '/billing', component: view('Billing'), meta: { title: '消费账单 - Youloge.com' } },
  // 个人主页
  { path: '/:user', component: view('UserIndex'), children: [
    { path: 'article', component: view('UserArticle') },
    { path: 'profile', component: view('UserProfile') },
    { path: 'message', component: view('UserMessage') },
  ] },
  // 详情页(Twitter 模式):贴文 / 视频
  { path: '/:user/feed/:uuid', component: view('ArticlePreview') },
  // 图片预览:与详情页共用组件,路由切换时复用实例不重载,详情页保持在底层弹窗展示
  { path: '/:user/feed/:uuid/image/:id', component: view('FeedPreview'), meta: { title: '图片预览 - Youloge.com' } },
  { path: '/:user/video/:uuid', component: view('VideoWatch') },
  { path: '/:user/drive/:uuid', component: view('DrivePreview') },
  { path: '/:user/goods/:uuid', component: view('GoodsPreview') },
  { path: '/:pathMatch(.*)', component: view('NotFound') },
]

const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 进度条 + 页面标题
router.beforeEach((to) => {
  useProgress.start();
  document.title = to.meta.title ?? 'Youloge.com';
});
router.afterEach(() => useProgress.done());
router.onError((err) => {
  console.error('路由加载异常：', err);
  useProgress.error();
});

export default router
