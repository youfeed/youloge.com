<template>
    <template v-if="err == 0">
        <div class="flex items-center justify-center h-screen-sm">
            <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
        </div>
    </template>
    <template v-if="err == 200">
        <div class="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
            <template v-for="item in list" :key="item.uuid">
                <div class="border-b my-4">
                    <div class="flex items-start gap-2">
                        <div class="flex-1">
                            <router-link :to="`/article/${item.uuid}`">
                                <div class="font-bold text-blue-400">{{ item.title }}</div>
                            </router-link>
                            <div class="line-clamp-2">{{ item.description }}</div>
                        </div>
                        <div v-if="item.poster" class="mr-2 w-14 h-14">
                            <img :src="useImage(item.poster, '120')" :alt="item.title" class="rounded-sm w-14 h-14">
                        </div>
                    </div>
                    <div class="flex items-center justify-between gap-2">
                        <div>{{ useTimeago(item.created) }} · {{ item.views }} 次浏览</div>
                        <div class="flex items-center gap-2">
                            <template v-for="keyword in item.keywords" :key="keyword">
                                <router-link :to="`/article/search?q=${keyword}`" class="bg-gray-100 rounded-sm px-2 py-1">
                                    <div>#{{ keyword }}</div>
                                </router-link>
                            </template>
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
const state = reactive({
    err: 200, msg: '',
    query: {}, list: [],
    search: {
        q: '',
        offset: 0,
        limit: 20,
        estimatedTotalHits: 0
    }
}), { err, msg, query, search, list } = toRefs(state), route = useRoute();
// 触发查询
const onSearch = (isClern = false) => {
    isClern && (state.search.offset = 0, state.search.limit = 20);
    let { q, offset, limit } = state.search;
    apiFetch('search/article', { q: q, offset: offset, limit: limit }).then(({ hits, ...search }) => {
        state.search = search;
        hits.forEach(is => {
            let findIndex = state.list.findIndex(it => it.uuid == is.uuid);
            findIndex == -1 && state.list.push(is)
        });
    }).catch((err) => {
        useMessage().error(err.message);
    });
}

onMounted(() => {
    state.query = route.query;
    state.search.q = state.query.q
    console.log(state.query)
    onSearch(true);
})
</script>

<style></style>