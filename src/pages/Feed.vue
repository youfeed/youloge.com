<template>
    <!-- 公共贴文页:discuss/feed 列表 + 本地排序与搜索 -->
    <div>
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
            <!-- 加载错误 -->
            <div v-if="error"
                class="mb-4 flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span>{{ error }}</span>
                <button type="button" class="shrink-0 rounded-md border border-red-300 px-3 py-1 hover:bg-red-100"
                    @click="loadList(true)">重试</button>
            </div>
            <!-- 首次加载骨架 -->
            <div v-if="loading && !loaded" class="space-y-3">
                <div v-for="n in 4" :key="n" class="h-32 animate-pulse rounded-lg bg-gray-100"></div>
            </div>
            <!-- 空状态 -->
            <div v-else-if="!visibleList.length && !error" class="py-16 text-center text-sm text-gray-400">
                {{ keyword ? '没有匹配的贴文' : '暂无贴文' }}
            </div>
            <div v-else-if="!visibleList.length && error" class="py-16 text-center text-sm text-gray-400">
                贴文加载失败，请点击上方重试
            </div>
            <!-- 列表 -->
            <div v-else class="flex flex-col gap-3">
                <article v-for="item in visibleList" :key="item.uuid"
                    class="rounded-lg border border-gray-200 bg-white p-4">
                    <!-- 作者信息 -->
                    <div class="mb-3 flex items-center gap-2">
                        <img :src="useImage(item.account?.avatar, '80')" alt="avatar"
                            class="h-8 w-8 rounded-full border border-gray-200" />
                        <router-link :to="`/${authorUser(item)}`"
                            class="text-sm font-semibold text-gray-900 no-underline hover:text-blue-600">
                            {{ item.account?.name ?? 'Youloge 用户' }}
                        </router-link>
                        <span class="text-xs text-gray-400">@{{ authorUser(item) }}</span>
                        <span v-if="locationText(item)" class="ml-auto text-xs text-gray-400">
                            {{ locationText(item) }}
                        </span>
                    </div>
                    <!-- 正文 -->
                    <router-link :to="detailPath(item)" class="block whitespace-pre-wrap text-sm leading-relaxed text-gray-700 no-underline hover:text-gray-900">
                        {{ contentText(item) }}
                    </router-link>
                    <!-- 配图 -->
                    <div v-if="materialList(item).length" class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <router-link v-for="(src, index) in materialList(item)" :key="index" :to="imagePath(item, index)"
                            class="block overflow-hidden rounded-md">
                            <img :src="useImage(src, 300)" :alt="`贴文图片 ${index + 1}`"
                                class="h-32 w-full object-cover" />
                        </router-link>
                    </div>
                    <!-- 元数据 -->
                    <div class="mt-3 flex items-center gap-4 text-xs text-gray-400">
                        <span>{{ useTimeago(item.created) }}</span>
                        <span>{{ item.likes ?? 0 }} 赞</span>
                        <span>{{ item.replies_count ?? 0 }} 回复</span>
                    </div>
                </article>
            </div>
            <!-- 分页加载 -->
            <div v-if="hasMore" class="mt-6 text-center">
                <button type="button"
                    class="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    :disabled="loading" @click="loadList()">
                    {{ loading ? '加载中...' : '加载更多' }}
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
// 公共贴文页:discuss/feed 数据源,本地排序与关键词过滤
const state = reactive({
    keyword: '',
    tab: 'all',
    tabs: [
        { key: 'all', label: '推荐' },
        { key: 'new', label: '最新' },
        { key: 'hot', label: '热门' },
    ],
    list: [],
    cursor: {
        next_cursor: '',
    },
    loading: false,
    loaded: false,
    error: '',
}), { keyword, tab, tabs, list, loading, loaded, error } = toRefs(state);
const route = useRoute();
const router = useRouter();
// 是否还有下一页
const hasMore = computed(() => Boolean(state.cursor.next_cursor));
// 详情页地址
const detailPath = (item) => `/${authorUser(item)}/feed/${item.uuid}`;
// 图片预览地址:id 为素材序号,预览页按序号定位
const imagePath = (item, index) => `${detailPath(item)}/image/${index}`;
// 作者用户名
const authorUser = (item) => item?.account?.user ?? item?.user ?? 'youloge';
// 正文兼容字符串与富文本块
const contentText = (item) => {
    const content = item?.content;
    if (Array.isArray(content)) {
        return content.map(block => typeof block === 'string' ? block : (block?.text ?? '')).join('\n');
    }
    return String(content ?? '');
};
// 素材列表:兼容字符串、etag、key 与 url 字段
const materialList = (item) => {
    if (!Array.isArray(item?.material)) {
        return [];
    }
    return item.material.map((entry) => {
        if (typeof entry === 'string') {
            return entry;
        }
        return entry?.etag ?? entry?.key ?? entry?.url ?? entry?.poster ?? '';
    }).filter(Boolean);
};
// 地理位置
const locationText = (item) => [item?.metadata?.city, item?.metadata?.country].filter(Boolean).join(' · ');
// 日期解析:兼容后端 YYYY-MM-DD 格式
const parseDate = (value) => new Date(String(value ?? '').replace(/-/g, '/'));
// 本地排序与搜索过滤
const visibleList = computed(() => {
    let items = [...state.list];
    const key = state.keyword.trim().toLowerCase();
    if (key) {
        items = items.filter((item) => {
            return contentText(item).toLowerCase().includes(key) || authorUser(item).toLowerCase().includes(key);
        });
    }
    if (state.tab === 'new') {
        items.sort((a, b) => parseDate(b.created) - parseDate(a.created));
    } else if (state.tab === 'hot') {
        items.sort((a, b) => Number(b.likes ?? 0) - Number(a.likes ?? 0));
    }
    return items;
});
// 加载贴文列表,支持刷新与游标分页
const loadList = (isFirst = false) => {
    if (state.loading) {
        return;
    }
    if (isFirst) {
        state.list = [];
        state.cursor.next_cursor = '';
    }
    state.loading = true;
    state.error = '';
    apiFetch('discuss/feed', {
        mode: 'tweet',
        cursor: state.cursor.next_cursor,
        limit: 20,
    }).then(({ data = [], ...cursor }) => {
        state.cursor = cursor;
        data.forEach((item) => {
            if (!state.list.some((it) => String(it.uuid) === String(item.uuid))) {
                state.list.push(item);
            }
        });
        state.loaded = true;
    }).catch((err) => {
        state.error = err?.msg ?? err?.message ?? '贴文加载失败';
        useMessage().error(state.error);
    }).finally(() => {
        state.loading = false;
    });
};
// 提交搜索:写入 query 参数,列表在本地过滤
const onSearch = () => {
    router.push({ path: route.path, query: state.keyword ? { q: state.keyword } : {} });
};
onMounted(() => {
    state.keyword = route.query.q ?? '';
    loadList(true);
});
watch(() => route.query.q, (q) => {
    state.keyword = q ?? '';
});
</script>
