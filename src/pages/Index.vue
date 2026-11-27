<template>
    <!-- 未登录宣传页:主视觉 + 特性展示,导航由全局侧栏提供 -->
    <div class="min-h-screen font-sans">
        <!-- 英雄区域 -->
        <section class="bg-gradient-to-b from-neutral to-white py-16 md:py-24">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-4xl text-center">
                    <h1 class="mb-6 text-4xl font-bold leading-tight text-secondary md:text-6xl">
                        为开发者打造的<br class="md:hidden">基建服务平台
                    </h1>
                    <p class="mb-8 text-xl text-gray-600 text-balance">快速、零权限、零成本</p>
                    <!-- 行动召唤 -->
                    <div class="mb-12 flex flex-wrap justify-center gap-4">
                        <button type="button"
                            class="rounded-md bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700"
                            @click="onLogin">
                            立即登录
                        </button>
                        <router-link to="/video"
                            class="rounded-md border border-gray-300 px-6 py-2 text-sm text-gray-700 no-underline hover:bg-gray-50">
                            浏览视频
                        </router-link>
                    </div>
                    <!-- 快速统计 -->
                    <div class="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-500">
                        <div><span class="font-semibold text-secondary">100M+</span> 注册用户</div>
                        <div><span class="font-semibold text-secondary">40M+</span> 专栏文章</div>
                        <div><span class="font-semibold text-secondary">190+</span> 音视频电影</div>
                        <div><span class="font-semibold text-secondary">190+</span> 分享资源</div>
                    </div>
                </div>
            </div>
        </section>
        <!-- 特性展示 -->
        <section id="features" class="py-16 md:py-24">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="mb-16 text-center">
                    <h2 class="mb-4 text-3xl font-bold text-secondary md:text-4xl">为什么选择 Youloge?</h2>
                    <p class="mx-auto max-w-3xl text-xl text-gray-600">接口免费、资源共享、开源可控、完整权限</p>
                </div>
                <div class="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
                    <!-- 特性卡片:API 接口 -->
                    <div class="rounded-lg border border-gray-200 bg-white p-8">
                        <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                            <i :style="useIcon('carbon:code', 40, '#23ca92')"></i>
                        </div>
                        <h3 class="mb-3 text-xl font-semibold text-secondary">
                            <a href="https://s.apifox.cn/7302e0d5-18da-4730-adc5-4b532b346923" target="_blank"
                                class="text-inherit no-underline">API接口&#8594;</a>
                        </h3>
                        <p class="text-gray-600">开放所有接口、服务API请求方式</p>
                    </div>
                    <!-- 特性卡片:文档中心 -->
                    <div class="rounded-lg border border-gray-200 bg-white p-8">
                        <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                            <i :style="useIcon('carbon:mac-command', 40, '#23ca92')"></i>
                        </div>
                        <h3 class="mb-3 text-xl font-semibold text-secondary">
                            <a href="https://docs.youloge.com/" target="_blank" class="text-inherit no-underline">
                                文档中心&#8594;
                            </a>
                        </h3>
                        <p class="text-gray-600">平台配套组件服务</p>
                    </div>
                </div>
            </div>
        </section>
        <!-- 页脚 -->
        <footer class="w-full border-0 border-solid border-t border-gray-300">
            <div class="mt-2 text-center text-gray-500">
                <a href="https://beian.miit.gov.cn/" class="text-gray no-underline">
                    <p>ICP备案/许可证号：皖ICP备19004549号</p>
                </a>
                <p>皖公安备 34112402000344</p>
            </div>
        </footer>
    </div>
</template>
<script setup>
// 未登录主宣传页:登录与浏览入口,导航统一由 YouLayout 侧栏承载
const { warning } = useMessage();
const youPlus = YouPlus();
// 打开登录
const onLogin = () => {
    youPlus.useLogin().then(profile => {
        useStorage('profile', profile);
        location.reload();
    }).catch(err => {
        warning(err?.msg ?? '登录失败');
    });
};
</script>
