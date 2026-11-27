<template>
    <!-- 全站左右布局:左侧固定导航 + 右侧内容区 -->
    <div class="flex min-h-screen bg-white">
        <!-- 左侧导航:手机抽屉 / 中屏图标 / 大屏完整 -->
        <aside
            class="fixed inset-y-0 left-0 z-40 flex h-screen w-56 shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-200"
            :class="[
                state.drawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                state.collapsed ? 'md:w-16' : 'md:w-56',
            ]">
            <!-- Logo + 展开/折叠按钮 -->
            <div class="flex h-14 items-center gap-2 border-b border-gray-100 px-3">
                <router-link to="/" class="flex min-w-0 flex-1 items-center gap-2 no-underline"
                    @click="closeDrawer">
                    <img :src="logo" alt="Youloge" class="h-7 w-7 shrink-0" />
                    <span class="text-lg font-bold text-gray-900 md:hidden">Youloge</span>
                    <span v-if="!state.collapsed" class="hidden truncate text-lg font-bold text-gray-900 md:inline">
                        Youloge
                    </span>
                </router-link>
                <!-- 中屏/大屏:切换图标与完整模式 -->
                <button type="button" class="hidden shrink-0 rounded-md p-1 hover:bg-gray-100 md:block"
                    :title="state.collapsed ? '展开导航' : '折叠导航'" @click="toggleCollapsed">
                    <i :style="useIcon('mdi-light:menu', 20)"></i>
                </button>
            </div>
            <!-- 导航列表 -->
            <nav class="flex-1 space-y-1 overflow-y-auto px-2 py-3">
                <router-link v-for="item in publicMenus" :key="item.path" :to="item.path"
                    class="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 no-underline hover:bg-gray-100"
                    :class="{ 'bg-blue-50 font-semibold text-blue-600': isActive(item.path) }"
                    :title="item.label" @click="closeDrawer">
                    <i :style="useIcon(item.icon, 20)" class="shrink-0"></i>
                    <span class="md:hidden">{{ item.label }}</span>
                    <span v-if="!state.collapsed" class="hidden truncate md:inline">{{ item.label }}</span>
                </router-link>
            </nav>
            <!-- 登录后扩展菜单:底部对齐,紧贴账号区 -->
            <template v-if="isLogin">
                <div class="border-t border-gray-100 px-2 py-2">
                    <router-link v-for="item in userMenus" :key="item.path" :to="item.path"
                        class="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 no-underline hover:bg-gray-100"
                        :class="{ 'bg-blue-50 font-semibold text-blue-600': isActive(item.path) }"
                        :title="item.label" @click="closeDrawer">
                        <i :style="useIcon(item.icon, 20)" class="shrink-0"></i>
                        <span class="md:hidden">{{ item.label }}</span>
                        <span v-if="!state.collapsed" class="hidden truncate md:inline">{{ item.label }}</span>
                    </router-link>
                    <div v-if="state.moreOpen && !state.collapsed" class="hidden space-y-1 md:block">
                        <!-- 展开项分隔线,区分更多菜单与上方入口 -->
                        <div class="border-t border-gray-100"></div>
                        <router-link v-for="item in moreMenus" :key="item.path" :to="item.path"
                            class="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-500 no-underline hover:bg-gray-100"
                            :class="{ 'bg-blue-50 font-semibold text-blue-600': isActive(item.path) }"
                            @click="closeDrawer">
                            <i :style="useIcon(item.icon, 20)" class="shrink-0"></i>
                            <span>{{ item.label }}</span>
                        </router-link>
                    </div>
                    <!-- 手机抽屉内展示更多子菜单 -->
                    <div v-if="state.moreOpen" class="space-y-1 md:hidden">
                        <!-- 展开项分隔线,区分更多菜单与上方入口 -->
                        <div class="border-t border-gray-100"></div>
                        <router-link v-for="item in moreMenus" :key="item.path" :to="item.path"
                            class="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-500 no-underline hover:bg-gray-100"
                            @click="closeDrawer">
                            <i :style="useIcon(item.icon, 20)" class="shrink-0"></i>
                            <span>{{ item.label }}</span>
                        </router-link>
                    </div>
                    <!-- 更多:展开/收起按钮放在列表后方,双箭头图标表示状态 -->
                    <button type="button"
                        class="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                        :title="state.moreOpen ? '收起更多' : '展开更多'"
                        @click="state.moreOpen = !state.moreOpen">
                        <i :style="useIcon(state.moreOpen ? 'mdi:unfold-less-vertical' : 'mdi:unfold-more-vertical', 20)"
                            class="shrink-0"></i>
                        <span class="md:hidden">更多</span>
                        <span v-if="!state.collapsed" class="hidden truncate md:inline">更多</span>
                    </button>
                </div>
            </template>
            <!-- 底部:未登录引导登录 / 已登录账号信息 -->
            <div class="border-t border-gray-100 p-3">
                <button v-if="!isLogin" type="button"
                    class="flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                    title="登录" @click="onLogin">
                    <!-- 手机抽屉与展开模式:文字 -->
                    <span class="md:hidden">登录</span>
                    <span v-if="!state.collapsed" class="hidden md:inline">登录</span>
                    <!-- 折叠模式:仅图标 -->
                    <span v-if="state.collapsed" class="hidden md:inline-flex">
                        <i :style="useIcon('mdi:login', 20)"></i>
                    </span>
                </button>
                <div v-else class="flex items-center gap-2">
                    <router-link to="/profile" class="flex min-w-0 flex-1 items-center gap-2 no-underline"
                        @click="closeDrawer">
                        <img :src="useImage(stateProfile.avatar, '80')" alt="avatar"
                            class="h-9 w-9 shrink-0 rounded-full border border-gray-200" />
                        <div v-if="!state.collapsed" class="hidden min-w-0 flex-1 md:block">
                            <div class="truncate text-sm font-semibold text-gray-900">{{ stateProfile.name }}</div>
                            <div class="truncate text-xs text-gray-400">@{{ stateProfile.user }}</div>
                        </div>
                        <div class="min-w-0 flex-1 md:hidden">
                            <div class="truncate text-sm font-semibold text-gray-900">{{ stateProfile.name }}</div>
                            <div class="truncate text-xs text-gray-400">@{{ stateProfile.user }}</div>
                        </div>
                    </router-link>
                    <!-- 设置入口 -->
                    <router-link to="/setting" class="shrink-0 rounded-md p-1 hover:bg-gray-100" title="设置"
                        @click="closeDrawer">
                        <i :style="useIcon('mdi:cog', 18)"></i>
                    </router-link>
                </div>
            </div>
        </aside>
        <!-- 手机遮罩 -->
        <div v-if="state.drawerOpen" class="fixed inset-0 z-30 bg-black/40 md:hidden" @click="closeDrawer"></div>
        <!-- 右侧内容 -->
        <main class="min-w-0 flex-1" :class="state.collapsed ? 'md:ml-16' : 'md:ml-56'">
            <!-- 手机菜单按钮 -->
            <div class="flex h-14 items-center border-b border-gray-100 px-4 md:hidden">
                <button type="button" class="border-0 bg-transparent p-1" @click="state.drawerOpen = true">
                    <i :style="useIcon('mdi-light:menu', 24)"></i>
                </button>
                <span class="ml-3 font-bold text-gray-900">Youloge</span>
            </div>
            <RouterView />
        </main>
    </div>
