<template>
    <!-- 顶部菜单栏 -->
    <div class="navbar flex items-center justify-center gap-4 mt-2">
        <template v-for="(item, index) in navigation" :key="index">
            <div class="text-sm px-4 py-1 cursor-pointer hover:bg-light-500" :class="[{ 'text-blue': item.active }]"
                @click="item.active = !item.active">{{ item.name }}</div>
        </template>
    </div>
    <!-- 主内容区 -->
    <div class="max-w-3xl mx-auto mt-8 px-4 sm:px-6 md:px-8">
        <div class="bg-white rounded-xl p-6 shadow-md  flex flex-col gap-2">
            <template v-for="item in list" :key="item.uuid">
                <div class="article flex w-full border-b-solid border-b border-gray-200 py-4">
                    <div v-if="item.poster" class="mr-2 w-14 h-14">
                        <img :src="useImage(item.poster, '80')" :alt="item.title" class="rounded-sm w-14 h-14">
                    </div>
                    <div class="flex-1">
                        <div class="line-clamp-1">
                            <router-link class=" text-gray-900" :to="`/article/${item.uuid}`">{{ item.title }}</router-link>
                        </div>
                        <div class=" line-clamp-2">
                            <div class="text-sm text-gray-600">
                                <router-link class=" text-gray-900" :to="`/article/${item.uuid}`">{{ item.description }}</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
    <!-- 右侧边栏 (md:隐藏)
    <div class="asider hidden md:block md:w-1/4 lg:w-1/5 order-3 wing-transition">
        <div class="bg-white rounded-xl p-6 shadow-md h-full">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i class="fa fa-bullhorn mr-2 text-accent"></i>asider
            </h2>
        </div>

    </div> -->
</template>

<script setup>
const state = reactive({
    err: 0,
    msg: '',
    cursor: {
        offset: 0,
        limit: 10,
        filter:[
            "keywords IN [自签证书,推荐]"
        ]
    },
    list: [],
    navigation: [
        {
            name: '推荐',
            active: true
        }, {
            name: '科技',
            active: false
        }, {
            name: '生活',
            active: false
        }, {
            name: '国际',
            active: false
        }
    ]
}), { err, msg, navigation, list } = toRefs(state);
// 
const onSearch = (isFirst = false) => {
    isFirst && (state.list = [], state.cursor.limit = 10, state.cursor.offset = 0);
    let { offset, limit,filter } = state.cursor;
    apiFetch('search/article', { 
        q: '*', 
        offset: offset, 
        limit: limit,
        // filter:filter 
    }).then(({ hits, ...cursor }) => {
        state.cursor = cursor;
        state.list = hits
    }).catch((err) => {
        console.log('err', state, err)
    });
}

onMounted(() => {
    onSearch();
})
</script>

<style></style>