<template>
  <template v-if="err == 0">
    <div class="flex items-center justify-center h-screen-sm">
      <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
    </div>
  </template>
  <template v-if="err == 200">
    <div class="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 mt-10">
      <div>约有 1 条结果</div>
      <div class="lists border-gray-200 border-1 mt-5">
        <template v-for="item in list" :key="item.uuid">
          <div v-ripple class="list border-b-1 border-gray-200 p-4 border-width-1 border-style-solid rounded-sm">
            <router-link :to="`/drive/${item.uuid}`"
              class="text-current decoration-none  hover:opacity-80 hover:text-blue-500">
              <div>{{ item.title }}</div>
            </router-link>
            <div class="text-sm text-gray-800">{{ item.intro }}</div>
            <div title="keywords">
              <span v-for="tag in item.label" :key="tag">#{{ tag }} </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="flex items-center justify-center h-screen-sm">
      <div class="font-size-2xl  w-40 h-40 color-gray-400">{{ msg }}</div>
    </div>
  </template>
</template>

<script setup>
const state = reactive({
  err: 0, msg: '', data: {}, 
  list: [], query: {}, cursor: 0, limit: 20,
}), { err, msg, data, list, query, cursor } = toRefs(state), route = useRoute();
// 触发搜索
const onSearch = () => {
  let { query, cursor } = state;
  apiFetch('search/drive', { q: query.q, cursor: cursor, limit: 20 }).then(res => {
    console.log('err', res)
    Object.assign(state, res); state.list.push(...res.data);
  }).catch((err) => {
    console.log('err', err)
    useMessage().error(err.msg)
  });
}

//
onMounted(() => {
  state.query = route.query;
  onSearch();
  useMessage().info('ssssss')
})
</script>

<style>
</style>