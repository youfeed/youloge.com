<template>
  <header class="h-14 px-2 flex  items-center">
    <div class="w-full flex justify-between items-center h-10">
      <div class="left flex  items-center justify-start gap-2">
        <div class="w-6 h-6 border-gray-500 border border-solid rounded-md flex justify-center items-center">
          <div class="i-tdesign:view-list"></div>
        </div>
        <div class="flex justify-between items-center ">
          <router-link to="/" class="color-dark-500 no-underline px-2 py-1 rounded hover:bg-light-500 ">
            <div class="flex items-center gap-1" :title="name">
              <span class="i-tdesign:logo-github-filled"></span>
              <span>{{user}}</span>
            </div>
          </router-link>
          <div>/</div>
          <router-link to="/drive" class="color-dark-500 no-underline font-bold px-2 py-1 rounded hover:bg-light-500 ">
            <div >Drive</div>
          </router-link>
        </div>
      </div>
      <div class="search">
        <div>
          <form action="/drive/search" method="get">
            <input type="search" name="q" placeholder="请输入视频ID" class="border rounded px-2 py-1"/>
          </form>
        </div>
      </div>
      <div>
        <div class="w-4 h-4">
          <div class="i-tdesign:add"></div>
        </div>
        <div class="w-4 h-4">
          <div class="i-tdesign:view-list"></div>
        </div>
      </div>
    </div>
  </header>
  <main class="drive">
    <router-view></router-view>
  </main>
</template>

<script setup>

</script>

<style>

</style>