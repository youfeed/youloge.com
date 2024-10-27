<template>
  <div>
    <div>
      退出登录成功
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['params']),emit = defineEmits(['jump']);
const state = reactive({}),{} = toRefs(state);
//
onMounted(()=>{
  localStorage.removeItem('profile');
})
// 路由跳转(动态组件内部跳转)
const navigateTo = (path,params='')=>{
    emit('jump',path,params);
}
</script>

<style>

</style>