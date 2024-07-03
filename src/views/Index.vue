<template>
  <main h-100vh flex flex-col justify-center flex-items-center>
    <h1>杰克布达</h1>
    <a href="https://beian.miit.gov.cn/">
      <p>ICP备案主体信息 ICP备案/许可证号：皖ICP备19004549号</p>
      <p>ICP备案服务信息 ICP备案/许可证号：皖ICP备19004549号-2</p>
    </a>
    <p>皖公安备 34112402000344</p>
  </main>
</template>
<script setup>
import { onMounted,inject, reactive,toRefs } from "vue"
import {apiFetch} from "@/util"

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    onSearch();
  }
}, {
  threshold: 0
});
const state = reactive({
  ref:null,
  q:'',
  inde:'',
  type:'video',
  name: 'index',
  count:0,
  list:[]
})
// 
onMounted(()=>{
  observer.observe(state.ref)
})
// 初始搜索
const onSearch = ()=>{
  apiFetch('search/video').then(res=>{
    state.count = res.count
    state.list = res.data
    console.log('res')
  })
}

const {q,ref,count,list} = toRefs(state)
</script>

<style>

</style>