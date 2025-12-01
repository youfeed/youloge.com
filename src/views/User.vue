<template>
  <header class="h-14 px-2 flex  items-center sticky top-0 bg-[length:4px_4px]" style="backdrop-filter: saturate(50%) blur(4px);">
    <div class="w-full flex justify-between items-center h-10">
      <div class="left flex  items-center justify-start gap-2">
        <div class="flex justify-between items-center ">
          <you-guide icon="ic:sharp-apps">
            <div>Youloge</div>
          </you-guide>
          <div>/</div>
          <router-link :to="user" class="color-dark-200 no-underline font-bold px-1 py-1 rounded hover:bg-light-500 ">
            <div class="max-w-20 truncate">{{user}}</div>
          </router-link>
        </div>
      </div>
      <div class="hidden sm:block">
        <!-- <div class="i-tdesign:setting-1 w-6 h-6"></div> -->
      </div>
      <div class="search flex items-center gap-2">
        <you-profile></you-profile>
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
  state.user = route.params.user;
  state.profile = useStorage('profile');
});
</script>

<style>

</style>