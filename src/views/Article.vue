<template>
  <header class="h-14 px-2 border-b border-slate-900/10 border-b-solid sticky top-0 bg-[length:4px_4px]" style="backdrop-filter: saturate(50%) blur(4px);">
    <div class="w-full flex justify-between items-center h-full">
      <div class="left flex  items-center justify-start gap-2">
        <div class="flex justify-between items-center ">
          <router-link to="/" class="color-dark-500 font-bold no-underline px-1 py-1 rounded hover:bg-light-500 ">
            <div class="flex items-center gap-1" >
              <img src="/loge.svg" alt="" class="w-5 h-5">
              <span>Youloge</span>
            </div>
          </router-link>
          <div>/</div>
          <router-link to="/article" class="color-dark-500 no-underline font-bold px-1 py-1 rounded hover:bg-light-500 ">
            <div>Article</div>
          </router-link>
        </div>
      </div>
      <div class="search" >
        <div class="h-8 max-w-30 sm:max-w-60 border-1 border-gray-500 border-solid rounded px-2 py-1 hover:border-blue-700">
          <form action="/article/search" method="get">
            <input type="search" name="q" placeholder="搜索文章" v-model="query.q" autocomplete="off" class="border-0 outline-0 w-full h-full bg-transparent"/>
          </form>
        </div>
      </div>
      <div class="">
        <div v-if="stateProfile.logged" @click="onLayout">
          <img :src="useImage(stateProfile.avatar,'80')" alt="stateProfile.name" class="rounded-full w-8 h-8">
        </div>
        <div v-else>
          <button class="">登录</button>
        </div>
      </div>
    </div>
  </header>
  <main class="article">
    <router-view></router-view>
  </main>
</template>

<script setup>
const stateProfile = storeProfile();
const route = useRoute();
const state = reactive({
  err:0,msg:'',data:[],
  user:'',
  query:{},profile:{},
}),{user,query,profile} = toRefs(state)
//
const onLayout = ()=>{
  stateProfile.logout();
} 
//
onMounted(()=>{
  state.query = route.query;
  state.user = route.params.user
  state.profile = useStorage('profile');
  console.log(6666,stateProfile)
  onStorage('profile',(res)=>{
    console.log(res)
    state.profile = res;
  });
});
</script>

<style>

</style>