<template>
  <div>
    <div class="flex items-center justify-center h-screen-sm">
      <div class="font-size-2xl  w-40 h-40 color-gray-400" @click="jumps">455</div>
    </div>
  </div>
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