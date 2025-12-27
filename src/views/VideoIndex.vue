<template>
    <div id="container" class="m-2 sm:m-4 md:m-8">
        <!-- 英雄区域 -->

        <!-- 宫格内容 -->
        <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
            <template v-for="item in lists" :key="item.uuid">
                <div class="video-card group">
                    <router-link :to="`/video/${item.uuid}`">
                        <div class="relative rounded-lg overflow-hidden aspect-video bg-gray-100 mb-3">
                            <img :src="useImage(item.poster,150)" :alt="item.title"
                                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
                            <span
                                class="video-duration absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">05:24</span>
                            <div
                                class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div
                                    class="w-12 h-12 bg-primary rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    <i class="fa fa-play text-white ml-1"></i>Play
                                </div>
                            </div>
                        </div>
                    </router-link>
                    <router-link :to="`/video/${item.uuid}`"
                        class="font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {{item.title}} </router-link>
                    <div class="flex items-center text-sm text-gray-500">
                        <span class="line-clamp-1">{{item.account.name}}</span>
                        <span class="mx-2">•</span>
                        <span>{{item.views}}次观看</span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup>
import apiFetch from '../composables/apiFetch';

const state = reactive({
    lists: [],
    // 分页游标
    cursor: {
        limit: 10,
        offset: 0,
        status: '',
        next_cursor: ''
    },
    title: 'Youloge 视频点播',
    mode: 'preview',// preview draft
}), { title, lists } = toRefs(state);

// 加载搜索
const loadSearch = () => {
    const { cursor } = state;
    apiFetch('search/video', {
        q: '*',
        offset: cursor.offset,
        limit: cursor.limit,
    }).then(({ hits, ...cursor }) => {
        state.cursor = cursor;
        hits.forEach(is => {
            let inx = state.lists.findIndex(it => it.uuid == is.uuid);
            inx == -1 && state.lists.push(is)
        });
    })

}


const io = new IntersectionObserver((entries, observer) => {

}, { rootMargin: '0px', threshold: 1.0 });
//
onMounted(() => {
    document.title = state.title;
    loadSearch();
    // io.observe(document.querySelector("#loading"));
});
</script>

<style></style>