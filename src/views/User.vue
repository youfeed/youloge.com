<template>
  <header class="flex justify-between items-center h-10 px-2">
    <div>
      <span>/// Youloge.User </span>
    </div>
    <div>
      <form action="">
        <input type="text" name="q" placeholder="搜索用户" />
      </form>
    </div>
    <div>
      User
    </div>
  </header>
  <main class="columns">
    <router-view></router-view>
  </main>
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