import "./style.css";
// import 'virtual:uno.css'
// import 'virtual:unocss-devtools'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupRouter } from './router'

const storage = {
  APIKEY:'9999-9d20755cecabb3b8a4d48c3f6986e091',
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
console.log('组件注册', asyncRoutes);
//
const app = createApp(App), pinia = createPinia();
app.use(pinia);
app.directive('dom', vDom);
app.directive('copy', vCopy);
app.directive('check', vCheck);
app.directive('size', vSize);
app.directive('login', vLogin);
app.directive('ripple', vRipple);
setupRouter(app)
app.provide('getRoutes',asyncRoutes);
app.mount('#app')