<template>
  <div class="max-w-screen-md mx-auto p-4">
    <!-- 正文 -->
     <div>正文</div>
  </div>
</template>

<script setup>
const state = reactive({
  err:0,msg:'',data:{},list:[],
}),{err,msg,data,list} = toRefs(state);

//
onMounted(()=>{
    
})
</script>

<style>

</style>