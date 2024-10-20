<template>
  <template v-if="err == 0">
    <div class="flex items-center justify-center h-screen-sm">
      <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
    </div>
  </template>
  <template v-if="err == 200">
  <div id="container" class="flex flex-row flex-wrap p-2 md:p-8">
    <div class="primary basis-full md:basis-3/4 lg:basis-4/5 xl:basis-4/6">
      <div id="player" class="aspect-video bg-slate-800 rounded">
        <video :src="data.href" :poster="useImage(data.poster,80)" class="w-full h-full" controls autoplay muted preload="auto" controlslist="nodownload"></video>
      </div>

      <h1 class="title">{{ data.title }}</h1>
      <div id="metadata" class="flex items-center justify-between">
        <div class="profile flex gap-2">
          <div class="avatar">
            <img :src="useImage(data.account?.avatar,'80')" alt="" class="w-12 h-12 rounded-full">
          </div>
          <div>
            <div class="name">{{ data.account?.name }}@{{ data.account?.user }}</div>
            <div class="keyword flex flex-wrap gap-2">
              <template v-for="(item,index) in data.keyword" :key="index">
                <router-link :to="`/video/search?label=${item}`" class="no-underline">
                  <div class="tag bg-true-gray-100 rounded px-2" @click="onLabel(item)">#{{ item }}</div>
                </router-link>
              </template>
            </div>
          </div>
        </div>
        <div class="contrl">
          <div v-copy="sharetext">点赞/分享</div>
        </div>
      </div>
      <div id="description" class="bg-true-gray-100 p-2 rounded-lg">
        <div>{{ data.view }} · {{data.created }}</div>
        <div class="description">{{ data.description }}</div>
      </div>
      <div id="discuss">
        <div class="comments">
          <YouDiscuss mode="video" :code="params.uuid">9999</YouDiscuss>
        </div>
      </div>
    </div>
    <div class="minor basis-full py-2 px-2 md:px-8 md:py-0 md:basis-1/4 lg:basis-1/5 xl:basis-2/6">
      <div class="label">
        <template v-for="(item,index) in label" :key="index">
          <div class="tag" @click="onLabel(item)">{{ item }}</div>
        </template>
      </div>
    </div>
  </div>
  </template>
  <template v-else>
    <div class="flex items-center justify-center h-screen-sm">
      <div class="font-size-2xl  w-40 h-40 color-gray-400">{{ msg }}</div>
    </div>
  </template>
</template>

<script setup>
const state = reactive({
  err:0,msg:'',data:{},params:{},query:{},
  uuid:'',
  title:'一口氣看完西班牙高分犯罪驚悚爽劇《紙鈔屋》（1～5季合集版）| 抓馬',
  description:'descriptiondescriptiondescription',
  label:['西班牙','悚爽劇','紙鈔屋'],
  index:0,
  account:{},
}),{err,msg,data,params,query} = toRefs(state),route = useRoute();

// 分享文本
const sharetext = computed(()=>{
  let {uuid,title} = state.data;
  return `视频：${title} \r\n网址：https://youloge.com/video/${uuid}`
})
const onLabel = (keyword)=>{
  
}
const getmetadata = ()=>{
  const {uuid} = state.params
  apiFetch('video/info',{uuid:uuid}).then((res)=>{
    console.log(res)
    Object.assign(state,res);
  })
}

onMounted(()=>{
  state.query = route.query;
  state.params = route.params;
  getmetadata()
  console.log(state)
})
</script>

<style>

</style>