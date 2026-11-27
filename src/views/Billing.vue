<template>
  <div class="max-w-screen-md mx-auto p-4 border-solid border-1 rounded border-gray-300">
    <div class="flex justify-between items-center mb-4 border-b-solid border-b-1 border-gray-300 p-b-2">
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
      <div v-if="data.next_cursor" @click="loadBilling">加载更多</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['params']),emit = defineEmits(['jump']);
const state = reactive({
  err:0,msg:'',data:{},list:[],
  cursor:{
    next_cursor:''
  }
}),{err,msg,data,list,cursor} = toRefs(state);
// 拉取账单
const loadBilling = (isFirst=false)=>{
  isFirst && (state.list = [],state.cursor.next_cursor = '');
  let {next_cursor} = state.cursor;
  apiFetch('wallet/billing',{cursor:next_cursor}).then(({data,...cursor})=>{
    state.cursor = cursor;
    data.forEach(is=>{
      let Findex = state.list.findIndex(it=>it.uuid == is.uuid);
      Findex == -1 && state.list.push(is);
    });
  }).catch(err=>{
    useMessage().error(err.message)
  })
}
// 刷新加载
const reFresh = ()=>{
  loadBilling(true)
}

//
onMounted(()=>{
    loadBilling()
});
</script>

<style>

</style>