</template>
<script setup>
// 全局左右布局:侧栏导航与内容区
const stateProfile = storeProfile();
const route = useRoute();
// Logo 使用 useLogo 生成,避免重复创建 Blob
const logo = useLogo({ width: 112, height: 112 });
const state = reactive({
    drawerOpen: false,
    // 图标模式:中屏默认收起,大屏登录后展开;未登录宣传页默认收起
    collapsed: true,
    moreOpen: false,
});
// 公共菜单:所有访客可见
const publicMenus = [
    { label: '贴文 Feed', path: '/feed', icon: 'mdi-light:note-multiple' },
    { label: '视频 Video', path: '/video', icon: 'mdi-light:play' },
    { label: '文章 Article', path: '/article', icon: 'mdi-light:file' },
    { label: '云盘 Drive', path: '/drive', icon: 'mdi-light:cloud' },
    { label: '商品 Goods', path: '/goods', icon: 'mdi-light:cart' },
];
// 登录态菜单
const userMenus = [
    { label: '历史 History', path: '/history', icon: 'mdi:history' },
    { label: '聊天 Chat', path: '/chat', icon: 'mdi:chat' },
    { label: '个人资料 Profile', path: '/profile', icon: 'mdi-light:account' },
];
// 更多折叠菜单
const moreMenus = [
    { label: '密钥 Apikey', path: '/apikey', icon: 'mdi:key' },
    { label: '钱包 Wallet', path: '/wallet', icon: 'mdi-light:wallet' },
    { label: '邮件 Mail', path: '/mail', icon: 'mdi:email' },
    { label: '账单 Billing', path: '/billing', icon: 'mdi:receipt' },
    { label: '关于 About', path: '/about', icon: 'mdi-light:information' },
];
// 是否登录
const isLogin = computed(() => Boolean(stateProfile.uuid));
// 菜单高亮:首页精确匹配,其余按前缀匹配
const isActive = (path) => path === '/' ? route.path === '/' : route.path === path || route.path.startsWith(`${path}/`);
// 按屏幕宽度与登录状态设置默认模式:中屏图标,大屏已登录完整
const syncCollapsed = () => {
    state.collapsed = !(window.innerWidth >= 1024 && isLogin.value);
};
// 切换图标/完整模式
const toggleCollapsed = () => {
    state.collapsed = !state.collapsed;
};
// 关闭手机抽屉
const closeDrawer = () => {
    state.drawerOpen = false;
};
// 登录
const youPlus = YouPlus();
const onLogin = () => {
    youPlus.useLogin().then(profile => {
        stateProfile.login(profile);
    }).catch(err => {
        useMessage().warning(err?.msg ?? '登录失败');
    });
};
onMounted(() => {
    syncCollapsed();
    window.addEventListener('resize', syncCollapsed);
});
onUnmounted(() => {
    window.removeEventListener('resize', syncCollapsed);
});
</script>
