<template>
    <template v-if="err == 0">
        <div class="flex items-center justify-center h-screen-sm">
            <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
        </div>
    </template>
    <template v-if="err == 200">
        <div class="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 mt-10">
            <div class="block md:hidden">
                <div class="max-w-full">
                    <form action="/drive/search" method="get" class="relative">
                        <input type="search" name="q" v-model="query.q" placeholder="搜索云盘资源" class="border rounded px-4 py-2 w-full"/>
                        <button type="submit" class="absolute top-2 right-1 border-0 outline-0 bg-transparent">
                            <YouIcon name="mdi-light:magnify"></YouIcon>
                            搜索
                        </button>
                    </form>
                </div>
            </div>
            <div>约有 1 条结果</div>
            <div class="lists border-gray-200 border-1 mt-5">
                <template v-for="item in list" :key="item.uuid">
                    <div v-ripple
                        class="list border-b-1 border-gray-200 p-4 border-width-1 border-style-solid rounded-sm">
                        <router-link :to="`/drive/${item.uuid}`"
                            class="text-current decoration-none flex items-center justify-between  hover:opacity-80 hover:text-blue-500">
                            <div class="max-w-3/5 truncate">{{ item.title }}<sup>{{ item.ext }}</sup></div>
                            <div class="text-red-4"><sub>#</sub> {{ item.cost }} RGB</div>
                        </router-link>
                        <div class="text-sm text-gray-800">{{ item.description }}</div>
                        <div class="text-sm text-gray-800">
                            {{ useTimeago(item.created) }} - {{ useBytes(item.size) }} - {{ item.mime }}
                        </div>
                        <div title="keywords">
                            <span v-for="tag in item.keywords" :key="tag">#{{ tag }} </span>
                        </div>
                    </div>
                </template>
            </div>
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
    err: 0, msg: '', data: {},
    list: [], query: {}, cursor: 0, limit: 20,
    search: {
        q: '',
        offset: 0,
        limit: 20,
        estimatedTotalHits: 0
    }
}), { err, msg, data, list, query, search } = toRefs(state), route = useRoute();
// 触发搜索
const onSearch = (isClern= false) => {
    isClern && (state.list = [],state.search.offset = 0,state.search.limit = 20);
    let { q, offset,limit } = state.search;
    apiFetch('search/drive', { q: q, offset: offset, limit: limit }).then(({hits,...search}) => {
        state.search = search;
        hits.forEach(is=>{
            let findIndex = state.list.findIndex(it=>it.uuid == is.uuid);
            findIndex == -1 && state.list.push(is)
        })
    }).catch((err) => {
        useMessage().error(err.message)
    });
}

//
onMounted(() => {
    state.query = route.query;
    state.search.q = route.query.q;
    onSearch();
    state.err = 200
})
</script>

<style>
input[type="search"]::-webkit-search-cancel-button {
    appearance:none 
}
</style>