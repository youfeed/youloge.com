<template>
  <div>
    <component :is="currentComponent"></component>
  </div>
</template>
<script setup>
import IndexHome from './IndexHome.vue'
import IndexConsole from './IndexConsole.vue'
import { onMounted,computed } from "vue"
import { useAuth } from "@/util"

const currentComponent = computed(() => ( useAuth() ? IndexConsole : IndexHome));
// 
onMounted(()=>{
  // console.log('useAuth',useAuth())
  // observer.observe(state.ref)
});
</script>

<style>

</style>