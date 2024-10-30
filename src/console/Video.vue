<template>
  <div class="max-w-screen-md mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <div>视频短片</div>
      <div @click="reFresh" class="i-tdesign-loading"></div>
    </div>
    <div>
      <template v-for="item in list" :key="item.id">
        <div class="mb-4">
          <div class="font-medium">
            <router-link :to="`/video/${item.uuid}`" target="_blank" class="text-current decoration-none hover:opacity-80">
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
const getVideo = ()=>{
  let {next_cursor} = state.data;
  apiFetch('video/list',{cursor:next_cursor},true).then(res=>{
    state.list.push(...res.data.data);Object.assign(state,res);
  })
}
//
const reFresh = ()=>{
  state.data.next_cursor = null;
  state.list = [];
  getVideo()
}
//
onMounted(()=>{
  getVideo()
})
// 路由跳转(动态组件内部跳转)
const navigateTo = (path,params='')=>{
    emit('jump',path,params);
}
</script>

<style>

</style>