<template>
  <div class="max-w-screen-md mx-auto p-4">
    <div class="panel mb-4 bg-light p-2 rounded-sm">
      <template v-if="state.mode == 'preview'">
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
                <template v-if="item.status == 0">
                  <div class="text-sm text-gray-500" @click="onEditor(item)">编辑</div>
                </template>
                <template v-else-if="item.status == 1">
                  <div class="text-sm text-gray-500">浏览</div>
                </template>
                <template v-else>
                  <div class="text-sm text-gray-500">审核中</div>
                </template>
              </div>
            </div>
          </template>
        </div>
        </div>
      </template>
      
      
        
        <template v-if="state.mode == 'draft'">
          <div class="panel-head flex items-center justify-between  h-10 border-b-solid border-b border-gray-200">
            <div class="flex items-center gap-5">
              <div>编辑模式</div>
            </div>
            <div @click="onSave">保存草稿</div>
          </div>
          <div class="panel-body pt-2">
            <div class="metadata">
              <div class="poster"></div>
              <div class="title"></div>
              <div class="keywords"></div>
              <div class="description"></div>
            </div>
            <YouEditor v-model="state.draft"></YouEditor>
            <button class="" >记得保存</button>
          </div>
        </template>
        
        <div v-if="data.nextcure" class="">加载更多</div>
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
  err:0,msg:'',data:{},profile:{},
  mode:'preview',// preview draft
  draft:'',
}),{err,msg,data,profile} = toRefs(state);
//
const loadArticle = ()=>{
  apiFetch('article/list',{cursor:state.data.next_cursor},true).then(res=>{
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
// 编辑草稿
const onEditor = (item)=>{
  state.mode = 'draft';
  state.draft = '<p>111</p>';
  console.log(item)
}
// 保存草稿
const onSave = ()=>{
  state.mode = 'preview';
  console.log('onSave')
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