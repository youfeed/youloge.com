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
            <input v-model="state.keyword" type="search" placeholder="搜索贴文"
                class="w-40 rounded-full border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 sm:w-56" />
            <button type="submit"
                class="rounded-full bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">搜索</button>
        </form>
    </header>
    <!-- 贴文列表 -->
    <div class="mx-auto mt-6 max-w-3xl px-4 sm:px-6 md:px-8">
        <div v-if="state.loading" class="py-16 text-center text-sm text-gray-400">加载中...</div>
        <div v-else-if="!state.list.length" class="py-16 text-center text-sm text-gray-400">暂无贴文</div>
        <div v-else class="flex flex-col gap-3">
            <article v-for="item in state.list" :key="item.uuid"
                class="rounded-lg border border-gray-200 bg-white p-4">
                <!-- 作者信息 -->
                <div class="mb-2 flex items-center gap-2">
                    <img :src="useImage(item.account?.avatar, '80')" alt="avatar"
                        class="h-8 w-8 rounded-full border border-gray-200" />
                    <router-link :to="`/${authorUser(item)}`"
                        class="text-sm font-semibold text-gray-900 no-underline hover:text-blue-600">
                        {{ item.account?.name ?? 'Youloge 用户' }}
                    </router-link>
                    <span class="text-xs text-gray-400">@{{ authorUser(item) }}</span>
                </div>
                <!-- 正文 -->
                <router-link :to="detailPath(item)" class="block text-gray-800 no-underline">
                    <div class="mb-2 text-base font-semibold">{{ item.title }}</div>
                    <p class="line-clamp-3 text-sm text-gray-600">{{ item.description }}</p>
                </router-link>
                <!-- 配图 -->
                <router-link v-if="item.poster" :to="detailPath(item)" class="mt-3 block">
                    <img :src="useImage(item.poster, 300)" :alt="item.title"
                        class="max-h-60 w-full rounded-md object-cover" />
                </router-link>
                <!-- 元数据 -->
                <div class="mt-3 flex items-center gap-4 text-xs text-gray-400">
                    <span>{{ useTimeago(item.created) }}</span>
                    <span>{{ useViews(item.views, '浏览') }}</span>
                </div>
            </article>
        </div>
    </div>
</template>
<script setup>
// 公共贴文页:顶部菜单栏(含搜索框) + 贴文列表
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
const detailPath = (item) => `/${item.user ?? item.account?.user ?? 'youloge'}/feed/${item.uuid}`;
// 作者用户名
const authorUser = (item) => item.user ?? item.account?.user ?? 'youloge';
// 加载贴文列表
const loadList = () => {
    state.loading = true;
    const q = route.query.q ?? '*';
    apiFetch('search/article', { q, offset: 0, limit: 20 }).then(({ hits = [] }) => {
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
