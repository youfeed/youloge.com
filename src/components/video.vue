<template>
  <div>
    <y-header aria="视频" aside="true"></y-header>
    <main class="video">
      <y-row>
        <y-col span="12">
          <div class="primary">
            <y-video :uuid="uuid"></y-video>
          </div>
          <div class="metadata">
            <div>{{ title }}</div>
            <div>{{ description }}</div>
          </div>
          <div class="disscus">
            <y-disscus :uuid="uuid"></y-disscus>
          </div>
        </y-col>
        <y-col span="12">
          <div class="facets">
            <y-label :data="keyword" @onChange="onLabel"></y-label>
          </div>
          <div class="feed">
            <template v-for="(item,index) in feed" :key="index">
              <div>{{ item.title }}</div>
            </template>
          </div>

        </y-col>
      </y-row>
    </main>
    <y-footer></y-footer>
  </div>
</template>

<script setup>
import { inject, onMounted, reactive, toRefs } from "vue";
const useFetch = inject('useFetch')
const state = reactive({ 
  uuid: "",
  title:'',
  description:'',
  profile:{},
  keyword:['开心','专业'],
  view:'',
  feed:[
    {
      uuid:'uuid',
      thum:'thum',
      title:'title',
      views:'123456',
      duration:'12354',
    }
  ],
});

onMounted(()=>{
  let query = new URL(location.href).searchParams,uuid = query.get('v') || '';
  state.uuid = uuid;getInfo();
})
const getInfo = ()=>{
  console.log(useFetch(),state)
  useFetch().api('video','info',{uuid:state.uuid}).then(({err,msg,data})=>{
    Object.assign(state,data);
    onLabel([])
    console.log(state)
  })
}
const onLabel = (label,offset=0)=>{
  console.log(label)
  useFetch().api('search','video',{q:'',label:label,offset:offset}).then(res=>{
    console.log(res)
  })
}
const getAbout = ()=>{}
const getdiscuss = ()=>{}
const {uuid,title,description,view,profile,keyword,feed} = toRefs(state)
</script>

<style lang="scss">
.video{
  // max-width: 600px;
  // margin: 40px auto;
  // font-family: math;
}
</style>