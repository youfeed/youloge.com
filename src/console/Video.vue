<template>
  <div class="max-w-screen-md mx-auto">
    <template v-if="mode == 'preview'">
      <div class="flex justify-start items-center gap-2">
        <div @click="onUpload" class="">上传视频</div>
        <div>视频短片</div>
      </div>
      <div class="panel-body">
        <template v-for="item in list" :key="item.id">
          <div class="border-b-1 border-gray-200 p-2">
            <div class="flex gap-2">
              <div class="w-12 h-12 rounded-sm overflow-hidden">
                <img :src="useImage(item.poster,120)" alt="" class="w-full h-full object-cover">
              </div>
              <div class="flex-1">
                <div class="font-medium line-clamp-1">
                  <router-link :to="`/video/${item.uuid}`" target="_blank" class="text-current decoration-none hover:opacity-80">
                    {{item.title}}{{ item.ext }} 
                  </router-link>
                </div>
                <div class="text-sm text-gray-500 line-clamp-2">{{item.description}}</div>
              </div>
            </div>
            <div class="text-sm flex gap-2 justify-between">
              <div>
                <span>时长：{{item.duration}}</span>
                <span>{{useBytes(item.size)}}</span>
                <span>{{useTimeago(item.created)}}</span>
              </div>
              <div>
                <template v-if="item.status == 0">
                  <span @click="onModify(item)" class="cursor-pointer text-green hover:opacity-60">修改</span>
                  <span @click="onModify(item)" class="cursor-pointer text-green hover:opacity-60">上架</span>
                </template>
                <template v-if="item.status == 1">
                  <span @click="useKeyboard()" class="cursor-pointer text-green hover:opacity-60">强制下架</span>
                </template>
              </div>
            </div>
          </div>
        </template>
        <div v-if="cursor.next_cursor" @click="getDrive">加载更多</div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps(['params']),emit = defineEmits(['jump']);
const state = reactive({
  err:0,msg:'',
  mode:'preview',
  list:[],
  cursor:{
    next_cursor:null,
    status:''
  }
}),{err,msg,mode,list,cursor} = toRefs(state);
//
// 加载列表
const loadVideo = (isFirst = false) => {
  let { next_cursor, status } = state.cursor;
  apiFetch('video/list', { cursor: next_cursor,status:status }).then(res => {
    let { data, ...cursor } = res
    // 去重追加
    data.forEach(is => {
      let findIndex = state.list.findIndex(it => it.uuid == is.uuid);
      if (findIndex == -1) {
        state.list.push(is);
      }
    });
    state.err = 200;
    state.cursor = cursor;
  }).catch(error => {
    state.msg = error.message;
  });

}
// 上传视频
const onUpload = ()=>{
  useMaterial({type:'video',limit:1}).then(res=>{
    console.log(res)
  }).catch(err=>{
    console.log(err)
  })
}
// 刷新列表
const reFresh = ()=>{
  state.cursor.next_cursor = null;
  state.list = [];
  loadVideo(true)
}
//
onMounted(()=>{
  loadVideo();
});
</script>

<style>

</style>