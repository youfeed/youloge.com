<template>
  <header class="fixed h-12 w-full bg-gray-100 border-b border-gray-200">
    <div class="flex h-full items-center justify-between px-3">
      <div class="flex items-center " @click="toggleSidebar">
        <button  class="flex items-center px-2 py-1 text-gray-900 rounded-lg border-0 hover:bg-gray-300">
          <img src="/loge.svg" alt="" class="w-5 h-5">
          <div class="font-bold text-gray-900 pl-1">Youloge</div>
        </button>
      </div>
      <div>
        <a-dropdown>
          <a-avatar :image-url="useImage(stateProfile.avatar,'80')" :size="35"></a-avatar>
          <template #content>
            <a-doption>
              <div>
                <div>{{ stateProfile.name }}<span class="font-2 ">@({{ stateProfile.user }})</span></div>
                <div>{{ stateProfile.mail }}</div>
              </div>
            </a-doption>
            <a-doption @click="onLogout">
              <span class="i-tdesign:logout"></span>
              退出登录  
            </a-doption>
          </template>
        </a-dropdown>
      </div>
    </div>
  </header>
  <aside
      class="sidebar fixed inset-y-0 left-0 top-12 z-20 flex w-32 flex-col items-start justify-between overflow-y-auto pt-4 pb-4 transition-transform duration-200 ease-in-out bg-gray-100 border-r border-gray-200"
      :class="sidebarCollapsed ? '-translate-x-full' : ''"
    >
      <div class="flex-1 mb-2 relative w-full">
        <div>
          <div v-for="item in menuItems" :key="item.title" class="menu-item relative">
            <div
              v-ripple
              class="cursor-pointer inline-flex w-full items-center p-2 text-sm select-none text-gray-900 rounded-lg hover:bg-gray-200 group"
              @click="toggleSubMenu(item)"
              :class="{ 'bg-gray-200 font-bold': current.startsWith(item.name) }">
              <div class="ml-2"><span :class="`i-${item.icon}`"></span>{{ item.title }}</div>
              <svg v-if="item.children" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-auto" :class="{'rotate-270':item.subExpand}" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </div>
            <!-- 如果有子菜单 -->
            <transition name="slide-fade">
              <div v-if="item.subExpand" class="submenu py-2 space-y-2">
                <div v-for="subItem in item.children" :key="subItem.title" class="px-3">
                  <div v-ripple @click="navigateTo(subItem.name)" class="block p-2 text-sm text-gray-700 rounded-lg cursor-pointer  hover:bg-gray-200" :class="{ 'bg-gray-200 font-bold': current === subItem.name }">
                    {{ subItem.title }}
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 w-full">
          <div v-ripple class="cursor-pointer inline-flex w-full items-center p-2 text-sm select-none text-gray-900 rounded-lg hover:bg-gray-200 group">
            <div class="ml-2" @click="navigateTo('logout')"><span class="i-tdesign:login"></span>退出登录</div>
          </div>
        </div>
      </div>
  </aside>
  <main class="fixed w-full h-full overflow-y-auto transition-transform duration-200 ease-in-out mt-12 pt-5 bg-gray-50" :class="sidebarCollapsed ? 'lg:pl16' : 'md:pl-37'" @click="closeSidebar">
    <transition mode="out-in">
      <keep-alive max="100">
        <component :is="currentComponent" :params="currentParams" @jump="navigateTo"></component>
      </keep-alive>
    </transition>
  </main>
</template>
<script setup>

const components = {};
const modules = import.meta.glob('@/console/*.vue');
Object.entries(modules).forEach(([path, module]) => {
	let name = path.replace('/src/console/','').replace('.vue','').toLowerCase();
	components[name] = defineAsyncComponent(module);
})
console.log('components',components)
// 
const stateMenu = storeMenu()//,{} = storeToRefs(stateMenu);
const stateProfile = storeProfile()//,{} = storeToRefs(stateProfile);
const state = reactive({
  profile:{},menuItems:[],sidebarCollapsed:false,current:''
}),{profile,current,menuItems,sidebarCollapsed} = toRefs(state);
// 动态路由
const currentParams = shallowRef({});
const currentComponent = shallowRef(components['index']);
// 展开收缩菜单
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};
// 关闭收缩菜单
const closeSidebar = () => {
  console.log('closeSidebar')
  sidebarCollapsed.value = true;
};
// 展开收缩子菜单
const toggleSubMenu = (item) => {
  item.children && (item.subExpand =!item.subExpand);
  item.children || navigateTo(item.name);
};
// emit 事件
const navigateTo = (name,params={})=>{
  if(name in components){
    state.current = name;
    currentComponent.value = components[name];
    currentParams.value = params;
  }
  console.log('navigateTo: console/',name,state.current,params)
}
// 退出登录
const onLogout = ()=>{
  stateProfile.logout();
  stateMenu.change()
  // navigateTo('login');
}
//
onMounted(()=>{
  state.menuItems = useMenu;
  state.profile = useAuth();
  console.log('useMenu',useMenu)
  console.log('storeProfile',stateProfile)
  console.log('storeMenu',stateMenu)
});
</script>

<style>

</style>