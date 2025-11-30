<template>
  <header class="h-14 px-2 flex items-center border-b border-slate-900/10 border-b-solid top-0 bg-[length:4px_4px]" style="backdrop-filter: saturate(50%) blur(4px);">
    <div class="w-full flex justify-between items-center h-10">
      <div class="left flex  items-center justify-start gap-2">
        <div class="flex justify-center items-center">
          <you-guide icon="ic:sharp-apps">
            <div>Youloge</div>
          </you-guide>
          <div class="text-sm text-gray-200">/</div>
          <router-link to="/drive" class="color-dark-500 no-underline font-bold px-1 py-1 rounded hover:bg-light-500 ">
            <div>Drive</div> 
          </router-link>
        </div>
      </div>
      <div class="search hidden md:block">
        <div class="max-w-40">
          <form action="/drive/search" method="get" class="max-w-80 border rounded-full flex items-center gap-2">
            <input type="search" name="q" v-model="query.q" placeholder="搜索云盘资源" class="border-none outline-none bg-transparent px-2 py-1 w-full"/>
          </form>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="hover:bg-gray-2  md:hidden rounded-full flex items-center justify-center p-1">
          <router-link to="/drive/search?q=*">
            <YouIcon name="carbon:search" size="24"></YouIcon>
          </router-link>
        </div>
        <div class="flex gap-2">
          <div class="flex items-center hover:bg-gray-100 rounded-full px-2 py-1 cursor-pointer" @click="useSetup('setupDrive')">
            <you-svg name="ic:sharp-add" size="24"></you-svg>
            <span class="hidden md:block">创建</span>
          </div>
          <you-profile></you-profile>
        </div>
      </div>
    </div>
  </header>
  <main class="drive">
    <router-view :key="$route.fullPath"></router-view>
  </main>
</template>

<script setup>
import { useTemplateRef } from 'vue';

const stateProfile = storeProfile();
const route = useRoute();
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