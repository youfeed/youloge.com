<template>
    <template v-if="err == 0">
        <div class="flex items-center justify-center h-screen-sm">
            <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
        </div>
    </template>
    <template v-else-if="err == 200">
        <div class="flex flex-col gap-6 p-4 md:flex-row md:p-8">
            <!-- 主要内容区域 -->
            <div class="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 space-y-6">
                <!-- 视频播放器 -->
                <div class="group">
                    <div class="aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-xl transition-transform duration-300 hover:scale-[1.02]">
                        <video 
                            :src="data.href" 
                            :poster="useImage(data.poster, 80)" 
                            class="w-full h-full" 
                            controls autoplay
                            muted preload="auto" 
                            controlslist="nodownload">
                        </video>
                    </div>
                </div>

                <!-- 视频信息 -->
                <div class="space-y-5">
                    <h1 class="text-3xl font-bold text-gray-900 leading-tight">{{ data.title }}</h1>
                    
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b border-gray-200">
                        <!-- 用户信息 -->
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <img 
                                    :src="useImage(data.account?.avatar, '80')" 
                                    alt="" 
                                    class="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md">
                            </div>
                            <div class="flex flex-col gap-1">
                                <div class="font-semibold text-gray-700">{{ data.account?.name }}@{{ data.account?.user }}</div>
                                <you-follow type="video" :uuid="data.uuid" v-slot="{status}"></you-follow>
                            </div>
                        </div>
                        
                        <!-- 操作按钮 -->
                        <div>
                            <button v-copy="sharetext" class="bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg">
                                点赞/分享
                            </button>
                        </div>
                    </div>

                    <!-- 描述区域 -->
                    <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div class="text-sm text-gray-600 mb-4 flex items-center gap-2">
                            <span>{{ data.views }}</span>
                            <span>·</span>
                            <span>{{ useTimeago(data.created) }}</span>
                        </div>
                        
                        <div class="flex flex-wrap gap-2 mb-4">
                            <router-link 
                                v-for="(item, index) in data.keywords" 
                                :key="index"
                                :to="`/video/search?label=${item}`" 
                                class="bg-blue-50 text-gray-700 px-3 py-1 rounded-full text-sm no-underline transition-all duration-200 hover:bg-gray-100 hover:-translate-y-0.5">
                                #{{ item }}
                            </router-link>
                        </div>
                        
                        <p class="leading-relaxed text-gray-800 whitespace-pre-wrap">{{ data.description }}</p>
                    </div>
                </div>

                <!-- 评论区 -->
                <div class="pt-6 border-t border-gray-200">
                    <YouDiscuss mode="video" :code="uuid"></YouDiscuss>
                </div>
            </div>

            <!-- 侧边栏 -->
            <div class="w-full md:w-1/4 lg:w-1/5 xl:w-2/6">
                <div class="bg-white rounded-lg border border-gray-200 p-5 mb-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">相关标签</h3>
                    <div class="flex flex-col gap-3">
                        <div 
                            v-for="(item, index) in data.keywords" 
                            :key="index"
                            class="bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-md font-medium text-gray-700 cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-sm text-center"
                            @click="onLabel(item)">
                            {{ item }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else>
        <div class="flex items-center justify-center h-screen-sm">
            <div class="font-size-2xl  w-40 h-40 color-gray-400">{{ msg }}</div>
        </div>
    </template>
</template>

<script setup>
const state = reactive({
    uuid: '', err: 0, msg: '',
    data: {}, params: {}, query: {},
}), { err, msg, uuid, data, params, query } = toRefs(state), route = useRoute();

// 分享文本
const sharetext = computed(() => {
    let { uuid, title } = state.data;
    let text = [
        `视频: ${title}`,
        `网址: https://youloge.com/video/${uuid}`
    ].join(`\r\n`);
    return text
})
const onLabel = (keyword) => {

}
const loadMetadata = () => {
    const { uuid } = state
    apiFetch('video/info', { uuid: uuid }).then(data => {
        state.err = 200;
        state.data = data
    }).catch(err => {
        state.err = err.code;
        state.msg = err.message;
    })
}

onMounted(() => {
    state.query = route.query;
    state.params = route.params;
    state.uuid = route.params.uuid;
    loadMetadata()
})
</script>

<style>
/* 这里不需要任何自定义样式，全部使用 Tailwind CSS */
</style>