import 'virtual:uno.css'
import 'virtual:unocss-devtools'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupRouter } from './router'

const storage = {
  // APIKEY:'n8ABGn5_bZcVGnm2-J6mbhSLFeiXCxvB4cKo0ow9NixmPVTVfMLX5kIpF4xlFdnQVqLiLGJtxPAJbjRyRFKsnyFChssy-HBlmYqjZXkrq6oVxPKWUm3QchVYY7TTd8qo',
  APIKEY:'MdVdkD8m1WcMsoUwCQwoAn1H3oP-1xhP8oYi28k53_q1uZh6Tl8fiPdGwKybAHBvxiOERjQHyU3AEWKxOtcnDcxJrFp-Zp2c61RkcdM9oanzh2A8gceb3TpBD_GpW3bQ',
  NOTIFY:'https://www.youloge.com',
  APIURL:'https://api.youloge.com',
  VIPURL:'https://www.youloge.com',
}
sessionStorage.setItem('youloge',JSON.stringify(storage))
// 
const components = {};
const asyncRoutes = [];
const modules = import.meta.glob('@/console/*.vue');
Object.entries(modules).forEach(([path, module]) => {
	let name = path.replace('/src/console/','').replace('.vue','').toLowerCase();
	components[name] = module;
  asyncRoutes.push({
    name:name,
    component:module
  });
	// components[name] = defineAsyncComponent(module);
});
console.log('组件注册2333：', asyncRoutes);
//
const app = createApp(App), pinia = createPinia();
app.use(pinia);
app.directive('dom', vDom);
app.directive('copy', vCopy);
app.directive('login', vLogin);
app.directive('ripple', vRipple);
setupRouter(app)
app.provide('getRoutes',asyncRoutes);
app.provide('aaa','123456');
app.mount('#app')