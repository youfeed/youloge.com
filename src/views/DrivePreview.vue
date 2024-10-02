<template>
  <template v-if="err == 0">
    <div class="flex items-center justify-center h-screen-sm">
      <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
    </div>
  </template>
  <template v-if="err == 200">
    <div class="mx-auto mt-6 max-w-lg border-solid border-1 p-2">
      <div class="head flex justify-between items-center border-b-solid border-b-1">
        <div class="flex items-center gap-1">
          <img :src="useImage(data.account?.avatar,'80')" alt="" class="w-4 h-4 rounded-full">
          <span>{{ data.account?.name }}@{{ data.account?.user }}</span>
        </div>
        <div>{{ data.created }}</div>
      </div>
      <div class="body p-2">

        <div class="flex items-start gap-2">
          <div>
            <img :src="useImage(`mime/${data.mime}`,'80')" alt=""  class="w-12 h-12 rounded-sm">
          </div>
          <div>
            <div class="text-2xl">{{ data.title }}<span class="uppercase">{{ data.ext }}</span></div>
            <div>{{ data.size }} · {{ data.mime }} · </div>
          </div>
        </div>
        
        <div>
          <div class="bg-gray-100 p-2 rounded" v-if="data.description">
            {{ data.description }}
          </div>
        </div>
        
        <div class="do flex justify-between items-center text-center w-full mx-auto mt-4">
          <div>
            <div></div>
            <div>分享链接</div>
          </div>
          <button @click="onDownload" class="border-0 px-1 py-2 bg-blue-500 text-white rounded-md hover:opacity-80 cursor-pointer">
            <div>立即下载(#{{ data.cost }}RGB)</div>
            <div>购买后24小时内 无限制下载</div>
          </button>
        </div>
      </div>
      
      <div class="foot flex justify-between items-center border-t-solid border-t-1">
        <div>{{ data.etag }}</div>
        <div>{{ data.updated }}</div>
      </div>
    </div>

    <div class="discuss mx-auto mt-6 max-w-lg border-solid border-1 p-2">
      <you-discuss type="drive" mode="1000"></you-discuss>
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
  uuid:0,
  err:0,
  msg:'',
  data:{},
  metadata:{}
}),{err,msg,data,metadata,uuid} = toRefs(state);

const useImages = useImage("image/x-icon",360);
console.log(useImages)
//
const loadMetadata = ()=>{
  const {uuid} = state;
  apiFetch('drive/info',{uuid:uuid}).then(r=>r.json()).then(res=>Object.assign(state,res))
}
//
const onDownload = async ()=>{
  let {uuid} = useAuth()
  // vipFetch('drive/download',{uuid:state.uuid}).then(r=>r.json()).then(r=>{
  //   console.log(r)
  // })
  //
   
  usePlus('payment',{
    account:uuid,
    money:200
  }).then(res=>{
    console.log(res)
  }).catch(err=>{

  })
}
onMounted(()=>{
  state.uuid =  useRouted.params.uuid
  loadMetadata();
})
// console.log(useRouted)
</script>

<style>

</style>