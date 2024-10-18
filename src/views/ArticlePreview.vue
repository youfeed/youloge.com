<!-- 文章预览 -->
<template>
  <template v-if="err == 0"></template>
  <template v-if="err == 200">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="navbar"></div>
      <div class="article">
        <div class="title">
          <h1>{{ data.title }}</h1>
        </div>
        <div class="meta m-b-5">
          {{ data.account.name }} · {{ data.created }}
        </div>
        <div class="rich" v-html="html"></div>
        <div class="m-t-5">
          {{ data.updated }}
        </div>
        <div class="discuss m-t-5">
          <you-discuss type="article" :mode="uuid"></you-discuss>
        </div>
      </div>
      <div class="asider"></div>
    </div>
  </template>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute()

const state = reactive({
  uuid:'',
  err:0,
  msg:'',
  count:0,
  html:'',
  data:{},
  cursor:Number.MAX_SAFE_INTEGER,
}),{uuid,err,msg,html,data} = toRefs(state);
// 获取数据
const getInfo = ()=>{
  let {uuid} = state;
  apiFetch('article/info',{uuid:uuid}).then(r=>r.json()).then(res=>{
    Object.assign(state,res);
    res.err == 200 && getRich();
  }).catch((err)=>{})
}
// 获取内容
const getRich = ()=>{
  let {rich} = state.data;
  fetch(rich).then(r=>r.text()).then(text=>{
    state.html = text;

    // console.log(text)
  })
}

onMounted(()=>{
  state.uuid = route.params.uuid;
  getInfo();
  // getRich();
  console.log(route);
})
</script>

<style>

</style>