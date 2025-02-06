<template>
    <div>
        <div class="max-w-screen-md mx-auto p-4 border-solid border-1 rounded border-gray-300">
          <div class="flex justify-between items-center mb-4 border-b-solid border-b-1 border-gray-300 p-b-2">
            <div>我的钱包</div>
            <div @click="reFresh" class="i-tdesign-loading"></div>
          </div>
          <div>
              <div class="flex justify-between items-center mb-4">
                <div>余额</div>
                <div class="text-xl font-bold">#{{data.amount}} RGB</div>
              </div>
              <div class="flex justify-between items-center mb-4">
                <div>猫币</div>
                <div class="text-xl font-bold">{{data.catcoin}}</div>
              </div>
              <div class="flex justify-between items-center mb-4">
                <div>积分</div>
                <div class="text-xl font-bold">{{data.integral}}</div>
              </div>
            </div>
            <div class="foot flex justify-between items-center border-t-solid border-t-1 border-gray-300 p-t-2">
              <div>海外账户·大额充值</div>
              <button class="bg-blue-600 text-white rounded border-current px-2 py-1 border-none pointer" @click="onCharge">账户充值</button>
            </div>
        </div>
        <!-- 支付抽屉 -->
         <you-drawer v-model:visible="state.visible" title="账户充值" confirm="充值下单" size="mini" @confirm="onConfirm">
           <div class="p-4">
             <div class="text-xl font-bold">充值金额：<span class="text-red-500">￥100</span></div>
             <button>30RGB</button>
             <button>30RGB</button>
             <button>30RGB</button>
             <div class="text-xl font-bold">充值方式：<span class="text-red-500">支付宝</span></div>
             <div class="text-gray-600">充值金额：</div>
             <div class="text-gray-600">充值方式：支付宝</div>
             <div class="text-gray-600">
               充值说明：
             </div>
           </div>
         </you-drawer>
    </div>
</template>

<script setup>
const props = defineProps(['params']),emit = defineEmits(['jump']);
const state = reactive({
  err:0,msg:'',data:{}, 
  profile:{},visible:true
}),{err,msg,data,profile} = toRefs(state);
// 获取余额
const getBalance = ()=>{
  apiFetch('wallet/balance',{}).then(res=>Object.assign(state,res))
}
// 刷新余额
const reFresh = ()=>{
  state.data = {}
  getBalance()
}
// 账户充值
const onCharge = ()=>{
  console.log('账户充值',state.visible)
  state.visible = true;
  

    
    
  
  //
  //
  console.log('账户充值')
}
// 确认下单
const onConfirm = ()=>{
  apiFetch('wallet/charge',{
    type:'alipay',
    money:'100',
    remark:'账户充值'
  }).then(res=>{
    console.log(res)
    showQrcode(res.data.href)
  })
  console.log('确认下单')
}
// 显示支付
const showQrcode = (href)=>{
    let data = encodeURIComponent(href);
    useDialog({
      title:'账户充值',
      content:`<div><img src="https://qun.qq.com/qrcode/index?data=${data}"/></div>`,
      confirm:'我已充值',
    }).then(res=>{
      getBalance()
      console.log(res)
    }).catch(err=>{
      console.log(err)
    })
}

onMounted(()=>{
    state.profile = useAuth();
    getBalance();
})
// 路由跳转(动态组件内部跳转)
const navigateTo = (path,params='')=>{
    emit('jump',path,params);
}
</script>

<style>

</style>