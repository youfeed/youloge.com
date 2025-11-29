<template>
  <header class="h-14 px-2 flex  items-center border-b border-slate-900/10 border-b-solid sticky top-0" style="backdrop-filter: saturate(50%) blur(4px);">
    <div class="w-full flex justify-between items-center h-10">
      <div class="left flex  items-center justify-start gap-2">
        <div class="flex justify-between items-center ">
          <you-guide icon="ic:sharp-apps">
            <div>Youloge</div>
          </you-guide>
          <div>/</div>
          <router-link to="/goods" class="color-dark-500 no-underline font-bold px-1 py-1 rounded hover:bg-light-500 ">
            <div>Goods</div>
          </router-link>
        </div>
      </div>
      <div class="search">
        <div class="max-w-40">
          <form action="/goods/search" method="get">
            <input type="search" name="q" v-model="query.q" placeholder="搜索商品信息" class="border rounded px-2 py-1 w-full"/>
          </form>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1 hover:bg-gray-300 rounded-full px-2 py-1 cursor-pointer">
          <you-svg name="tdesign:add" size="12"></you-svg>
          我的订单
        </div>
        <you-profile></you-profile>
      </div>
    </div>
  </header>
  <main class="drive">
    <router-view></router-view>
  </main>
  <!-- 通用侧栏 -->
</template>

<script setup>
const route = useRoute();
const state = reactive({
  err:0,msg:'',data:[], query:{},
  asideRef:null,profileRef:null,profile:{},
}),{query,profile,asideRef,profileRef} = toRefs(state);

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