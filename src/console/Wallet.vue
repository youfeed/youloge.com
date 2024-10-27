<template>
  <div class="max-w-screen-md mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <div>我的钱包</div>
      <div @click="getBalance" class="i-tdesign-loading"></div>
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
//
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