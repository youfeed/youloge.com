<template>
    <!-- 关于我们:面向所有访客的公共页面 -->
    <div class="min-h-screen bg-gray-50 font-sans">
        <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <router-link to="/" class="flex items-center space-x-2 no-underline">
                        <span class="text-xl font-bold text-gray-900">Youloge</span>
                        <span class="text-sm text-gray-400">/ 关于</span>
                    </router-link>
                    <nav class="hidden md:flex items-center space-x-8">
                        <router-link to="/" class="text-gray-600 hover:text-blue-600 transition-colors">首页</router-link>
                        <router-link to="/about" class="text-blue-600 font-medium">关于</router-link>
                    </nav>
                </div>
            </div>
        </header>
        <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="max-w-3xl mx-auto text-center mb-16">
                <h1 class="text-4xl font-bold text-gray-900 mb-6">关于 Youloge</h1>
                <p class="text-xl text-gray-600 leading-relaxed">
                    为开发者打造的基建服务平台，提供开放、免费、可控的在线工具与资源服务。
                </p>
            </div>
            <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div v-for="item in features" :key="item.title"
                    class="bg-white p-6 rounded-lg border border-gray-200">
                    <div class="text-lg font-semibold text-gray-900 mb-2">{{ item.title }}</div>
                    <p class="text-gray-600">{{ item.description }}</p>
                </div>
            </div>
            <div class="max-w-3xl mx-auto mt-16 text-center">
                <router-link to="/"
                    class="inline-block px-6 py-3 bg-blue-600 text-white rounded-md no-underline hover:bg-blue-700 transition-colors">
                    返回首页
                </router-link>
            </div>
        </main>
        <footer class="border-t border-gray-200 w-full mt-16">
            <div class="mt-2 text-center text-sm text-gray-500">
                <p>ICP备案/许可证号：皖ICP备19004549号</p>
                <p>皖公安备 34112402000344</p>
            </div>
        </footer>
    </div>
</template>
<script setup>
// 关于页数据:公共静态内容
const state = reactive({
    features: [
        { title: '开放接口', description: '开放全部服务接口，支持标准化的 API 请求方式。' },
        { title: '资源共享', description: '文章、视频、网盘与商品资源统一检索与分享。' },
        { title: '开源可控', description: '配套组件与工具链持续开放，权限完整可控。' },
    ],
}), { features } = toRefs(state);
</script>
