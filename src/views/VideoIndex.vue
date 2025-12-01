<template>
  <div id="container" class="m-2 sm:m-4 md:m-8">
    <!-- 英雄区域 -->
    <section class="bg-gradient-to-b from-blue to-white py-16 md:py-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary mb-6 leading-tight">
            视频短片<br class="md:hidden">+
          </h1>
          <!-- 搜索框 -->
          <div class="max-w-80 mx-auto">
            <form action="/video/search" method="get" class="flex gap-1">
              <input type="search" name="q" placeholder="搜索视频资源" class="border rounded px-2 py-1 w-full" required>
              <button type="submit" class=" px-1 py-1 w-15">搜索</button>
            </form>
          </div>
          <p class="text-xl text-gray-600 mb-8 text-balance">
            
          </p>
          <!-- 快速统计 -->
          <div class="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-500">
            <div @click="useKeyboard({type:'letter',prefix:'XYZ'}).then(res=>console.log(res))"><span class="font-semibold text-secondary">100M+</span> 分享视频</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
const state = reactive({
  title: 'Youloge 视频点播',
}), { title } = toRefs(state);


const io = new IntersectionObserver((entries, observer) => {

}, { rootMargin: '0px', threshold: 1.0 });
//
onMounted(() => {
  document.title = state.title
  console.log('r')
  // io.observe(document.querySelector("#loading"));
})
</script>

<style></style>