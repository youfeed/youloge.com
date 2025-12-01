<!-- 文章预览 -->
<template>
  <template v-if="err == 0">
    <div class="flex items-center justify-center h-screen-sm mt-10">
      <div class="mx-auto w-full max-w-sm rounded-md border border-gray-300 p-4">
        <div class="flex animate-pulse space-x-4"  v-for="_ in 6">
          <!-- <div class="size-10 rounded-full bg-gray-200"></div> -->
          <div class="flex-1 space-y-6 py-1">
            <div class="h-2 rounded bg-gray-200"></div>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                <div class="col-span-1 h-2 rounded bg-gray-200"></div>
              </div>
              <div class="h-2 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else-if="err == 200">
    <div class="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8">
      <!-- <div class="navbar">navbar</div> -->
      <div class="article py-10">
        <div class="titlez-10 bg-white">
          <h1 class="text-2xl font-bold text-gray-800 mb-4 text-shadow">{{ metadata.title }}</h1>
        </div>
        <div class="meta mb-10">
          <div class="inline-block text-gray-500 break-keep">
            <span class="break-keep mr-2">
              <router-link :to="`/${anthor.user}`" class="no-underline text-blue-200">{{ anthor.name }}</router-link>
            </span>
            <span class="break-keep mr-2">
              {{ useTimeago(metadata.created) }}
            </span>
            <span>
              {{ useViews(metadata.views, '浏览') }}
            </span>
          </div>
        </div>
        <YouRich v-model="html"></YouRich>
        <div class="mt-5">
          <div class="flex items-center gap-2" v-for="keyword in metadata.keywords">
            <router-link :to="`/article/search?q=${keyword}`" class="bg-gray-100 rounded-sm px-2 py-1">
              <span>#{{ keyword }}</span>
            </router-link>
          </div>

        </div>
        <!-- <div class="discuss m-t-10">
          <you-discuss mode="article" :code="params.uuid"></you-discuss>
        </div> -->
      </div>
    </div>
    <!-- <div class="asider">asider</div> -->
  </template>
  <template v-else>
    <div class="mx-auto px-4 py-16 flex-grow flex flex-col items-center justify-center">
      <h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold text-gray-800 mb-4 text-shadow">页面不见了{{ err }}</h1>
      <div class="font-size-2xl  w-80 h-40 color-gray-400">{{ msg }}</div>
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <a href="javascript:history.back()"
          class=" px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
          返回上一页
        </a>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-lg mx-auto">
        <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <i class="fa fa-lightbulb-o text-accent mr-2"></i> 您可以尝试以下操作:
        </h3>
        <ul class="text-gray-600 space-y-2 text-left">
          <li class="flex items-start">
            <i class="fa fa-check-circle text-secondary mt-1 mr-2"></i>
            <span>检查URL拼写是否正确</span>
          </li>
          <li class="flex items-start">
            <i class="fa fa-check-circle text-secondary mt-1 mr-2"></i>
            <span>使用网站导航查找所需内容</span>
          </li>
          <li class="flex items-start">
            <i class="fa fa-check-circle text-secondary mt-1 mr-2"></i>
            <span>刷新页面尝试重新加载</span>
          </li>
        </ul>
      </div>
    </div>
  </template>
</template>

<script setup>

const route = useRoute()
const state = reactive({
  uuid: '',
  err: 0, msg: '',
  // 发布者信息
  anthor: {}, metadata: {},
  params: {}, html: '', prismKey: 0,
  cursor: Number.MAX_SAFE_INTEGER,
}), { uuid, err, msg, params, anthor, metadata, html, prismKey } = toRefs(state);
// 获取元数据
const metaData = () => {
  let { uuid } = state.params;
  apiFetch('article/info', { uuid: uuid }).then(({ account, ...metadata }) => {
    state.err = 200;
    state.anthor = account;
    state.metadata = metadata;
    document.title = metadata.title;
    // 加载正文
    getRich();
  }).catch((error) => {
    state.msg = error.message;
  })
}
// 获取内容
const getRich = () => {
  let { rich } = state.metadata;
  fetch(`${rich}&t=${Date.now()}`).then(r => r.text()).then(text => {
    state.html = text;
  });
}
// 获取评论
const getComment = () => {
  let { uuid } = state.params;
}

onMounted(() => {
  state.params = route.params;
  metaData();
});
</script>
