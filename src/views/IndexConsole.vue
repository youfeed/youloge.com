<template>
  <header @click="onSwitch('index')">xxx</header>

  <nav class="sidebar fixed inset-y-0 left-0 z-20 flex w-32 flex-col items-start gap-2 overflow-y-auto pt-4 pb-4 transition-transform duration-200 ease-in-out bg-gray-100 border-r border-gray-200">
    <details v-for="item in menuItems" :key="item.title" class="menu-item" :open="Boolean(item.children)">
		<summary >{{ item.title }}</summary>
		<content v-for="subItem in item.children" :key="subItem.title">
			<div @click="onSwitch(subItem.name)" class="menu-item">{{ subItem.title }}</div>
		</content>
	</details>
  </nav>
  <main class="flex-auto col-md-8 col-lg-8 px-3 px-sm-3 px-md-0">
    <div>
      <div class="flex items-center justify-center h-screen-sm">
        <div class="font-size-2xl  w-40 h-40 color-gray-400">
			<transition name="fade">
				<keep-alive>
					<component :is="currentComponent"></component>
				</keep-alive>
			</transition>
        </div>
      </div>
    </div>
  </main>
  <aside></aside>
</template>
<script setup>
const components = {};
const modules = import.meta.glob('@/console/*.vue');
Object.entries(modules).forEach(([path, module]) => {
	let name = path.replace('/src/console/','').replace('.vue','').toLowerCase();
	components[name] = defineAsyncComponent(module);
})
console.log('components',components)

console.log('modules',modules)

const state = reactive({
  menuItems:[],
  current:'home',
  components:components,
}),{menuItems} = toRefs(state);
// 动态路由

const currentComponent = computed(() => {
	let {current,components} = state;
	return components[current];
});
const onSwitch = (name)=>{
	console.log('name',name)
  state.current = name;
}
//
onMounted(()=>{
  state.menuItems = iniMenu;
  console.log('iniMenu',iniMenu)
});
</script>

<style>
::marker {
    font-size: 0;
}
details{
	width: 100%;
	padding: 5px;
}
summary {
	display: flex;
    user-select: none;
    width: 100%;
    align-items: center;
    justify-content: flex-start;
    padding: 5px;
}
summary::after {

}
[open] summary,summary:hover {
    background-color: #fff;width: 100%;
    color: #00aae7;
}
[open] summary::after {
    
}
[open] summary::before {
 
}
</style>