<template>
  <header class="h-14 px-2 flex  items-center">
    <div class="w-full flex justify-between items-center h-10">
      <div class="left flex  items-center justify-start gap-2">
        <div class="w-6 h-6 border-gray-500 border border-solid rounded-md flex justify-center items-center">
          <div class="i-tdesign:view-list"></div>
        </div>
        <div class="flex justify-between items-center ">
          <router-link to="/" class="color-dark-500 no-underline px-2 py-1 rounded hover:bg-light-500 ">
            <div class="flex items-center gap-1" :title="name">
              <span class="i-tdesign:logo-github-filled"></span>
              <span>{{user}}</span>
            </div>
          </router-link>
          <div>/</div>
          <router-link to="/video" class="color-dark-500 no-underline font-bold px-2 py-1 rounded hover:bg-light-500 ">
            <div >Video</div>
          </router-link>
        </div>
      </div>
      <div class="search">
        <YouSearch v-model="search" @change="searchChange" @submit="searchSubmit" @click="searchClick"></YouSearch>
        <!-- <div>
          <form action="/video/search" method="get">
            <input type="search" name="q" placeholder="请输入视频ID" class="border rounded px-2 py-1"/>
          </form>
        </div> -->
      </div>
      <div>
        <div class="w-4 h-4">
          <div class="i-tdesign:add"></div>
        </div>
        <div class="w-4 h-4">
          <div class="i-tdesign:view-list"></div>
        </div>
      </div>
    </div>
  </header>
  <main class="columns">
    <router-view></router-view>
  </main>
  
</template>

<script setup>
import { onMounted, reactive, toRefs } from "vue";

const state = reactive({
  uuid:'',
  user:'',
  name:'',
  mail:'',
  search:{
    keyword:'',
    placeholder:'请输入视频ID',
    selectd:'video',
    options:[
      {label:'视频',value:'video'},
      {label:'文章',value:'article'},
      {label:'用户',value:'user'},
    ]
  }
}),{uuid,user,name,search} = toRefs(state)
/**
 * 做页头侧栏登录渲染
 */
const searchChange = (value)=>{
  console.log('searchChange',value)
}
const searchSubmit = (value)=>{
  console.log('searchSubmit',value)
}
const searchClick = (value)=>{
  console.log('searchClick',value)
}

onMounted(()=>{
  // const {uuid} = useAuth();
  // state.user = 'Youloge'
  // console.log(uuid,125215)

  // console.log('onMounted','vipFetch')
  // vipFetch('drive/info',{uuid:'uuid'}).then(r=>r.json()).then(({err,msg,data})=>{
  //   console.log('onMounted',err,msg,data)
    
  // })
})
</script>

<style>

</style>