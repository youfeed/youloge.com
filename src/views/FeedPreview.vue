<template>
    <!-- 贴文图片预览:按 discuss/info 展示原图与贴文信息 -->
    <div class="fixed inset-0 z-50 flex flex-col bg-black/90 text-white">
        <!-- 顶部操作栏 -->
        <div class="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4">
            <button type="button" class="rounded-md px-2 py-1 text-sm text-gray-200 hover:bg-white/10" @click="close">
                <span class="mr-1 text-lg leading-none">×</span>关闭
            </button>
            <div class="text-sm text-gray-300">
                {{ images.length ? `${activeIndex + 1} / ${images.length}` : '图片预览' }}
            </div>
            <router-link :to="detailPath" class="text-sm text-blue-300 no-underline hover:text-blue-200">
                查看详情
            </router-link>
        </div>
        <!-- 加载中 -->
        <div v-if="loading" class="flex flex-1 items-center justify-center text-sm text-gray-400">加载中...</div>
        <!-- 加载失败 -->
        <div v-else-if="error" class="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
            <div class="text-sm text-gray-300">{{ error }}</div>
            <button type="button" class="rounded-md border border-white/30 px-4 py-2 text-sm hover:bg-white/10"
                @click="loadInfo">重试</button>
        </div>
        <template v-else>
            <!-- 图片区域 -->
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
            <!-- 贴文信息 -->
            <div v-if="info.uuid" class="mx-auto w-full max-w-3xl shrink-0 px-4 pb-6">
                <div class="flex items-center gap-2">
                    <img :src="useImage(info.account?.avatar, '80')" alt="avatar"
                        class="h-8 w-8 rounded-full border border-white/20" />
                    <span class="text-sm font-semibold">{{ info.account?.name ?? 'Youloge 用户' }}</span>
                    <span class="text-xs text-gray-400">@{{ authorUser }}</span>
                </div>
                <p class="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-200">{{ contentText }}</p>
                <div class="mt-3 flex items-center gap-4 text-xs text-gray-400">
                    <span>{{ useTimeago(info.created) }}</span>
                    <span>{{ info.likes ?? 0 }} 赞</span>
                    <span>{{ info.replies_count ?? 0 }} 回复</span>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup>
// 贴文图片预览页:从 discuss/info 读取详情并展示原图
const route = useRoute();
const router = useRouter();
const state = reactive({
    params: {},
    loading: true,
    error: '',
    info: {},
});
const { params, loading, error, info } = toRefs(state);
// 详情地址
const detailPath = computed(() => `/${authorUser.value}/feed/${params.value.uuid ?? ''}`);
// 作者用户名
const authorUser = computed(() => info.value.account?.user ?? params.value.user ?? 'youloge');
// 正文:兼容字符串与富文本块数组
const contentText = computed(() => {
    const content = info.value.content;
    if (Array.isArray(content)) {
        return content.map(block => typeof block === 'string' ? block : (block?.text ?? '')).join('\n');
    }
    return String(content ?? '');
});
// 图片列表:material 中的 etag/key 才是 CDN 可用的图片标识,owner.image 是数字素材 ID,不能直接拼图片地址
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
// 当前图片索引:路由 id 是图片序号,越界时回退到第一张
const activeIndex = computed(() => {
    const index = Number(route.params.id);
    return Number.isInteger(index) && index >= 0 && index < images.value.length ? index : 0;
});
// 当前图片
const activeImage = computed(() => images.value[activeIndex.value] ?? '');
// 加载贴文详情
const loadInfo = () => {
    state.loading = true;
    state.error = '';
    apiFetch('discuss/info', { uuid: params.value.uuid }).then((result) => {
        state.info = result ?? {};
        document.title = `${info.value.account?.name ?? '贴文'}的图片 - Youloge.com`;
    }).catch((err) => {
        state.error = err?.msg ?? err?.message ?? '贴文加载失败';
    }).finally(() => {
        state.loading = false;
    });
};
// 切换图片:同步更新路由中的 id
const showImage = (delta) => {
    if (images.value.length < 2) {
        return;
    }
    const next = (activeIndex.value + delta + images.value.length) % images.value.length;
    router.replace(`/${params.value.user}/feed/${params.value.uuid}/image/${next}`);
};
// 关闭预览:始终回到贴文详情,避免退回另一个图片预览
const close = () => {
    router.push(detailPath.value);
};
// 键盘操作:Esc 关闭,左右键切换
const onKeydown = (event) => {
    if (event.key === 'Escape') {
        close();
    } else if (event.key === 'ArrowLeft') {
        showImage(-1);
    } else if (event.key === 'ArrowRight') {
        showImage(1);
    }
};
watch(() => [route.params.uuid, route.params.id], () => {
    const previousUuid = state.params.uuid;
    state.params = { ...route.params };
    if (previousUuid !== state.params.uuid) {
        loadInfo();
    }
});
onMounted(() => {
    state.params = { ...route.params };
    loadInfo();
    window.addEventListener('keydown', onKeydown);
});
onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown);
});
</script>
