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
            <input v-model="state.keyword" type="search" placeholder="搜索商品"
                class="w-40 rounded-full border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 sm:w-56" />
            <button type="submit"
                class="rounded-full bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">搜索</button>
        </form>
    </header>
    <!-- 商品列表 -->
    <div class="mx-auto mt-8 max-w-5xl px-4 sm:px-6 md:px-8">
        <div v-if="state.loading" class="py-16 text-center text-sm text-gray-400">加载中...</div>
        <div v-else-if="!state.list.length" class="py-16 text-center text-sm text-gray-400">暂无商品</div>
        <div v-else
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            <div v-for="item in state.list" :key="item.uuid" class="goods-card group rounded-lg border border-gray-200">
                <router-link :to="detailPath(item)">
                    <div class="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                        <img :src="useImage(item.poster, 300)" :alt="item.title"
                            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                </router-link>
                <div class="p-3">
                    <router-link :to="detailPath(item)" class="line-clamp-2 font-medium group-hover:text-blue-600">
                        {{ item.title }}
                    </router-link>
                    <div class="mt-1 text-sm text-red-500"># {{ item.amount }} RGB</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
// 公共商品页:顶部菜单栏(含搜索框) + 商品列表
const state = reactive({
    keyword: '',
    tab: 'all',
    tabs: [
        { key: 'all', label: '全部' },
        { key: 'digital', label: '数码' },
        { key: 'life', label: '生活' },
    ],
    list: [],
    loading: true,
}), { keyword, tab, tabs, list, loading } = toRefs(state);
const route = useRoute();
const router = useRouter();
// 详情页地址
const detailPath = (item) => `/${item.user ?? 'youloge'}/goods/${item.uuid}`;
// 加载商品列表
const loadList = () => {
    state.loading = true;
    const q = route.query.q ?? '*';
    apiFetch('search/goods', { q, offset: 0, limit: 20 }).then(({ hits = [] }) => {
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
