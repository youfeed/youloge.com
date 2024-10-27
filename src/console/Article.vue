<template>
  <div @click="jumps">\

    ArticleArticleArticle
  </div>
</template>

<script setup>
let params = defineProps({params:{type:Object}});const emit = defineEmits(['jump']);
console.log('emit',params)

const jumps = ()=>{
  emit('jump','index',{uuid:123})
}
</script>

<style>

</style>