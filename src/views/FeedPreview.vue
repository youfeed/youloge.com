<template>
    <!-- 贴文详情:图片路由时叠加第 N 张图片预览 -->
    <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
        <header class="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
            <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
                <router-link to="/feed" class="text-sm text-gray-600 no-underline hover:text-blue-600">
                    ← 返回贴文
                </router-link>
                <span class="text-sm text-gray-400">贴文详情</span>
            </div>
        </header>
        <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
            <div v-if="loading" class="py-16 text-center text-sm text-gray-400">加载中...</div>
            <div v-else-if="error" class="flex flex-col items-center gap-4 py-16 text-center">
                <div class="text-sm text-gray-500">{{ error }}</div>
                <button type="button"
                    class="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                    @click="loadInfo">重试</button>
            </div>
            <article v-else-if="info.uuid"
                class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <!-- 作者信息 -->
                <div class="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                    <img :src="useImage(info.account?.avatar, '80')" alt="avatar"
                        class="h-10 w-10 rounded-full border border-gray-200" />
                    <div class="min-w-0">
                        <router-link :to="`/${authorUser}`"
                            class="text-sm font-semibold text-gray-900 no-underline hover:text-blue-600">
                            {{ info.account?.name ?? 'Youloge 用户' }}
                        </router-link>
                        <div class="text-xs text-gray-400">@{{ authorUser }} · {{ useTimeago(info.created) }}</div>
                    </div>
                </div>
                <!-- 正文 -->
                <div class="px-5 py-5">
                    <p class="whitespace-pre-wrap text-base leading-relaxed text-gray-800">{{ contentText }}</p>
                    <!-- 配图:点击进入第 N 张预览 -->
                    <div v-if="images.length" class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <router-link v-for="(src, index) in images" :key="`${src}-${index}`" :to="imagePath(index)"
                            class="block overflow-hidden rounded-md">
                            <img :src="useImage(src, 300)" :alt="`贴文图片 ${index + 1}`"
                                class="h-32 w-full object-cover" />
                        </router-link>
                    </div>
                </div>
                <!-- 元数据 -->
                <div class="flex flex-wrap items-center gap-4 border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
                    <span v-if="locationText">{{ locationText }}</span>
                    <span>{{ info.likes ?? 0 }} 赞</span>
                    <span>{{ info.replies_count ?? 0 }} 回复</span>
                </div>
                <!-- 关联资源 -->
                <div v-if="info.owner?.uuid" class="border-t border-gray-100 bg-gray-50 px-5 py-4">
                    <div class="text-sm font-semibold text-gray-800">{{ info.owner.title }}</div>
                    <p v-if="info.owner.description" class="mt-1 text-sm text-gray-500">
                        {{ info.owner.description }}
                    </p>
                    <div class="mt-2 flex flex-wrap items-center gap-2">
                        <span v-if="info.owner.price" class="text-sm font-medium text-red-500">
                            ￥{{ info.owner.price }}
                        </span>
                        <span v-for="keyword in info.owner.keywords ?? []" :key="keyword"
                            class="rounded-sm bg-white px-2 py-1 text-xs text-gray-500">
                            #{{ keyword }}
                        </span>
                    </div>
                </div>
            </article>
            <!-- 评论区:按 tweet 类型加载当前贴文的留言 -->
            <YouDiscuss v-if="info.uuid" :key="discussUuid" type="tweet" :uuid="discussUuid"
                :cursor="discussCursor" class="mt-6" />
            <div v-if="!loading && !error && !info.uuid" class="py-16 text-center text-sm text-gray-400">
                未找到贴文
            </div>
        </main>
        <!-- 图片预览层:仅在 /image/:id 路由显示 -->
        <div v-if="isPreview" class="fixed inset-0 z-50 flex flex-col bg-black/90 text-white">
            <div class="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4">
                <button type="button" class="rounded-md px-2 py-1 text-sm text-gray-200 hover:bg-white/10"
                    @click="closePreview">
                    <span class="mr-1 text-lg leading-none">×</span>关闭
                </button>
                <div class="text-sm text-gray-300">
                    {{ images.length ? `${activeIndex + 1} / ${images.length}` : '图片预览' }}
                </div>
                <button type="button" class="text-sm text-blue-300 hover:text-blue-200" @click="closePreview">
                    返回详情
                </button>
            </div>
            <div class="relative flex min-h-0 flex-1 items-center justify-center px-4 py-4">
                <button v-if="images.length > 1" type="button"
                    class="absolute left-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                    title="上一张" @click="showImage(-1)">
                    <i :style="useIcon('mdi:chevron-left', 24)"></i>
                </button>
                <img v-if="activeImage" :src="useImage(activeImage, '0')" alt="贴文图片"
                    class="max-h-full max-w-full object-contain" />
                <div v-else class="text-sm text-gray-400">该贴文暂无图片</div>
                <button v-if="images.length > 1" type="button"
                    class="absolute right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                    title="下一张" @click="showImage(1)">
                    <i :style="useIcon('mdi:chevron-right', 24)"></i>
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
// 贴文详情页:读取 discuss/info 展示详情,图片路由额外叠加第 N 张预览
const route = useRoute();
const router = useRouter();
const state = reactive({
    params: {},
    loading: true,
    error: '',
    info: {},
});
const { params, loading, error, info } = toRefs(state);
// 是否处于图片预览路由
const isPreview = computed(() => params.value.id !== undefined && params.value.id !== '');
// 详情地址
const detailPath = computed(() => `/${authorUser.value}/feed/${params.value.uuid ?? ''}`);
// 作者用户名
const authorUser = computed(() => info.value.account?.user ?? params.value.user ?? 'youloge');
// 评论组件使用的贴文 UUID
const discussUuid = computed(() => String(params.value.uuid ?? info.value.uuid ?? ''));
// 评论初始游标:支持从 query 指定 cursor
const discussCursor = computed(() => String(route.query.cursor ?? ''));
// 正文:兼容字符串与富文本块数组
const contentText = computed(() => {
    const content = info.value.content;
    if (Array.isArray(content)) {
        return content.map(block => typeof block === 'string' ? block : (block?.text ?? '')).join('\n');
    }
    return String(content ?? '');
});
// 图片列表:material 中的 etag/key 才是 CDN 可用的图片标识
const images = computed(() => {
    if (!Array.isArray(info.value.material)) {
        return [];
    }
    const list = info.value.material.map((entry) => {
        if (typeof entry === 'string') {
            return entry;
        }
        return entry?.etag ?? entry?.key ?? entry?.image ?? entry?.url ?? '';
    });
    return [...new Set(list.filter(Boolean))];
});
// 当前图片索引:路由 id 为图片序号,兼容旧的图片标识,越界时回退到第一张
const activeIndex = computed(() => {
    const target = String(params.value.id ?? '');
    const index = Number(target);
    if (Number.isInteger(index) && index >= 0 && index < images.value.length) {
        return index;
    }
    const matched = images.value.findIndex((item) => String(item) === target);
    return matched >= 0 ? matched : 0;
});
// 当前图片
const activeImage = computed(() => images.value[activeIndex.value] ?? '');
// 地理位置
const locationText = computed(() => {
    const metadata = info.value.metadata;
    return [metadata?.city, metadata?.country].filter(Boolean).join(' · ');
});
// 更新页面标题
const updateTitle = () => {
    const name = info.value.account?.name ?? '贴文';
    document.title = isPreview.value ? `${name}的图片 - Youloge.com` : `${name}的贴文 - Youloge.com`;
};
// 加载贴文详情
const loadInfo = () => {
    state.loading = true;
    state.error = '';
    apiFetch('discuss/info', { uuid: params.value.uuid }).then((result) => {
        state.info = result ?? {};
        updateTitle();
    }).catch((err) => {
        state.error = err?.msg ?? err?.message ?? '贴文加载失败';
    }).finally(() => {
        state.loading = false;
    });
};
// 第 N 张图片地址
const imagePath = (index) => `${detailPath.value}/image/${index}`;
// 切换图片:同步更新路由中的序号
const showImage = (delta) => {
    if (images.value.length < 2) {
        return;
    }
    const next = (activeIndex.value + delta + images.value.length) % images.value.length;
    router.replace(imagePath(next));
};
// 关闭预览:回到贴文详情
const closePreview = () => {
    router.push(detailPath.value);
};
// 键盘操作:预览态下 Esc 关闭,左右键切换
const onKeydown = (event) => {
    if (!isPreview.value) {
        return;
    }
    if (event.key === 'Escape') {
        closePreview();
    } else if (event.key === 'ArrowLeft') {
        showImage(-1);
    } else if (event.key === 'ArrowRight') {
        showImage(1);
    }
};
watch(() => [route.params.uuid, route.params.id], () => {
    const previousUuid = params.value.uuid;
    state.params = { ...route.params };
    if (previousUuid !== params.value.uuid) {
        loadInfo();
    } else {
        updateTitle();
    }
});
watch(isPreview, (value) => {
    document.body.style.overflow = value ? 'hidden' : '';
});
onMounted(() => {
    state.params = { ...route.params };
    loadInfo();
    window.addEventListener('keydown', onKeydown);
});
onUnmounted(() => {
    document.body.style.overflow = '';
    window.removeEventListener('keydown', onKeydown);
});
</script>
