<template>
  <template v-if="err == 0">
    <div class="flex items-center justify-center h-screen-sm">
      <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
    </div>
  </template>
  <template v-if="err == 200">
    <div class="p2">
      <div class="mx-auto mt-6 max-w-2xl border-solid border-1 rounded border-gray-300 p-2">
        <div class="head flex justify-between items-center border-b-solid border-b-1 border-gray-300 p-b-2">
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
              <div>
                <img :src="qrcode" alt="分享二维码" class="w-25 h-25 rounded-sm">
              </div>
              <div href="javescript:;" class="text-blue-500 underline" @click="onShare">分享链接</div>
            </div>
            <button @click="onDownload" class="border-0 px-1 py-2 bg-blue-500 text-white rounded-md hover:opacity-80 cursor-pointer">
              <div>立即下载(#{{ data.cost }}RGB)</div>
              <div>购买后24小时内 无限制下载</div>
            </button>
          </div>
        </div>
        
        <div class="foot flex justify-between items-center border-t-solid border-t-1 border-gray-300 p-t-2">
          <div>{{ data.etag }}</div>
          <div>{{ data.updated }}</div>
        </div>
      </div>
  
      <div class="mx-auto mt-6 max-w-2xl border-solid border-1 rounded border-gray-300 p-2">
        <you-discuss type="drive" :mode="uuid"></you-discuss>
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
import { onMounted, reactive,toRefs } from "vue";
const useRouted = useRoute();
const state = reactive({
  uuid:0,
  err:1,
  msg:'',
  data:{},
  metadata:{}
});

//
const loadMetadata = ()=>{
  const {uuid} = state;
  apiFetch('drive/info',{uuid:uuid}).then(res=>Object.assign(state,res))
}
//
const onDownload = async ()=>{
  let {uuid} = useAuth()
  vipFetch('drive/download',{uuid:state.uuid}).then(r=>{
    console.log(r)
  })
  //
   
  // usePlus('payment',{
  //   profile:uuid,
  //   money:200
  // }).then(res=>{
  //   console.log(res)
  // }).catch(err=>{

  // })
}
onMounted(()=>{
  console.log(20000)
  state.uuid =  useRouted.params.uuid
  const useImages = useImage("image/x-icon",360);
  console.log(useImages,state.uuid)
  // usePlus('captcha')
  loadMetadata();
})
// 计算二维码
const qrcode = computed(()=>{
  let {uuid} = state;
  let data = encodeURIComponent(`https://youloge.com/drive/${uuid}?u=qr`);
  return `https://qun.qq.com/qrcode/index?data=${data}`
})
// 复制分享文本
const onShare = (e)=>{
  let {clientX,clientY} = e;
  const addend = (txt,color)=>{
    let Fragment = document.createElement('div');
    Fragment.textContent = txt
    Fragment.setAttribute('style',`color: ${color};position: fixed;left:${clientX}px;top:${clientY}px;transform:translate(-50%,-50%);user-select: none;`);
    Fragment.animate([
      { transform: "translateY(0px)" },
      { transform: "translateY(-100px)" },
    ],{
      duration: 1000,
      iterations: 1,
    })
    document.body.appendChild(Fragment)
    setTimeout(()=>{Fragment.remove()},1000)
  };
  let {uuid,title,ext,size,mime,updated} = state.data;
  let text = [
    `文件：${title}${ext}`,
    `大小：${size}`,
    `类型：${mime}`,
    `时间：${updated}`,
    `地址：youloge.com/drive/${uuid}`
  ].join('\r\n');
  navigator.clipboard ? navigator.clipboard.writeText(text).then(res=>addend('复制成功','#4caf50')).catch(e=>addend('复制失败','#ffc107')) : addend('不支持复制','#ff9800');
}
console.log(useRouted)
const {err,msg,data,metadata,uuid} = toRefs(state);
</script>

<style>

</style>