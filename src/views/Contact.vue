<template>
  <div class="max-w-screen-md mx-auto p-4">
    <!-- 正文 -->
     <div @click="navigateTo('index',{uuid:'123456'})">跳转到【index】子组件</div>
  </div>
</template>

<script setup>
const props = defineProps(['params']),emit = defineEmits(['jump']);
const state = reactive({
  err:0,msg:'',data:{},list:[],
}),{err,msg,data,list,profile} = toRefs(state);
//
const get = ()=>{
  let {next_cursor} = state.data;
  apiFetch('wallet/',{cursor:next_cursor}).then(res=>{
    state.list.push(...res.data.data);Object.assign(state,res);
  })
}
//
onMounted(()=>{
    
})
// 路由跳转(动态组件内部跳转)
const navigateTo = (path,params='')=>{
    emit('jump',path,params);
}
</script>

<style>

</style>