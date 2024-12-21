<template>
  <div class="max-w-screen-md mx-auto p-4 border-solid border-1 rounded border-gray-300">
    <div class="flex justify-between items-center mb-4 border-b-solid border-b-1 border-gray-300 p-b-2">
      <div @click="reFresh">
        <div class="navbar">
          <span>云盘文件</span>
          <span>已购文件</span>
        </div>
        <button class="p-1 bg-transparent border-none rounded-sm ml-2 cursor-pointer hover:bg-gray-200"><i class="i-tdesign-refresh"></i></button>
      </div>
      <button @click="onChoose" class="bg-blue-600 rounded-sm px-2 py-1 border-none text-white ml-2 cursor-pointer"><span class="i-tdesign:arrow-up-circle"></span>上传</button>
    </div>
    <div>
      <template v-for="item in list" :key="item.id">
        <div class="mb-4">
          <div class="font-medium">
            <router-link :to="`/drive/${item.uuid}`" target="_blank" class="text-current decoration-none hover:opacity-80">
              {{item.title}}{{ item.ext }} 
            </router-link>
          </div>
          <div class="text-sm ">售价:<span class="text-red-500"><sub>#</sub>{{ item.cost}}<sup>RGB</sup></span> · {{ useBytes(item.size) }} · {{item.mime}}  {{ useTimeago(item.created) }}</div>
        </div>
      </template>
      <div v-if="data.next_cursor" @click="getDrive">加载更多</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['params']),emit = defineEmits(['jump']);
const state = reactive({
  err:0,msg:'',data:{},list:[],
}),{err,msg,data,list,profile} = toRefs(state);
//
const getDrive = ()=>{
  let {next_cursor} = state.data;
  apiFetch('drive/list',{cursor:next_cursor},true).then(res=>{
    state.list.push(...res.data.data);Object.assign(state,res);
  })
}
//
const reFresh = ()=>{
  state.data.next_cursor = null;
  state.list = [];
  getDrive()
}
// 上传文件
const onChoose = ()=>{
  useMaterial({type:'file',limit:1}).then(res=>{
    console.log('上传文件',res)
  });
}
onMounted(()=>{
  getDrive()
})
// 路由跳转(动态组件内部跳转)
const navigateTo = (path,params='')=>{
    emit('jump',path,params);
}
</script>

<style>

</style>