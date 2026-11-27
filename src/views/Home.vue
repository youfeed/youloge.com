<template>
    <!-- 登录后综合首页:贴文 / 视频 / 文章 / 云盘 横向滚动板块 -->
    <div class="min-h-screen bg-gray-50 pb-16">
        <!-- 个人资料卡 -->
        <section class="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
            <div class="relative flex items-center rounded-md border border-gray-200 bg-white p-3">
                <img :src="useImage(stateProfile.avatar, '80')" alt="avatar"
                    class="h-12 w-12 cursor-pointer rounded-full border object-cover transition-transform hover:scale-95"
                    @click="chooseAvatar" />
                <div class="ml-3 min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-x-3 text-sm font-bold">
                        <span class="flex items-center gap-1">
                            {{ stateProfile.name }}
                            <span class="cursor-pointer" @click="changeName">
                                <i :style="useIcon('tdesign:edit', 16, '#2196F3')"></i>
                            </span>
                        </span>
                        <span class="flex items-center gap-1 text-gray-500">
                            @{{ stateProfile.user }}
                            <span class="cursor-pointer" @click="changeUser">
                                <i :style="useIcon('tdesign:edit', 16, '#2196F3')"></i>
                            </span>
                        </span>
                    </div>
                    <div class="truncate text-xs text-gray-400">{{ stateProfile.uuid }} · {{ stateProfile.mail }}</div>
                </div>
                <router-link to="/profile" class="text-sm text-blue-600 no-underline" title="个人资料">个人资料&#8594;</router-link>
            </div>
        </section>
        <!-- 综合板块 -->
        <section v-for="block in state.blocks" :key="block.key" class="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
            <!-- 板块标题:查看更多 + 左右滚动箭头 -->
            <div class="mb-3 flex items-center justify-between">
                <h2 class="text-lg font-bold text-gray-900">{{ block.title }}</h2>
                <div class="flex items-center gap-2">
                    <router-link :to="block.more" class="text-sm text-blue-600 no-underline hover:text-blue-700">
                        查看更多
                    </router-link>
                    <button type="button" class="rounded-md border border-gray-200 bg-white p-1 hover:bg-gray-100"
                        title="向左滚动" @click="scrollBlock(block.key, -1)">
                        <i :style="useIcon('mdi:chevron-left', 18)"></i>
                    </button>
                    <button type="button" class="rounded-md border border-gray-200 bg-white p-1 hover:bg-gray-100"
                        title="向右滚动" @click="scrollBlock(block.key, 1)">
                        <i :style="useIcon('mdi:chevron-right', 18)"></i>
                    </button>
                </div>
            </div>
            <!-- 横向滚动容器 -->
            <div :ref="el => setScrollRef(block.key, el)"
                class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <!-- 加载中 -->
                <template v-if="block.loading">
                    <div v-for="n in 4" :key="n"
                        class="h-40 w-56 shrink-0 animate-pulse rounded-lg border border-gray-200 bg-white"></div>
                </template>
                <!-- 空状态 -->
                <div v-else-if="!block.list.length" class="w-full py-8 text-center text-sm text-gray-400">
                    暂无{{ block.title }}
                </div>
                <!-- 贴文卡片 -->
                <template v-else-if="block.key === 'feed'">
                    <router-link v-for="item in block.list" :key="item.uuid" :to="feedPath(item)"
                        class="w-64 shrink-0 snap-start rounded-lg border border-gray-200 bg-white p-4 no-underline transition-shadow hover:shadow-md">
                        <div class="mb-2 flex items-center gap-2">
                            <img :src="useImage(item.account?.avatar, '80')" alt="avatar"
                                class="h-7 w-7 rounded-full border border-gray-200" />
                            <span class="truncate text-xs text-gray-600">{{ item.account?.name ?? 'Youloge' }}</span>
                        </div>
                        <div class="line-clamp-2 text-sm font-semibold text-gray-900">{{ item.title }}</div>
                        <p class="mt-1 line-clamp-2 text-xs text-gray-500">{{ item.description }}</p>
                    </router-link>
                </template>
                <!-- 视频卡片 -->
                <template v-else-if="block.key === 'video'">
                    <router-link v-for="item in block.list" :key="item.uuid" :to="detailPath(block.key, item)"
                        class="w-56 shrink-0 snap-start overflow-hidden rounded-lg border border-gray-200 bg-white no-underline transition-shadow hover:shadow-md">
                        <div class="aspect-video overflow-hidden bg-gray-100">
                            <img :src="useImage(item.poster, 150)" :alt="item.title"
                                class="h-full w-full object-cover" />
                        </div>
                        <div class="p-3">
                            <div class="line-clamp-2 text-sm font-medium text-gray-900">{{ item.title }}</div>
                            <div class="mt-1 text-xs text-gray-400">{{ useViews(item.views, '观看') }}</div>
                        </div>
                    </router-link>
                </template>
                <!-- 文章卡片 -->
                <template v-else-if="block.key === 'article'">
                    <router-link v-for="item in block.list" :key="item.uuid" :to="detailPath('feed', item)"
                        class="flex w-64 shrink-0 snap-start gap-3 rounded-lg border border-gray-200 bg-white p-3 no-underline transition-shadow hover:shadow-md">
                        <img v-if="item.poster" :src="useImage(item.poster, '80')" :alt="item.title"
                            class="h-14 w-14 shrink-0 rounded-sm object-cover" />
                        <div class="min-w-0 flex-1">
                            <div class="line-clamp-2 text-sm font-medium text-gray-900">{{ item.title }}</div>
                            <div class="mt-1 line-clamp-2 text-xs text-gray-500">{{ item.description }}</div>
                        </div>
                    </router-link>
                </template>
                <!-- 云盘卡片 -->
                <template v-else-if="block.key === 'drive'">
                    <router-link v-for="item in block.list" :key="item.uuid" :to="detailPath(block.key, item)"
                        class="flex w-64 shrink-0 snap-start gap-3 rounded-lg border border-gray-200 bg-white p-3 no-underline transition-shadow hover:shadow-md">
                        <img :src="useImage(item.poster, '80')" :alt="item.title"
                            class="h-14 w-14 shrink-0 rounded-sm object-cover" />
                        <div class="min-w-0 flex-1">
                            <div class="line-clamp-2 text-sm font-medium text-gray-900">{{ item.title }}</div>
                            <div class="mt-1 text-xs text-gray-400">{{ useBytes(item.size) }}</div>
                        </div>
                    </router-link>
                </template>
            </div>
        </section>
    </div>
