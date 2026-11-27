<template>
    <!-- 文章详情:标题信息 + 正文 + 评论 -->
    <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
        <header class="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
            <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
                <router-link to="/article" class="text-sm text-gray-600 no-underline hover:text-blue-600">
                    ← 返回文章
                </router-link>
                <span class="text-sm text-gray-400">文章详情</span>
            </div>
        </header>
        <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
            <!-- 加载中 -->
            <div v-if="loading" class="overflow-hidden rounded-xl border border-gray-200 bg-white p-6">
                <div class="animate-pulse space-y-4">
                    <div class="h-8 w-3/4 rounded bg-gray-200"></div>
                    <div class="h-4 w-1/2 rounded bg-gray-100"></div>
                    <div class="h-4 w-full rounded bg-gray-100"></div>
                    <div class="h-4 w-5/6 rounded bg-gray-100"></div>
                    <div class="h-4 w-2/3 rounded bg-gray-100"></div>
                </div>
            </div>
            <!-- 加载失败 -->
            <div v-else-if="error" class="flex flex-col items-center gap-4 py-20 text-center">
                <div class="text-sm text-gray-500">{{ error }}</div>
                <button type="button"
                    class="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                    @click="loadArticle">重试</button>
            </div>
            <template v-else-if="article.uuid">
                <!-- 文章主体 -->
                <article class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <img v-if="article.poster" :src="useImage(article.poster, 300)" :alt="titleText"
                        class="max-h-72 w-full object-cover" />
                    <div class="px-5 py-6 sm:px-8">
                        <h1 class="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">{{ titleText }}</h1>
                        <p v-if="descriptionText" class="mt-3 text-sm leading-relaxed text-gray-500">
                            {{ descriptionText }}
                        </p>
                        <!-- 作者与元数据 -->
                        <div class="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                            <img :src="useImage(article.account?.avatar, '80')" alt="avatar"
                                class="h-8 w-8 rounded-full border border-gray-200" />
                            <router-link :to="`/${authorUser}`"
                                class="text-sm font-medium text-gray-800 no-underline hover:text-blue-600">
                                {{ authorName }}
                            </router-link>
                            <span class="text-xs text-gray-400">{{ useTimeago(article.created) }}</span>
                            <span class="text-xs text-gray-400">{{ article.likes_count ?? 0 }} 赞</span>
                            <span class="text-xs text-gray-400">{{ article.discuss_count ?? 0 }} 评论</span>
                        </div>
                    </div>
                    <!-- 正文 -->
                    <div class="article-body border-t border-gray-100 px-5 py-6 sm:px-8">
                        <div v-if="richError" class="text-sm text-gray-400">{{ richError }}</div>
                        <YouRich v-else v-model="html" />
                    </div>
                    <!-- 关键词 -->
                    <div v-if="keywords.length" class="flex flex-wrap gap-2 border-t border-gray-100 px-5 py-4 sm:px-8">
                        <router-link v-for="keyword in keywords" :key="keyword"
                            :to="`/article/search?q=${keyword}`"
                            class="rounded-sm bg-gray-100 px-2 py-1 text-xs text-gray-500 no-underline hover:text-blue-600">
                            #{{ keyword }}
                        </router-link>
                    </div>
                </article>
                <!-- 评论区 -->
                <YouDiscuss :key="discussUuid" type="article" :uuid="discussUuid" :cursor="discussCursor"
                    class="mt-6" />
            </template>
            <div v-else class="py-20 text-center text-sm text-gray-400">未找到文章</div>
        </main>
    </div>
</template>
<script setup>
// 文章详情页:读取 article/info 展示正文,并在下方加载评论
const route = useRoute();
const state = reactive({
    params: {},
    loading: true,
    error: '',
    article: {},
    html: '',
    richError: '',
});
const { loading, error, article, html, richError } = toRefs(state);
// 文章标题
const titleText = computed(() => article.value.title ?? '文章详情');
// 文章简介
const descriptionText = computed(() => article.value.description ?? '');
// 作者用户名
const authorUser = computed(() => article.value.account?.user ?? 'youloge');
// 作者昵称
const authorName = computed(() => article.value.account?.name ?? 'Youloge 用户');
// 关键词列表
const keywords = computed(() => Array.isArray(article.value.keywords) ? article.value.keywords : []);
// 评论组件使用的文章 UUID
const discussUuid = computed(() => String(state.params.uuid ?? article.value.uuid ?? ''));
// 评论初始游标:支持从 query 指定 cursor
const discussCursor = computed(() => String(route.query.cursor ?? ''));
// 加载正文内容
const loadRich = () => {
    const source = article.value.content;
    if (!source) {
        state.richError = '正文内容暂不可用';
        return;
    }
    state.richError = '';
    fetch(source).then((response) => {
        if (!response.ok) {
            throw new Error('正文加载失败');
        }
        return response.text();
    }).then((text) => {
        state.html = text;
    }).catch(() => {
        state.richError = '正文内容加载失败';
    });
};
// 加载文章详情
const loadArticle = () => {
    state.loading = true;
    state.error = '';
    apiFetch('article/info', { uuid: state.params.uuid }).then((result) => {
        state.article = result ?? {};
        document.title = `${titleText.value} - Youloge.com`;
        loadRich();
    }).catch((err) => {
        state.error = err?.msg ?? err?.message ?? '文章加载失败';
    }).finally(() => {
        state.loading = false;
    });
};
watch(() => route.params.uuid, () => {
    state.params = { ...route.params };
    loadArticle();
});
onMounted(() => {
    state.params = { ...route.params };
    loadArticle();
});
</script>
<style scoped>
/* 正文来自富文本,补充标题、段落与媒体的基础排版 */
.article-body :deep(.rich h1),
.article-body :deep(.rich h2),
.article-body :deep(.rich h3) {
    margin: 1.5rem 0 0.75rem;
    font-weight: 600;
    line-height: 1.4;
    color: #111827;
}

.article-body :deep(.rich h1) {
    font-size: 1.5rem;
}

.article-body :deep(.rich h2) {
    font-size: 1.25rem;
}

.article-body :deep(.rich h3) {
    font-size: 1.125rem;
}

.article-body :deep(.rich p),
.article-body :deep(.rich ul),
.article-body :deep(.rich ol) {
    margin: 0.75rem 0;
    color: #374151;
    line-height: 1.85;
}

.article-body :deep(.rich ul),
.article-body :deep(.rich ol) {
    padding-left: 1.5rem;
}

.article-body :deep(.rich ul) {
    list-style: disc;
}

.article-body :deep(.rich ol) {
    list-style: decimal;
}

.article-body :deep(.rich a) {
    color: #2563eb;
    text-decoration: underline;
}

.article-body :deep(.rich img) {
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
    border-radius: 0.5rem;
}

.article-body :deep(.rich pre) {
    background: #0f172a;
    color: #e2e8f0;
}

.article-body :deep(.rich blockquote) {
    margin: 1rem 0;
    padding-left: 1rem;
    border-left: 3px solid #d1d5db;
    color: #6b7280;
}
</style>
