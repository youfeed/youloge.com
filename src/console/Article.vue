<template>
    <div class="max-w-screen-md mx-auto p-4">
        <div class="panel mb-4 bg-light p-2 rounded-sm">
            <template v-if="state.mode == 'preview'">
                <div class="panel-head flex items-center justify-between  h-10 border-b-solid border-b border-gray-200">
                    <div class="flex items-center gap-5">
                        <div>文章</div>
                        <div>草稿</div>
                    </div>
                    <div @click="newDraft">新建草稿</div>
                </div>
                <div class="panel-body pt-2">
                    <div class="lists">
                        <template v-for="item in data.data" :key="item.uuid">
                            <div class="list border-b-solid border-b border-gray-300 py-4">
                                <div class="">
                                    <router-link :to="`/article/${item.uuid}`" target="_blank"
                                        class="text-lg font-bold text-blue-600 hover:text-blue-500">
                                        {{ item.title }}
                                    </router-link>
                                </div>
                                <div class="flex justify-between items-center">
                                    <div class="text-sm text-gray-500">{{ item.created }} · {{ item.view }} · {{
                                        item.uuid }}</div>
                                    <template v-if="item.status == 0">
                                        <div class="text-sm text-gray-500" @click="onEditor(item)">编辑</div>
                                    </template>
                                    <template v-else-if="item.status == 1">
                                        <div class="text-sm text-gray-500">浏览</div>
                                    </template>
                                    <template v-else>
                                        <div class="text-sm text-gray-500">审核中</div>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <!-- README -->
                <div class="README">
                    README
                </div>
            </template>
            <template v-if="state.mode == 'draft'">
                <div class="panel-head flex items-center justify-between  h-10 border-b-solid border-b border-gray-200">
                    <div class="flex items-center gap-5">
                        <div>编辑模式·27 lines (15 loc) · 467 Bytes</div>
                    </div>
                    <div @click="onSave">保存草稿</div>
                </div>
                <div class="panel-body pt-2">
                    <form class="flex flex-col gap-4" @submit="onSubmit">
                        <div class="metadata">
                            <div class="poster">
                                <img src="" alt="">
                            </div>
                            <div class="title">
                                <input name="title" type="text" class="w-full" v-model="draft.title" placeholder="标题">
                            </div>
                            <div class="keywords"></div>
                            <div class="description">
                                <textarea name="description" id="" cols="30" rows="10" class="w-full" v-model="draft.description" placeholder="描述"></textarea>
                            </div>
                        </div>
                        <template v-if="draft.content">
                            <YouEditor name="content" v-model="draft.content"></YouEditor>
                        </template>
                        <div class="">
                            <p>记得保存: 文章需要通过审核</p>
                        </div>
                    </form>
                </div>
            </template>

            <div v-if="data.nextcure" class="">加载更多</div>
        </div>
    </div>
</template>

<script setup>
let params = defineProps(['params']); const emit = defineEmits(['jump']);
const state = reactive({
    err: 0, msg: '', data: {}, profile: {},
    mode: 'preview',// preview draft
    draft: {
        title: '',
        poster: '',
        content: '',
        keywords: '',
        description: '',
    },
}),{ err, msg, data, profile,draft } = toRefs(state);
// 加载文章列表
const loadArticle = ()=>{
    apiFetch('article/list', { cursor: state.data.next_cursor }).then(res => {
        Object.assign(state, res);
    }).catch(err => { });
};
// 文章预设
const initDraft = () => {
    let {uuid} = state.draft;
    apiFetch('article/draft', { uuid: uuid }).then(res => {
        Object.assign(state.draft, res.data);
        loadDraft()
    }).catch(err => { });
}
// 加载草稿正文
const loadDraft = () => {
    let { rich_down } = state.draft;
    fetch(rich_down).then(r => r.text()).then(text => {
        state.draft.content = text;
    }).catch(err => { 
        state.draft.content = `<p>暂无内容</p>`
    });
}
// 新建草稿
const newDraft = () => {
    apiFetch('article/create').then(res => {
        console.log(res)
    }).catch(err => { });
}
// 编辑草稿
const onEditor = (item) => {
    state.mode = 'draft';
    state.draft = item;
    initDraft();
    console.log(100,item);
}
// 保存草稿 1. 保存正文 2. 保存元数据 3. 保存状态
const onSave = () => {
    let { uuid, title, content,rich_load } = state.draft;
    let blob = new Blob([content], { type: 'text/plain' });
    let body = new FormData();
    body.append('key', uuid);
    body.append('file', blob,'1.txt');
    // form.append('token', 'images_upload_token');
    fetch(rich_load, { method: 'POST', body: body }).then(r => r.json()).then(text => {
        console.log(text)
        state.mode = 'preview';
    }).catch(err => { });
    // 保存元数据
    onSubmit()
    console.log('onSave',state.draft)
}
// 提交表单
const onSubmit = (e) => {
    e?.preventDefault();
    let { uuid, title, poster,keywords,description } = state.draft;
    apiFetch('article/update', { uuid, title, poster,keywords,description }).then(res => {
        console.log(res)
    }).catch(err => { });
}
//
onMounted(() => {
    loadArticle();
});
// 路由跳转(动态组件内部跳转)
const navigateTo = (path, params = '') => {
    emit('jump', path, params);
}
</script>

<style></style>