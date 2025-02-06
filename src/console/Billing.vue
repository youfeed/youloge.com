<template>
  <div class="max-w-screen-md mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <div>消费账单</div>
      <div @click="reFresh" class="i-tdesign-loading"></div>
    </div>
    <div>
      <template v-for="item in list" :key="item.id">
        <div class="mb-2 hover:bg-gray-100 hover:rounded-lg p-2">
          <div class="font-medium flex justify-between items-center">
            <div>{{item.remark}}</div>
            <div>
              <span v-text="item.oldest < item.latest ? '+' : '-' "></span>
              <span>{{ Math.abs(item.oldest - item.latest).toFixed(2)}}</span>
            </div>
          </div>
          <div class="text-sm text-dark-50 flex justify-between items-center">
            <div>{{ item.created }}</div>
            <div>{{ item.latest }}</div>
          </div>
        </div>
      </template>
      <div v-if="data.next_cursor" @click="getBilling">加载更多</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['params']),emit = defineEmits(['jump']);
const state = reactive({
  err:0,msg:'',data:{},list:[],
  profile:{},
}),{err,msg,data,list,profile} = toRefs(state);
// 拉取账单
const getBilling = ()=>{
  let {next_cursor} = state.data;
  apiFetch('wallet/billing',{cursor:next_cursor}).then(res=>{
    state.list.push(...res.data.data);Object.assign(state,res);
  })
}
// 刷新加载
const reFresh = ()=>{
  state.data.next_cursor = null;
  state.list = [];
  getBilling()
}

//
onMounted(()=>{
    getBilling()
})
// 路由跳转(动态组件内部跳转)
const navigateTo = (path,params='')=>{
    emit('jump',path,params);
}
</script>

<style>

</style>