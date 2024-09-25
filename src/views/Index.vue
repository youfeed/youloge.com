<template>
  <div>
    <div>233</div>
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

  
  // observer.observe(state.ref) 
});
</script>

<style>

</style>