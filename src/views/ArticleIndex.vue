<!-- 文章预览 navbar asider article section main-->
<template>
  <div class="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
    <div class="navbar"></div>
    <div class="article">
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
    <div class="asider"></div>
  </div>
</template>

<script setup>
const state = reactive({
  err:0,
  msg:'',
  count:0,
  cursor:Number.MAX_SAFE_INTEGER,
  data:{},
}),{err,msg,data} = toRefs(state);
// 
const onSearch = ()=>{
  let {cursor} = state;
  apiFetch('search/article',{q:'',cursor:cursor,limit:20}).then(r=>r.json()).then(res=>Object.assign(state,res)).catch((err)=>{ 
    console.log('err',state,err)
  });
}
onMounted(()=>{
  onSearch();
})
</script>

<style>

</style>