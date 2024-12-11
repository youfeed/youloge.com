<template>
  <div class="max-w-screen-md mx-auto p-4">
    <div class="panel mb-4 bg-light p-2 rounded-sm">
      <div class="panel-head flex items-center justify-between  h-10 border-b-solid border-b border-gray-200">
        <div class="flex items-center gap-5">
          <div>文章</div>
          <div>草稿</div>
        </div>
        <div @click="newDraft">新建草稿</div>
      </div>
      <div class="panel-body pt-2">
        <div class="lists">
          <template v-for="item in data.data" :key="item.uuid">
            <div class="list border-b-solid border-b border-gray-300 py-4">
              <div class="">
                <router-link :to="`/article/${item.uuid}`" target="_blank" class="text-lg font-bold text-blue-600 hover:text-blue-500">
                  {{ item.title }}
                </router-link>
              </div>
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">{{ item.created }} · {{ item.view }} · {{ item.uuid }}</div>
                <div>浏览</div>
              </div>
            </div>
          </template>
        </div>
        <div v-if="data.nextcure" class="">加载更多</div>
      </div>
    </div>
    <!-- README -->
    <div class="README">
      README
    </div>
  </div>
</template>

<script setup>
let params = defineProps(['params']);const emit = defineEmits(['jump']);
const state = reactive({
  err:0,msg:'',data:{},
  profile:{}
}),{err,msg,data,profile} = toRefs(state);
//
const loadArticle = ()=>{
  apiFetch('article/list',{next_cursor:state.data.next_cursor},true).then(res=>{
    Object.assign(state,res);
  }).catch(err=>{});
}
// 新建草稿
const newDraft = ()=>{
  apiFetch('article/create').then(res=>{
    console.log(res)
  }).catch(err=>{});
  console.log('newDraft')
}
//
onMounted(()=>{
  loadArticle();
});
// 路由跳转(动态组件内部跳转)
const navigateTo = (path,params='')=>{
    emit('jump',path,params);
}
</script>

<style>

</style>