<template>
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
</template>

<script setup>
const props = defineProps(['params']),emit = defineEmits(['jump']);
const state = reactive({
  err:0,msg:'',data:{},
  profile:{},
}),{err,msg,data,profile} = toRefs(state);
// 获取余额
const getBalance = ()=>{
  apiFetch('wallet/balance',{},true).then(res=>Object.assign(state,res))
}
// 刷新余额
const reFresh = ()=>{
  state.data = {}
  getBalance()
}
// 账户充值
const onCharge = ()=>{
  apiFetch('wallet/charge',{
    type:'alipay',
    amount:1000,
    remark:'账户充值'
  },true).then(res=>console.log(res))
  console.log('账户充值')
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