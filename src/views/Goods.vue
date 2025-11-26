<template>
  <header class="h-14 px-2 flex  items-center sticky top-0 bg-[length:4px_4px]" style="backdrop-filter: saturate(50%) blur(4px);">
    <div class="w-full flex justify-between items-center h-10">
      <div class="left flex  items-center justify-start gap-2">
        <div class="w-8 h-8 p-1 hover:bg-gray-200 rounded-full cursor-pointer flex justify-center items-center" @click="asideRef?.onShow()">
          <you-icon name="tdesign:view-list"></you-icon>
        </div>
        <div class="flex justify-between items-center ">
          <router-link to="/" class="color-dark-500 font-bold no-underline px-1 py-1 rounded hover:bg-light-500 ">
            <div class="flex items-center gap-1">
              <img src="/logo.svg" alt="" class="w-4 h-4">
              <span>Youloge</span>
            </div>
          </router-link>
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
      <div class="flex">
        <!-- <div class="w-4 h-4">
          <div class="i-tdesign:add"></div>
        </div> -->
        <div class="w-8 h-8">
          <div @click="profileRef?.open()">
            <img :src="useImage(profile.avatar,'80')" alt="" class="w-full h-full rounded-full">
          </div>
        </div>
      </div>
    </div>
  </header>
  <main class="drive">
    <router-view></router-view>
  </main>
  <!-- 通用侧栏 -->
  <you-aside ref="asideRef"></you-aside>
  <you-profile ref="profileRef"></you-profile>
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