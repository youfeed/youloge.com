<template>
  <div>
    <component :is="currentComponent"></component>
  </div>
</template>
<script setup>
import 'youloge.custom'
import IndexHome from './IndexHome.vue'
import IndexConsole from './IndexConsole.vue'
//
const stateProfile = storeProfile();
const currentComponent = computed(() => {
  return stateProfile.uuid ? IndexConsole : IndexHome;
});

onMounted(()=>{
  console.log('import.youloge.custom',stateProfile.uuid)
})
</script>

<style>

</style>