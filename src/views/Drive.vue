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
        <div class="flex gap-2">
          <you-dropdown>
            66666
            <template #dropdown>
              66669888
            </template>
          </you-dropdown>
          <div class="" @click="useSetup('setupDrive')">
            +创建
          </div>
          <div>
            <you-profile></you-profile>
          </div>
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