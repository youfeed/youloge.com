<template>
  <div>
    <component :is="currentComponent"></component>
  </div>
</template>
<script setup>
import IndexHome from './IndexHome.vue'
import IndexConsole from './IndexConsole.vue'
// import { onMounted,computed } from "vue"


const currentComponent = computed(() => {
  let {uuid} = useAuth()
  return uuid ? IndexConsole : IndexHome;
});
// 
onMounted(()=>{
  vipFetch('drive/info',{uuid:'uuid'}).then(r=>r.json()).then(({err,msg,data})=>{})
  // console.log('useAuth',useAuth())
  // observer.observe(state.ref) 
});
</script>

<style>

</style>