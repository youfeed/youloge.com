<template>
  <header >
    <div>Tab</div>
    <div>img</div>
    <div>Name</div>
    <div>Search</div>
    <div>Profile</div>
  </header>
  <div>/useruseruser</div>
  <main>
    <router-view></router-view>
  </main>
  <footer>Footer</footer>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
onMounted(() => {
  console.log(router, route)
})
</script>

<style>

</style>