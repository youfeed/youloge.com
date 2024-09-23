<template>
  IndexConsole.vue
</template>

<script setup>
import { reactive,onMounted } from 'vue'
import { useAuth,usePlus } from '@/util'

const state = reactive({});

onMounted(()=>{
  usePlus('captcha',{}).then(res=>{
    console.log('then',res)
  }).catch(err=>{
    console.log('catch',err)
  })
  console.log('useAuth',useAuth())
})

</script>

<style>

</style>