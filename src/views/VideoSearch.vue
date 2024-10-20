<template>
  <div>
    索索ssd
  </div>
</template>

<script steup>
const state = reactive({
  err:0,msg:'',data:{},query:{}
}),{err,msg,data} = toRefs(state),route = useRoute();
// 
const onSearch = ()=>{
  let {query} = state;
  apiFetch('search/video',{q:query.q,label:query.label}).then(res=>Object.assign(state,res)).catch((err)=>{
    console.log('err',state,err)
  });

}

console.log('route',route,useRoute())
// 
onMounted(()=>{
  state.query = route.query;
  console.log('route',state.query)
  console.log(route);
  onSearch()
});
</script>

<style>

</style>