<template>
  <header class="flex justify-between items-center h-10 px-2">
    <div>
      <span>/// Youloge.Video </span>
    </div>
    <div>
      <form action="">
        <input type="text" name="q" placeholder="请输入视频ID" />
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
import { onMounted } from "vue";
/**
 * 做页头侧栏登录渲染
 */
onMounted(()=>{
  console.log()
})
</script>

<style>

</style>