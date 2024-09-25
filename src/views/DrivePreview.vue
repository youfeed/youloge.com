<template>
  <template v-if="err == 0">
    <div class="flex items-center justify-center h-screen-sm">
      <div class="i-line-md:loading-twotone-loop font-size-2xl  w-40 h-40 color-gray-400"></div>
    </div>
  </template>
  <template v-if="err == 200">
    <div class="flex items-center justify-center h-screen-sm mt-5">
      <div class="head">
        <div class="">
          <img :src="useImage(data.account?.avatar,'80')" alt="">
        </div>
        <div>{{ data.account?.name }}@{{ data.account?.user }}</div>
      </div>
      <div class="body">
        <div>{{ data.title }}{{ data.ext }}</div>
        <div>
          {{ data.description }}
        </div>
        <div>{{ data.created }}-{{ data.updated }} #{{ data.cost }}RGB</div>
      </div>
      <div class="foot">
        <button @click="onDownload" class="border-0 px-1 py-2 bg-blue-500 text-white rounded-md hover:opacity-80 cursor-pointer">
          <div>立即下载</div>
          <div>购买后24小时内 无限制下载</div>
        </button>
      </div>
    </div>

    <div class="disscuss">
      <you-discuss mode="drive" uuid="1005"></you-discuss>
    </div>
  </template>
  <template v-else>
    <div class="flex items-center justify-center h-screen-sm">
      <div class="font-size-2xl  w-40 h-40 color-gray-400">{{ msg }}</div>
    </div>
  </template>
</template>
<script setup>

const useRouted = useRoute();
const state = reactive({
  uuid:useRouted.params.uuid,
  err:0,
  msg:'',
  data:{},
  metadata:{}
}),{err,msg,data,metadata,uuid} = toRefs(state);
const useImages = useImage("FrAPCSKUnNee1lhTMUnkWOgULZZ4",80);
console.log(useImages)
//
const getmetadata = ()=>{
  const {uuid} = state;
  apiFetch('drive/info',{uuid:uuid}).then(r=>r.json()).then(({err,msg,data})=>{
    Object.assign(state,{err,msg,data});
    console.log({err,msg,data})
  })
}
//
const onDownload = async ()=>{
  vipFetch('drive/download',{uuid:state.uuid}).then(r=>r.json()).then(r=>{
    console.log(r)
    
  })
  // const profile= await useAuth();
  // console.log(profile)
  // if(profile){
  // }
  // if(uuid == undefined){
  //   usePlus('login',{}).then(res=>{
  //     console.log('then',res)
  //   }).catch(err=>{
  //     console.log('then',res)
  //   })
  // }

}
onMounted(()=>{
  // const {uuid} = useRouted.params.uuid
  getmetadata();
})
// console.log(useRouted)

</script>

<style>

</style>