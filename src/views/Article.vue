<template>
  <header class="h-14 px-2 flex  items-center sticky top-0 bg-[length:4px_4px]" style="backdrop-filter: saturate(50%) blur(4px);">
    <div class="w-full flex justify-between items-center h-10">
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
      <div class="hidden sm:block">
        <div class="i-tdesign:setting-1 w-6 h-6"></div>
      </div>
    </div>
  </header>
  <main class="article">
    <router-view></router-view>
  </main>
</template>

<script setup>
const route = useRoute();
const state = reactive({
  err:0,msg:'',data:[],
  user:'',
  query:{},profile:{},
}),{user,query,profile} = toRefs(state)
// 
onMounted(()=>{
  state.query = route.query;
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