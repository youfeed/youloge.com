<template>
  <div id="container" class="flex flex-row flex-wrap p-2 md:p-8">
    <div class="primary basis-full sm:basis-2/3 md:basis-3/4 lg:basis-4/5 xl:basis-5/6">
      <div id="player" class="aspect-video bg-slate-800">
        
      </div>
      <div id="metadata">
        <div class="title"></div>
        <div class="profile"></div>
        <div class="description"></div>
      </div>
      <div id="discuss">
        <div>
          <div><i class="i-tdesign:chat-message"></i>95</div>
        </div>
        
        <div class="comments">
          <YouDiscuss mode="video" uuid="100">9999</YouDiscuss>
          <div class="review">
            <div class="left avatar"></div>
            <div class="right">
              <div>
                <div class="profile"></div>
                <div class="content"></div>
                <div class="toolbar"></div>
              </div>
              <div class="reply">
                <div class="left avatar"></div>
                <div class="right">
                  <div>
                    <div class="profile"></div>
                    <div class="content"></div>
                    <div class="toolbar"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      </div>
    </div>
    <div class="minor basis-full py-2 px-2 md:px-8 md:py-0 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
      <div class="label">
        <template v-for="(item,index) in label" :key="index">
          <div class="tag" @click="onLabel(item)">{{ item }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive,toRefs } from "vue";
import { useRoute } from "vue-router";
const useRouted = useRoute();
const props = defineProps({})
const state = reactive({
  uuid:'',
  title:'一口氣看完西班牙高分犯罪驚悚爽劇《紙鈔屋》（1～5季合集版）| 抓馬',
  description:'descriptiondescriptiondescription',
  label:['西班牙','悚爽劇','紙鈔屋'],
  index:0,
  account:{},
  search:{
    limit:0,
    offset:0,
    count:0,
    data:[]
  }
});const {title,description,label} = toRefs(state)

const onLabel = (keyword)=>{
  
}
const getmetadata = ()=>{
  const {uuid} = useRouted.params;
  apiFetch('video/info',{uuid:uuid}).then((res)=>{})
}

onMounted(()=>{
  getmetadata()
  console.log(useRouted)
})
</script>

<style>

</style>