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
            <input v-model="state.keyword" type="search" placeholder="搜索视频"
                class="w-40 rounded-full border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 sm:w-56" />
            <button type="submit"
                class="rounded-full bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">搜索</button>
        </form>
    </header>
    <!-- 视频宫格 -->
    <div class="m-2 sm:m-4 md:m-8">
        <div v-if="state.loading" class="py-16 text-center text-sm text-gray-400">加载中...</div>
        <div v-else-if="!state.list.length" class="py-16 text-center text-sm text-gray-400">暂无视频</div>
        <div v-else
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            <div v-for="item in state.list" :key="item.uuid" class="video-card group">
                <router-link :to="detailPath(item)">
                    <div class="relative mb-3 aspect-video overflow-hidden rounded-lg bg-gray-100">
                        <img :src="useImage(item.poster, 150)" :alt="item.title"
                            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                </router-link>
                <router-link :to="detailPath(item)"
                    class="mb-1 line-clamp-2 font-medium group-hover:text-blue-600">{{ item.title }}</router-link>
                <div class="flex items-center text-sm text-gray-500">
                    <span class="line-clamp-1">{{ authorName(item) }}</span>
                    <span class="mx-2">•</span>
                    <span>{{ item.views }}次观看</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
// 公共视频页:顶部菜单栏(含搜索框) + 视频宫格
const state = reactive({
    keyword: '',
    tab: 'all',
    tabs: [
        { key: 'all', label: '推荐' },
        { key: 'new', label: '最新' },
        { key: 'hot', label: '热门' },
    ],
    list: [],
    loading: true,
}), { keyword, tab, tabs, list, loading } = toRefs(state);
const route = useRoute();
const router = useRouter();
// 详情页地址
const detailPath = (item) => `/${item.user ?? item.account?.user ?? 'youloge'}/video/${item.uuid}`;
// 作者昵称
const authorName = (item) => item.account?.name ?? '';
// 加载视频列表
const loadList = () => {
    state.loading = true;
    const q = route.query.q ?? '*';
    apiFetch('search/video', { q, offset: 0, limit: 20 }).then(({ hits = [] }) => {
        state.list = hits;
        state.loading = false;
    }).catch(() => {
        state.list = [];
        state.loading = false;
    });
};
// 提交搜索:写入 query 参数,由页面内部处理列表
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
