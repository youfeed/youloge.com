<template>
  <header class="h-14 px-2 flex  items-center sticky top-0 bg-[length:4px_4px]" style="backdrop-filter: saturate(50%) blur(4px);">
    <div class="w-full flex justify-between items-center h-10">
      <div class="left flex  items-center justify-start gap-2">
        <div class="flex justify-center items-center">
          <div class="hover:bg-blue-1 flex justify-between items-center rounded-full cursor-pointer w-8 h-8 p-1">
            <YouIcon name="tdesign:view-list" size="20" ></YouIcon>
          </div>
          <router-link to="/" class="color-dark-500 font-bold no-underline px-1 py-1 rounded hover:bg-light-500 ">
            <div class="flex items-center gap-1">
              <span>Youloge</span>
            </div>
          </router-link>
          <div class="text-sm text-gray-200">/</div>
          <router-link to="/drive" class="color-dark-500 no-underline font-bold px-1 py-1 rounded hover:bg-light-500 ">
            <div>Drive</div>
          </router-link>
        </div>
      </div>
      <div class="search hidden md:block">
        <div class="max-w-40">
          <form action="/drive/search" method="get" class="max-w-80">
            <input type="search" name="q" v-model="query.q" placeholder="搜索云盘资源" class="border rounded px-4 py-2 w-full"/>
          </form>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="hover:bg-gray-2  md:hidden rounded-full flex items-center justify-center p-1">
          <router-link to="/drive/search?q=*">
            <YouIcon name="mdi-light:magnify" size="24"></YouIcon>
          </router-link>
        </div>
        <div class="w-8 h-8">
          <div v-login="showProfile">
            <img :src="useImage(stateProfile.avatar,'80')" alt="" class="w-full h-full rounded-full">
          </div>
        </div>
      </div>
    </div>
  </header>
  <main class="drive">
    <router-view :key="$route.fullPath"></router-view>
  </main>
  <!-- 通用侧栏 -->
  <you-aside ref="aside"></you-aside>
  <you-profile ref="profile"></you-profile>
</template>

<script setup>
import { useTemplateRef } from 'vue';

const stateProfile = storeProfile();
const route = useRoute();
const asideRef = useTemplateRef('aside')
const profileRef = useTemplateRef('profile')

const state = reactive({
  err:0,msg:'',
  data:[], 
  query:{}
}),{query} = toRefs(state);

const showProfile = ()=>{
  console.log('showProfile')
}
// 
onMounted(()=>{

});
// 监听参数变化
watch(()=>route.query,(e)=>{
  state.query = route.query
},{ immediate: true })
</script>

<style>

</style>