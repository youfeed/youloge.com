<template>
  <div class="max-w-screen-md mx-auto p-4 border-solid border-1 rounded border-gray-300">
    <template v-if="mode == 'preview'">
      <div class="flex justify-between items-center mb-4 border-b-solid border-b-1 border-gray-300 p-b-2">
        <div @click="reFresh">
          <div class="navbar">
            <span>云盘文件</span>
            <span>已购文件</span>
          </div>
          <button class="p-1 bg-transparent border-none rounded-sm ml-2 cursor-pointer hover:bg-gray-200"><i
              class="i-tdesign-refresh"></i></button>
        </div>
        <button @click="onChoose"
          class="bg-blue-600 rounded-sm px-2 py-1 border-none text-white ml-2 cursor-pointer"><span
            class="i-tdesign:arrow-up-circle"></span>上传</button>
      </div>
      <div>
        <template v-for="item in list" :key="item.id">
          <div class="mb-4">
            <div class="font-medium">
              <router-link :to="`/drive/${item.uuid}`" target="_blank"
                class="text-current decoration-none hover:opacity-80">
                {{ item.title }}{{ item.ext }}
              </router-link>
            </div>
            <div class="text-sm ">售价:<span class="text-red-500"><sub>#</sub>{{ item.cost }}<sup>RGB</sup></span> · {{
              useBytes(item.size) }} · {{ item.mime }} {{ useTimeago(item.created) }}</div>
            <div>
              <span @click="onModify(item)">修改</span>
              <span @click="onPublish(item)">上架</span>
              <span @click="unPublish(item)">下架</span>
            </div>
          </div>
        </template>
        <div v-if="data.next_cursor" @click="getDrive">加载更多</div>
      </div>
    </template>
    <template v-else-if="mode == 'draft'">
      <div class="panel-head flex items-center justify-between  h-10 border-b-solid border-b border-gray-200">
        <div class="flex items-center gap-5">
          <div>编辑模式·27 lines (15 loc) · 467 Bytes</div>
        </div>
        <div @click="onSave">保存草稿</div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps(['params']), emit = defineEmits(['jump']);
const state = reactive({
  err: 0, msg: '', data: {}, list: [],
  mode: 'preview',// preview draft
  // 分页游标
  cursor:{
    next_cursor:''
  },
  draft: {
    title: '',
    poster: '',
    content: '',
    keywords: '',
    description: '',
  },
}), { err, msg, data, list, mode, draft } = toRefs(state);
//
const getDrive = () => {
  let { next_cursor } = state.cursor;
  apiFetch('drive/list', { cursor: next_cursor }).then(res => {
    state.err = 200;
    let {data,...cursor} = res
    // 去重追加
    data.forEach(is=>{
      let findIndex = state.list.findIndex(it=>it.uuid == is.uuid);
      if(findIndex == -1){
        state.list.push(is);
      }
    });
    state.cursor = cursor;
  }).catch(error=>{
    state.msg = error.message;
  });
}
//
const reFresh = () => {
  state.data.next_cursor = null;
  state.list = [];
  getDrive()
}
// 上传文件
const onChoose = () => {
  useMaterial({ type: 'drive', limit: 1 }).then(res => {
    console.log('上传文件', res)
  });
}
// 修改文件
const onModify = (item) => {
  state.mode = 'draft'; state.draft = item;
}
// 上架文件
const onPublish = (item) => {
  apiFetch('drive/status', {
    uuid: item.uuid,
    status: 10,
    remark: '申请上架'
  }).then(res => {
    console.log(res)
  })
}
// 下架文件
const unPublish = (item) => {
  apiFetch('drive/status', {
    uuid: item.uuid,
    status: 0,
    remark: '下架撤回'
  }).then(res => {
    console.log(res)
  })
}
onMounted(() => {
  getDrive()
})
// 路由跳转(动态组件内部跳转)
const navigateTo = (path, params = '') => {
  emit('jump', path, params);
}
</script>

<style></style>