</template>
<script setup>
// 综合首页:按板块加载内容,横向滚动展示,提供查看更多入口
const stateProfile = storeProfile();
const state = reactive({
    blocks: [
        { key: 'feed', title: '贴文 Feed', more: '/feed', api: 'search/article', list: [], loading: true },
        { key: 'video', title: '视频 Video', more: '/video', api: 'search/video', list: [], loading: true },
        { key: 'article', title: '文章 Article', more: '/article', api: 'search/article', list: [], loading: true },
        { key: 'drive', title: '云盘 Drive', more: '/drive', api: 'search/drive', list: [], loading: true },
    ],
}), { blocks } = toRefs(state);
// 横向滚动容器引用
const scrollRefs = {};
const setScrollRef = (key, el) => {
    if (el) scrollRefs[key] = el;
};
// 左右滚动
const scrollBlock = (key, direction) => {
    const el = scrollRefs[key];
    el?.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' });
};
// 贴文详情地址
const feedPath = (item) => `/${item.user ?? item.account?.user ?? stateProfile.user ?? 'youloge'}/feed/${item.uuid}`;
// 详情地址
const detailPath = (kind, item) => `/${item.user ?? item.account?.user ?? stateProfile.user ?? 'youloge'}/${kind}/${item.uuid}`;
// 加载单个板块
const loadBlock = (block) => {
    block.loading = true;
    apiFetch(block.api, { q: '*', offset: 0, limit: 12 }).then(({ hits = [] }) => {
        block.list = hits;
        block.loading = false;
    }).catch(() => {
        block.list = [];
        block.loading = false;
    });
};
// 修改头像
const chooseAvatar = () => {
    useMaterial({ type: 'image', limit: 1 }).then(([item]) => {
        apiFetch('account/avatar', { avatar: item.etag }).then(() => {
            stateProfile.avatar = item.etag;
            useStorage('profile', { avatar: item.etag });
            useMessage().success('保存成功');
        }).catch(err => {
            useMessage().error(err.message);
        });
    });
};
// 修改别称
const changeUser = () => {
    usePrompt({
        title: '修改别称',
        placeholder: '字母+数字组合',
        name: 'user',
        pattern: '[A-Za-z0-9]{2,12}'
    }).then(({ user }) => {
        apiFetch('account/user', { user }).then(() => {
            stateProfile.user = user;
            useStorage('profile', { user });
            useMessage().success('修改成功');
        }).catch(err => {
            useMessage().error(err.message);
        });
    }).catch(() => {
        useMessage().info('取消输入');
    });
};
// 修改昵称
const changeName = () => {
    usePrompt({
        title: '修改昵称',
        placeholder: '2-12个字',
        name: 'name',
        pattern: '.{2,12}'
    }).then(({ name }) => {
        apiFetch('account/name', { name }).then(() => {
            stateProfile.name = name;
            useStorage('profile', { name });
            useMessage().success('修改成功');
        }).catch(err => {
            useMessage().error(err.message);
        });
    }).catch(() => {
        useMessage().info('取消输入');
    });
};
onMounted(() => {
    state.blocks.forEach(loadBlock);
});
</script>
