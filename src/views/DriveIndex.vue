<template>
  <!-- 英雄区域 -->
  <section class="bg-gradient-to-b from-blue to-white py-16 md:py-24">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary mb-6 leading-tight">
          Youloge Drive
        </h1>
        <br class="md:hidden"></br>
        <h3 class="text-xl font-bold text-secondary mb-6 leading-tight">
          云存储资源分享<br class="md:hidden">+
        </h3>
        <!-- 搜索框 -->
        <div class="max-w-80 mx-auto  mb-4">
          <form action="/drive/search" method="get" class="relative flex items-center gap-2">
            <input type="search" name="q" placeholder="搜索云盘资源"
              class="border border-gray-300 rounded-full outline-none bg-transparent px-2 py-1 w-full" required>
            <button type="submit" class="absolute inset-y-0 right-1 border-0 outline-0 bg-transparent text-blue-500">搜索</button>
          </form>
        </div>
        <p class="text-xl text-gray-600 mb-2 text-balance">
          不限速度: 下载速度没有限制 享受CDN高速下载
        </p>
        <p class="text-xl text-gray-600 mb-2 text-balance">
          不限大小: 文件大小不限, 支持GB级别大文件
        </p>
        <p class="text-xl text-gray-600 mb-2 text-balance">
          下载次数: 24小时内不限次数下载
        </p>
        <!-- 快速统计 -->
        <div class="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-500">
          <div>分享资源</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, toRefs, onMounted } from "vue"

const state = reactive({
  err: 0,
  msg: '',
  count: 0,
  data: {},
}), { err, msg, data } = toRefs(state);
//
const onSearch = () => {
  apiFetch('search/drive', {}).then(res => Object.assign(state, res)).catch((err) => {
    console.log('err', state, err)

  })
  // console.log('err',state)
}
onMounted(() => {

  onSearch();
})
</script>

<style></style>