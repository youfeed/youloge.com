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
            <router-link :to="`/${data.account.user}`" class="w-40 truncate text-current decoration-none hover:opacity-80">
              <span>{{ data.account?.name }}@{{ data.account?.user }}</span>
            </router-link>
          </div>
          <div class="text-gray-600">{{ data.created }}</div>
        </div>
        <div class="body p-2">
  
          <div class="flex items-start gap-2">
            <div>
              <img :src="useImage(`mime/${data.mime}`,'80')" alt=""  class="w-12 h-12 rounded-sm">
            </div>
            <div>
              <div class="text-2xl">{{ data.title }}</div>
              <div class="text-sm text-gray-700">{{ useBytes(data.size) }} · {{ data.mime }}</div>
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
              <div class="text-blue-500 cursor-pointer hover:opacity-80" v-copy="onShare">复制分享文件</div>
            </div>
            <button v-login:click="onDownload" v-ripple class="border-0 px-1 py-2 bg-blue-500 text-white rounded-md hover:opacity-80 cursor-pointer">
              <div>立即下载(#{{ data.cost }}RGB)</div>
              <div>购买后24小时内 无限制下载</div>
            </button>
          </div>
        </div>
        
        <div class="foot flex justify-between items-center border-t-solid border-t-1 text-gray-600 border-gray-300 p-t-2">
          <div>{{ data.etag }}</div>
          <div>{{ data.updated }}</div>
        </div>
      </div>
  
      <div class="mx-auto mt-6 max-w-2xl border-solid border-1 rounded border-gray-300 p-2">
        <you-discuss mode="drive" :code="uuid"></you-discuss>
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
const youPlus = YouPlus({
  // debug:'http://localhost:4173/'
})
const route = useRoute();
const { success, warning, error, info } = useMessage();

const state = reactive({
  uuid:0,
  err:0,
  msg:'',
  data:{},
  qrcode:'',
  metadata:{}
}),{err,msg,data,qrcode,metadata,uuid} = toRefs(state);
//
const loadMetadata = ()=>{
  const {uuid} = state;
  // apiBatch('drive/info',[{uuid:uuid},{uuid:uuid}]).then(data=>{
  apiFetch('drive/info',{uuid:uuid}).then(data=>{
    state.err = 200;
    state.data = data;
    console.log(6666,data);
    // Object.assign(state,res)
  }).catch((err)=>{
    console.log(7777,err)
    Object.assign(state,err)
  });
}
// 购买权限
const onBuyDrive = ()=>{
  const {uuid} = state;
  youPlus.usePayment({
    local:'123456',
    attach:'',
    notify:'https://test.youloge.com/drive/notify',
    payer:{
      uuid:useAuth().uuid,
    },
    payee:{
      uuid:uuid,
      type:'drive',
    }
  }).then(res=>{
    console.log(res)
    success('购买成功');
    onDownload();
  }).catch(err=>{
    error(err.msg)
  })
}
// 请求下载地址
const onDownload = ()=>{
    let load = useLoading()
    apiFetch('drive/download',{uuid:state.uuid}).then(res=>{
      console.log(res)
      // 原生下载资源
      let a = document.createElement('a');document.body.appendChild(a);
      a.href = res.data.link;a.click();a.remove();
    }).catch(err=>{
      onBuyDrive();
      info(err.msg);
      info('使用余额快捷购买');
      info('购买后24小时内无限制下载');
      console.log('err',err)
    }).finally(e=>{
      load.hide();
    });
  
}
onMounted(()=>{
  console.log(20000)  
  state.uuid =  route.params.uuid
  const useImages = useImage("image/x-icon",360);
  console.log(useImages,state.uuid)
  // usePlus('captcha')
  loadMetadata();
  // 生成二维码
  useQrcode(`https://youloge.com/drive/${state.uuid}?from=`).then(canvas=>{
    canvas.toBlob((blob)=>{
      var file = new Blob([blob], {type: "image/png;charset=utf-8"});
      var src = URL.createObjectURL(file);
      state.qrcode = src;///URL.revokeObjectURL(src);
    },"image/png", 0.95)
  })
})

// 复制分享文本
const onShare = (e)=>{
  let {uuid,title,ext,size,mime,updated} = state.data;
  let text = [
    `文件：${title}${ext}`,
    `大小：${useBytes(size)}`,
    `类型：${mime}`,
    `时间：${updated}`,
    `地址：youloge.com/drive/${uuid}`
  ].join('\r\n');
  return text;
};
</script>

<style>

</style>