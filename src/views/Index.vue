<template>
  <div>
    <component :is="currentComponent"></component>
  </div>
</template>
<script setup>
import IndexHome from './IndexHome.vue'
import IndexConsole from './IndexConsole.vue'
//
const stateProfile = storeProfile();
const currentComponent = computed(() => {
  let {uuid} = useAuth()
  return uuid ? IndexConsole : IndexHome;
});

onMounted(()=>{
  console.log('onMountedonMountedonMounted',stateProfile)
  console.log('onMountedonMountedonMounted',stateProfile.logged())
})
</script>

<style>

</style>