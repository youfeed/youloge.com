<template>
  <header>
    <div>
      <div>Youloga</div>
      <form action="search" >
        <input type="search" name="q" v-model="q" placeholder="搜索一下">
        <input type="submit" value="搜索">
        <input type="radio" name="type" value="video" v-model="type">视频
        <input type="radio" name="type" value="article" v-model="type">文章
        <input type="radio" name="type" value="music" v-model="type">音乐
      </form>
    </div>
  </header>
  <main b b-gray w-30 h-10>
    <div class="left">
      <div v-for="(item,index) in list" :key="index">

      </div>
    </div>
    <div class="right"></div>
    indexss
  </main>
  <footer ref="ref">
    <div>@2024</div>
    <div>开发接口</div>
  </footer>
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