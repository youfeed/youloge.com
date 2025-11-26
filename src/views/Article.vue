<template>
  <header class="h-14 px-2 border-b border-slate-900/10 border-b-solid sticky top-0 bg-[length:4px_4px]" style="backdrop-filter: saturate(50%) blur(4px);">
    <!-- 侧边按钮 Loge 用户/内容 --- 搜索 用户 -->
    <div class="w-full flex justify-between items-center h-full">
      <div class="left flex  items-center justify-start gap-2">
        <div class="flex justify-between items-center ">
          <router-link to="/" class="color-dark-500 font-bold no-underline px-1 py-1 rounded hover:bg-light-500 ">
            <div class="flex items-center gap-1" >
              <img src="/logo.svg" alt="" class="w-5 h-5">
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
        <div class="h-10 max-w-30 sm:max-w-60 border-1 border-gray-500 border-solid rounded hover:border-blue-700">
          <form action="/article/search" method="get" class="w-full h-full">
            <input type="search" name="q" placeholder="搜索文章" v-model="query.q" autocomplete="off" class="px-2 py-1 border-0 outline-0 w-full h-full bg-transparent"/>
          </form>
        </div>
      </div>
      <div class="">
        <div v-login="onLayout">
          <img :src="useImage(stateProfile.avatar,'80')" :alt="stateProfile.name" class="rounded-full w-8 h-8">
        </div>
      </div>
    </div>
  </header>
  <main class="article">
    <router-view :key="$route.fullPath"></router-view>
  </main>
</template>

<script setup>

const stateProfile = storeProfile();
const route = useRoute();
const state = reactive({
  err:0,msg:'',data:[],
  user:'',
  query:{}
}),{user,query} = toRefs(state)
//
//
onMounted(()=>{
  console.log(2333,stateProfile)
  // state.query = route.query;
});
// 监听参数变化
watch(()=>route.query,(e)=>{
  state.query = route.query
},{ immediate: true })
</script>

<style>

</style>