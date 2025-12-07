<template>
	<template v-if="err == 0">
		<div class="flex items-center justify-center h-screen-sm">
			<div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
		</div>
	</template>
	<template v-else-if="err == 200">
		<div class="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
			<template v-for="item in list" :key="item.uuid">
				<div class="border-b my-4">
					<div class="flex items-center gap-2">
						<router-link :to="`/video/${item.uuid}`">
							<img :src="useImage(item.poster,120)" :alt="item.title">
						</router-link>
						<div class="flex-1">
							<div class="font-bold text-blue-400">
								<router-link :to="`/video/${item.uuid}`">
									{{ item.title }}
								</router-link>
							</div>
							<div>{{ useBytes(item.views) }}</div>
							<div>{{ item.description }}</div>
						</div>
					</div>
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
import useBytes from '../composables/useBytes';

const state = reactive({
	err: 0, msg: '', list: [], query: {},
	search: {
		q: '',
		offset: 0,
		limit: 20,
		estimatedTotalHits: 0
	},
}), { err, msg, list, query, search } = toRefs(state), route = useRoute();

const onSearch = (isfirst = false) => { 
	isfirst && (state.list = [],state.search.offset = 0,state.search.limit = 20);
	let { q, offset,limit } = state.search;
	apiFetch('search/video', {
		q: q ?? '*',
		offset: offset,
		limit: limit
	}).then(({hits,...search}) => {
		console.log(888,hits)
		state.search = search;
        hits.forEach(is=>{
            let index = state.list.findIndex(it=>it.uuid == is.uuid);
            index == -1 && state.list.push(is)
        })
	}).catch(err => {
		console.log(888,err)
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