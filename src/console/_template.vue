<template>
  <div>
    <!-- 正文 -->
     <div @click="navigateTo('index',{uuid:'123456'})">跳转到【index】子组件</div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';

const props = defineProps(['params']),emit = defineEmits(['jump']);
const state = reactive({}),{} = toRefs(state);
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