<template>
    <!-- 关于我们:面向所有访客的公共页面 -->
    <div class="min-h-screen bg-gray-50 font-sans">

        <main class="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <!-- 平台介绍 -->
            <div class="mx-auto mb-16 max-w-3xl text-center">
                <div class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    开放 · 免费 · 可控
                </div>
                <h1 class="mb-6 mt-6 text-4xl font-bold text-gray-900">关于 Youloge</h1>
                <p class="text-xl leading-relaxed text-gray-600">
                    Youloge 是面向开发者与内容创作者的在线服务平台，把常用基建、资源检索与工具链整合在一起。
                </p>
                <p class="mt-4 text-base leading-relaxed text-gray-500">
                    我们希望让每一个想法都能快速落地：无需重复搭建，接口清晰可用，资源统一检索，数据与权限始终由你掌握。
                </p>
            </div>
            <!-- 核心能力 -->
            <div class="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div v-for="item in features" :key="item.title"
                    class="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
                    <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                        <i :style="useIcon(item.icon, 20)"></i>
                    </div>
                    <div class="text-base font-semibold text-gray-900">{{ item.title }}</div>
                    <p class="mt-2 text-sm leading-relaxed text-gray-600">{{ item.description }}</p>
                </div>
            </div>
            <!-- 版本信息 -->
            <section class="mx-auto mt-16 max-w-3xl">
                <div class="rounded-lg border border-gray-200 bg-white p-6 sm:p-8">
                    <div class="text-center">
                        <h2 class="text-lg font-bold text-gray-900">版本信息</h2>
                        <p class="mt-2 text-sm text-gray-500">
                            版本号与编译时间由构建过程自动生成，便于确认当前运行的版本。
                        </p>
                    </div>
                    <dl class="mt-6 grid gap-4 sm:grid-cols-2">
                        <div class="rounded-md bg-gray-50 p-4">
                            <dt class="text-xs text-gray-500">当前版本</dt>
                            <dd class="mt-1 text-lg font-semibold text-gray-900">v{{ release.version }}</dd>
                        </div>
                        <div class="rounded-md bg-gray-50 p-4">
                            <dt class="text-xs text-gray-500">编译时间</dt>
                            <dd class="mt-1 text-lg font-semibold text-gray-900">
                                <time :datetime="release.iso" :title="'构建时间戳：' + release.stamp">
                                    {{ release.time }}
                                </time>
                            </dd>
                        </div>
                    </dl>
                </div>
            </section>
            <div class="mx-auto mt-16 max-w-3xl text-center">
                <router-link to="/"
                    class="inline-block rounded-md bg-blue-600 px-6 py-3 text-white no-underline transition-colors hover:bg-blue-700">
                    返回首页
                </router-link>
            </div>
        </main>
        <footer class="mt-16 w-full border-t border-gray-200">
            <div class="mt-2 text-center text-sm text-gray-500">
                <p>ICP备案/许可证号：皖ICP备19004549号</p>
                <p>皖公安备 34112402000344</p>
            </div>
        </footer>
    </div>
</template>
<script setup>
// 关于页数据:公共静态内容与构建信息
const state = reactive({
    features: [
        { title: '开放接口', description: '标准化 API 与清晰文档，开发者可以快速接入开放能力。', icon: 'mdi:key' },
        { title: '资源聚合', description: '贴文、视频、文章、云盘与商品统一检索，发现内容更高效。', icon: 'mdi-light:note-multiple' },
        { title: '开源可控', description: '配套组件与工具链持续开放，权限与数据始终由你掌握。', icon: 'carbon-code' },
        { title: '持续迭代', description: '版本与编译时间透明可查，每次更新都有迹可循。', icon: 'mdi-history' },
    ],
});
const { features } = toRefs(state);
// 构建信息:版本号与编译时间来自 vite.config.js 的 define 常量
const release = computed(() => {
    const stamp = typeof __UPDATED__ === 'undefined' ? '0' : __UPDATED__;
    const date = new Date(parseInt(stamp, 16) * 1000);
    const valid = !Number.isNaN(date.getTime());
    return {
        version: typeof __VERSION__ === 'undefined' ? '0.0.0' : __VERSION__,
        time: valid ? date.toLocaleString('zh-CN', { hour12: false }) : '未知',
        iso: valid ? date.toISOString() : '',
        stamp,
    };
});
</script>
