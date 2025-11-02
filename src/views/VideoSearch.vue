<template>
	<template v-if="err == 0">
		<div class="flex items-center justify-center h-screen-sm">
			<div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
		</div>
	</template>
	<template v-if="err == 200">
		<div class="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
			<template v-for="item in list" :key="item.uuid">
				<div>
					<div>{{ item }}</div>
				</div>
			</template>
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
	err: 0, msg: '', list: {}, query: {},
	search: {
		q: '1',
		offset: 0,
		limit: 20,
		estimatedTotalHits: 0
	},
}), { err, msg, list, query, cursor, search } = toRefs(state), route = useRoute();

const onSearch = (isfirst = false) => {
	isfirst && (state.list = [],state.search.offset = 0,state.search.limit = 20);
	let { q, offset,limit } = state.search;
	apiFetch('search/video', {
		q: q,
		offset: offset,
		limit: limit
	}).then(({hits,...search}) => {
		state.search = search;
        hits.forEach(is=>{
            let findIndex = state.list.findIndex(it=>it.uuid == is.uuid);
            findIndex == -1 && state.list.push(is)
        })
	}).catch(err => {
		state.err = err.code;
		useMessage().error(err.message)
	});
}
// 
onMounted(() => {
	state.query = route.query;
	state.search.q = route.query.q;
	onSearch();
	state.err = 200;
});
</script>

<style></style>