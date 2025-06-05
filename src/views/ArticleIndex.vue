<template>
  <div class="flex flex-row gap-4 max-w-8xl mx-auto mt-8 px-4 sm:px-6 md:px-8">
    <!-- 左侧边栏 -->
    <div class="navbar hidden lg:block lg:w-1/5 order-1">
      <div class="bg-white rounded-xl p-6 shadow-md h-full">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <i class="fa fa-list-ul mr-2 text-secondary"></i>navbar
        </h2>
      </div>
    </div>
    <!-- 主内容区 -->
    <div class="article w-full md:w-3/4 lg:w-3/5 order-1 md:order-2">
      <div class="bg-white rounded-xl p-6 shadow-md h-full">
        <template v-for="item in data" :key="item.uuid">
          <div class="">
            <div>{{ item.title }}</div>
            <div>
              <div>poster</div>
              <div>desc</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- 右侧边栏 (md:隐藏) -->
    <div class="asider hidden md:block md:w-1/4 lg:w-1/5 order-3 wing-transition">
      <div class="bg-white rounded-xl p-6 shadow-md h-full">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <i class="fa fa-bullhorn mr-2 text-accent"></i>asider
          </h2>
      </div>
      
    </div>
  </div>
</template>

<script setup>
const state = reactive({
  err:0,
  msg:'',
  cursor:0,
  data:{},
}),{err,msg,data} = toRefs(state);
// 
const onSearch = ()=>{
  let {cursor} = state;
  apiFetch('search/article',{q:'',cursor:cursor,limit:20}).then(res=>Object.assign(state,res)).catch((err)=>{ 
    console.log('err',state,err)
  });
}
onMounted(()=>{
  onSearch();
})
</script>

<style>

</style>