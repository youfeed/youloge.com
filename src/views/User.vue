<template>
  <header class="h-14 px-2 flex  items-center sticky top-0 bg-[length:4px_4px]" style="backdrop-filter: saturate(50%) blur(4px);">
    <div class="w-full flex justify-between items-center h-10">
      <div class="left flex  items-center justify-start gap-2">
        <div class="flex justify-between items-center ">
          <router-link to="/" class="color-dark-500 font-bold no-underline px-1 py-1 rounded hover:bg-light-500 ">
            <div class="flex items-center gap-1" >
              <img src="/logo.svg" alt="" class="w-6 h-6">
              <span>Youloge</span>
            </div>
          </router-link>
          <div>/</div>
          <router-link :to="user" class="color-dark-200 no-underline font-bold px-1 py-1 rounded hover:bg-light-500 ">
            <div class="max-w-20 truncate">{{user}}</div>
          </router-link>
        </div>
      </div>
      <div class="hidden sm:block">
        <!-- <div class="i-tdesign:setting-1 w-6 h-6"></div> -->
      </div>
      <div class="search">
        <div class="i-tdesign:notification w-6 h-6"></div>订阅
      </div>
    </div>
  </header>
  <main class="profile">
    <router-view></router-view>
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router'

import { onMounted, reactive, toRefs } from "vue";

const route = useRoute() 
const state = reactive({
  user:'',
  profile:{}
}),{user,profile} = toRefs(state)

onMounted(()=>{
  state.user = route.params.user
  state.profile = useStorage('profile');
  onStorage('profile',(res)=>{
    console.log(res)
    state.profile = res;
  });
});
</script>

<style>

</style>