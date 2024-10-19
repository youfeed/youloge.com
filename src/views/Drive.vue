<template>
  <header class="h-14 px-2 flex  items-center sticky top-0 bg-[length:4px_4px]" style="backdrop-filter: saturate(50%) blur(4px);">
    <div class="w-full flex justify-between items-center h-10">
      <div class="left flex  items-center justify-start gap-2">
        <div class="w-6 h-6 border-gray-500 border border-solid rounded-md flex justify-center items-center">
          <div class="i-tdesign:view-list"></div>
        </div>
        <div class="flex justify-between items-center ">
          <router-link to="/" class="color-dark-500 font-bold no-underline px-1 py-1 rounded hover:bg-light-500 ">
            <div class="flex items-center gap-1" :title="name">
              <img src="/loge.svg" alt="" class="w-4 h-4">
              <span>Youloge</span>
            </div>
          </router-link>
          <div>/</div>
          <router-link to="/drive" class="color-dark-500 no-underline font-bold px-1 py-1 rounded hover:bg-light-500 ">
            <div>Drive</div>
          </router-link>
        </div>
      </div>
      <div class="search">
        <div class="max-w-40">
          <form action="/drive/search" method="get">
            <input type="search" name="q" placeholder="搜索云盘资源" class="border rounded px-2 py-1 w-full"/>
          </form>
        </div>
      </div>
      <div class="flex">
        <!-- <div class="w-4 h-4">
          <div class="i-tdesign:add"></div>
        </div> -->
        <div class="w-8 h-8">
          <div><img :src="useImage(profile.avatar,'80')" alt="" class="w-full h-full rounded-full"></div>
        </div>
      </div>
    </div>
  </header>
  <main class="drive">
    <router-view></router-view>
  </main>
</template>

<script setup>
import { onMounted, reactive, toRefs } from "vue";
const state = reactive({
  profile:{}
}),{profile} = toRefs(state)

onMounted(()=>{
  state.profile = useStorage('profile');
  onStorage('profile',(res)=>{
    console.log(res)
    state.profile = res;
  });
});
</script>

<style>

</style>