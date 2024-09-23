<template>
  <div id="container" class="flex flex-row flex-wrap p-2 md:p-8">
    <div class="primary basis-full sm:basis-2/3 md:basis-3/4 lg:basis-4/5 xl:basis-5/6">
      <div id="player" class="aspect-video bg-slate-800">
        
      </div>
      <div id="metadata">
        
      </div>
      <div id="discuss"></div>
    </div>
    <div class="minor basis-full py-2 px-2 md:px-8 md:py-0 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">columns</div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { apiFetch,useImage,useViews,useDuration,useTimeago } from "@/util"
const useRouted = useRoute();
const props = defineProps({})

const getmetadata = ()=>{
  const {uuid} = useRouted.params;
  apiFetch('video/info',{uuid:uuid}).then((res)=>{})
}

onMounted(()=>{
  getmetadata()
  console.log(useRouted)
})
</script>

<style>

</style>