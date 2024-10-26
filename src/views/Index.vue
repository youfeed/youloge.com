<template>
  <div>
    <component :is="currentComponent"></component>
  </div>
</template>
<script setup>
import IndexHome from './IndexHome.vue'
import IndexConsole from './IndexConsole.vue'
const currentComponent = computed(() => {
  let {uuid} = useAuth()
  return uuid ? IndexConsole : IndexHome;
});
onMounted(()=>{

})
</script>

<style>

</style>