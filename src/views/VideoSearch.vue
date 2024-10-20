<template>
  <div>
    索索ssd
  </div>
</template>

<script steup>
import { onMounted } from 'vue';
import { useRoute } from "vue-router";
const route = useRoute();
const state = reactive({
  err:0,msg:'',data:{},query:{}
}),{err,msg,data} = toRefs(state);
// 
const onSearch = ()=>{
  let {query} = state;
  apiFetch('search/video',{q:query.q,label:query.label}).then(res=>Object.assign(state,res)).catch((err)=>{
    console.log('err',state,err)
  });

}

console.log('route',route)
// 
onMounted(()=>{
  state.query = route.query;
  console.log('route')
  console.log(route);
  onSearch()
});
</script>

<style>

</style>