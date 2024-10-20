<template>
	<template v-if="err == 0">
		<div class="flex items-center justify-center h-screen-sm">
			<div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
		</div>
	</template>
	<template v-if="err == 200">
		<div class="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
			
		</div>
	</template>
	<template v-else>
		<div class="flex items-center justify-center h-screen-sm">
			<div class="font-size-2xl  w-40 h-40 color-gray-400">{{ msg }}</div>
		</div>
	</template>
</template>

<script setup>
const state = reactive({
  err:0,msg:'',data:{},query:{},cursor:0,limit:20,
}),{err,msg,data,query,cursor,limit} = toRefs(state),route = useRoute();

const onSearch = (isfirst = false)=>{
  let {query,cursor} = state;
  apiFetch('search/video',{
		q:query.q,
		label:query.label,
		cursor:cursor
	}).then(res=>Object.assign(state,res)).catch((err)=>{
    console.log('err',state,err)
  });
}
// 
onMounted(()=>{
  state.query = route.query;
  console.log('22-route',state.query);
  console.log(route);
  onSearch();
});
</script>

<style>

</style>