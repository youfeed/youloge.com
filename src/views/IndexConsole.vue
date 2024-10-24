<template>
  <header></header>
  <nav class="sidebar">
    <ul>
      <li v-for="item in menuItems" :key="item.title">
        <router-link :to="item.path">{{ item.title }}</router-link>
        <!-- 如果有子菜单 -->
        <ul v-if="item.children" class="submenu">
          <li v-for="subItem in item.children" :key="subItem.title">
            <router-link :to="subItem.path">{{ subItem.title }}</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
  <main class="flex-auto col-md-8 col-lg-8 px-3 px-sm-3 px-md-0">
    <div>
      <div class="flex items-center justify-center h-screen-sm">
        <div class="font-size-2xl  w-40 h-40 color-gray-400">xxx</div>
      </div>
    </div>
  </main>
  <aside></aside>
</template>
<script setup>
const state = reactive({
  menuItems:[]
}),{menuItems} = toRefs(state);
//

onMounted(()=>{
  state.menuItems = iniMenu;

  console.log('iniMenu',iniMenu)

  // usePlus('captcha',{}).then(res=>{
  //   console.log('then',res)
  // }).catch(err=>{
  //   console.log('catch',err)
  // })
  // console.log('useAuth',useAuth())
  
});
</script>

<style>

</style>