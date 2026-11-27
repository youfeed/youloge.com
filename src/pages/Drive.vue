<template>
    <!-- 顶部菜单栏 -->
    <header
        class="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur-sm">
        <nav class="flex items-center gap-1 overflow-x-auto">
            <button v-for="item in state.tabs" :key="item.key" type="button"
                class="whitespace-nowrap rounded-md px-3 py-1.5 text-sm hover:bg-gray-100"
                :class="item.key === state.tab ? 'bg-blue-50 font-semibold text-blue-600' : 'text-gray-600'"
                @click="state.tab = item.key">
                {{ item.label }}
            </button>
        </nav>
        <form class="flex items-center gap-1" @submit.prevent="onSearch">
            <input v-model="state.keyword" type="search" placeholder="搜索云盘资源"
                class="w-40 rounded-full border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 sm:w-56" />
            <button type="submit"
                class="rounded-full bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">搜索</button>
        </form>
    </header>
    <!-- 云盘资源列表 -->
    <div class="mx-auto mt-8 max-w-3xl px-4 sm:px-6 md:px-8">
        <div v-if="state.loading" class="py-16 text-center text-sm text-gray-400">加载中...</div>
        <div v-else-if="!state.list.length" class="py-16 text-center text-sm text-gray-400">暂无资源</div>
        <div v-else class="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-md">
            <div v-for="item in state.list" :key="item.uuid"
                class="flex w-full items-center gap-3 border-b border-gray-200 py-4">
                <div class="h-12 w-12 shrink-0">
                    <img :src="useImage(item.poster, '80')" :alt="item.title" class="h-12 w-12 rounded-sm" />
                </div>
                <div class="min-w-0 flex-1">
                    <div class="line-clamp-1">
                        <router-link :to="detailPath(item)" class="text-gray-900">{{ item.title }}</router-link>
                    </div>
                    <div class="text-sm text-gray-500">{{ useBytes(item.size) }} · {{ item.mime }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
// 公共云盘页:顶部菜单栏(含搜索框) + 资源列表
const state = reactive({
    keyword: '',
    tab: 'all',
    tabs: [
        { key: 'all', label: '全部' },
        { key: 'doc', label: '文档' },
        { key: 'media', label: '影音' },
        { key: 'other', label: '其他' },
    ],
    list: [],
    loading: true,
}), { keyword, tab, tabs, list, loading } = toRefs(state);
const route = useRoute();
const router = useRouter();
// 详情页地址
const detailPath = (item) => `/${item.user ?? 'youloge'}/drive/${item.uuid}`;
// 加载资源列表
const loadList = () => {
    state.loading = true;
    const q = route.query.q ?? '*';
    apiFetch('search/drive', { q, offset: 0, limit: 20 }).then(({ hits = [] }) => {
        state.list = hits;
        state.loading = false;
    }).catch(() => {
        state.list = [];
        state.loading = false;
    });
};
// 提交搜索:写入 query 参数
const onSearch = () => {
    router.push({ path: route.path, query: state.keyword ? { q: state.keyword } : {} });
};
onMounted(() => {
    state.keyword = route.query.q ?? '';
    loadList();
});
watch(() => route.query.q, (q) => {
    state.keyword = q ?? '';
    loadList();
});
</script>
