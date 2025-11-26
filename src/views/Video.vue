<template>
  <header class="h-14 px-2 flex  items-center">
    <div class="w-full flex justify-between items-center h-10">
      <div class="left flex  items-center justify-start gap-2">
        <div class="flex justify-between items-center ">
          <router-link to="/" class="color-dark-500 font-bold no-underline px-1 py-1 rounded hover:bg-light-500 ">
            <div class="flex items-center gap-1" >
              <img src="/logo.svg" alt="" class="w-5 h-5">
              <span>Youloge</span>
            </div>
          </router-link>
          <div>/</div>
          <router-link to="/video" class="color-dark-500 no-underline font-bold px-2 py-1 rounded hover:bg-light-500 ">
            <div >Video</div>
          </router-link>
        </div>
      </div>
      <div class="search">
        <div class="max-w-40">
          <form action="/video/search" method="get">
            <input type="search" name="q" v-model="query.q" placeholder="搜索视频资源" class="border rounded px-2 py-1 w-full"/>
          </form>
        </div>
      </div>
      <div class="hidden sm:block">
        <div class="i-tdesign:setting-1 w-6 h-6"></div>
      </div>
    </div>
  </header>
  <nav></nav>
  <aside></aside>
  <main class="video">
    <router-view></router-view>
  </main>
  <footer></footer>
</template>

<script setup>
const route = useRoute();
const state = reactive({
  uuid:'',
  user:'',
  name:'',
  mail:'',
  query:{},
  profile:{}
}),{uuid,user,name,query,profile} = toRefs(state);

onMounted(()=>{
  state.query = route.query;
  state.profile = useStorage('profile');
  onStorage('profile',(res)=>{
    state.profile = res;
    console.log('onStorage.profile',res)
  });
});
</script>

<style>

</style>