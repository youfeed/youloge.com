<template>
    <template v-if="err == 0">
    <div class="flex items-center justify-center h-screen-sm">
        <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
    </div>
    </template>
    <template v-if="err == 200">
        <div class="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
          <template v-for="item in list" :key="item.uuid">
            <div class="border mt-2 ">
              <router-link :to="`/article/${item.uuid}`">
                <div>{{ item.title }}</div>
                <div>{{ item.description }}</div>
                <div>{{ item.created }} · {{ item.views }}</div>
              </router-link>
            </div>
          </template>
        </div>
    </template>
    <template v-else>
    <div class="flex items-center justify-center h-screen-sm">
      <div class="font-size-2xl  w-40 h-40 color-gray-400">{{ msg }}</div>
    </div>
  </template>
</template>
  
<script setup>
const state = reactive({
    err:200,msg:'',
    query:{},list:[],
    search:{
      q:'',
      offset:0,
      limit:20,
      estimatedTotalHits:0
    }
}),{err,msg,query,search,list} = toRefs(state),route = useRoute();
// 触发查询
const onSearch = (isClern = false)=>{
  isClern && (state.search.offset = 0,state.search.limit = 20);
  let {q,offset,limit} = state.search;
  apiFetch('search/article',{q:q,offset:offset,limit:limit}).then(({hits,...search})=>{
    state.search = search;
    hits.forEach(is=>{
      let findIndex = state.list.findIndex(it=>it.uuid == is.uuid);
      findIndex == -1 && state.list.push(is)
    });
  }).catch((err)=>{ 
    useMessage().error(err.message);
  });
}

onMounted(()=>{
    state.query = route.query;
    state.search.q = state.query.q
    console.log(state.query)
    onSearch(true);
})
</script>
  
<style>

</style>