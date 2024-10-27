<template>
  <div @click="jumps">	home:()=>import('./console/Index.vue'),</div>
</template>

<script setup>
let params = defineProps({params:{type:Object}});const emit = defineEmits(['jump']);
console.log('emit',params)

const jumps = ()=>{
  emit('jump','article',{uuid:123})
}
</script>

<style>

</style>