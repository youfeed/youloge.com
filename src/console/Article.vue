<template>
    <div class="max-w-screen-md mx-auto p-4">
        <div class="panel mb-4 bg-light p-2 rounded-sm">
            <template v-if="state.mode == 'preview'">
                <div class="panel-head flex items-center justify-between  h-10 border-b-solid border-b border-gray-200">
                    <div class="flex items-center gap-5">
                        <div @click="loadArticle">文章 <i class="i-tdesign-refresh"></i></div>
                        <div @click="loadArticle">草稿 <i class="i-tdesign-refresh"></i></div>
                    </div>
                    <div @click="newDraft">新建草稿</div>
                </div>
                <div class="panel-body pt-2">
                    <div class="lists">
                        <template v-for="item in list" :key="item.uuid">
                            <div class="list border-b-solid border-b border-gray-300 py-4">
                                <div class="">
                                    <router-link :to="`/article/${item.uuid}`" target="_blank"
                                        class="text-lg font-bold text-blue-600 hover:text-blue-500">
                                        {{ item.title }}
                                    </router-link>
                                </div>
                                <div class="flex justify-between items-center">
                                    <div class="text-sm text-gray-500">{{ item.created }} · {{ item.views }} · {{
                                        item.uuid }} · {{ item.status_text }}</div>
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
                        <div> <button @click="state.mode='preview'">返回</button> 编辑模式·27 lines (15 loc) · 467 Bytes</div>
                    </div>
                    <div @click="onSubmit">发布</div>
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
                                <textarea name="description" id="" cols="30" rows="10" class="w-full"
                                    v-model="draft.description" placeholder="描述"></textarea>
                            </div>
                        </div>
                        <template v-if="draft.content">
                            <YouEditor name="content" v-model="draft.content" @autosave="autoSave"></YouEditor>
                        </template>
                        <div class="">
                            <p>Ctrl+S: 可快速保存草稿</p>
                        </div>
                    </form>
                </div>
            </template>

            <div v-if="cursor.next_cursor" class="">加载更多</div>
        </div>
    </div>
</template>

<script setup>
let params = defineProps(['params']); const emit = defineEmits(['jump']);
const state = reactive({
    err: 0, msg: '', list: [], profile: {},
    mode: 'preview',// preview draft
    cursor: {
        next_cursor:''
    },
    draft: {
        title: '',
        poster: '',
        content: '',
        keywords: [],
        description: '',
        rich_down:'',
        rich_load:''
    },
}), { err, msg, list,cursor, profile, draft } = toRefs(state);
// 加载文章列表
const loadArticle = (isClear=false) => {
    isClear && (state.list = [],state.cursor.next_cursor = '');
    // 
    apiFetch('article/list', { cursor: state.cursor.next_cursor, }).then(({data,...cursor}) => {
        state.cursor = cursor;
        data.forEach(is=>{
            let findIndex = state.list.findIndex(it=>it.uuid == is.uuid);
            findIndex == -1 && state.list.push(is);
        });
    }).catch(error => {
        console.log(error);
        useMessage().error(error.messgae)
    });
};
// 文章预设
const initDraft = () => {
    let { uuid } = state.draft;
    apiFetch('article/draft', { uuid: uuid }).then(data => {
        state.draft = data;
        loadDraft()
    }).catch(err => { });
}
// 加载草稿正文
const loadDraft = () => {
    let load = useLoading();
    console.log('loadloadloadloadload',load)
    let { rich_down } = state.draft;
    fetch(`${rich_down}&t=${Date.now()}`).then(r => r.text()).then(text => {
        state.draft.content = text;
    }).catch(err => {
        state.draft.content = `<p>暂无内容</p>`
    }).finally(()=>{
        load.hide();
    });
    
}
// 新建草稿
const newDraft = () => {
    apiFetch('article/create').then(res => {
        state.cursor.next_cursor = ''
        loadArticle(true);
        console.log(res)
    }).catch(error => { 
        useMessage().error(error.message)
    });
}
// 编辑草稿
const onEditor = (item) => {
    state.mode = 'draft';
    state.draft = item;
    initDraft();
}
// 自动保存草稿 
const autoSave = (content)=>{
    let { uuid, title, rich_load } = state.draft;
    let blob = new Blob([content], { type: 'text/plain' });
    let formData = new FormData();formData.append('key', uuid);formData.append('file', blob, `${uuid}.txt`);
    fetch(rich_load, { method: 'POST', body: formData }).then(r => r.json()).then(({error,result}) => {
        if(error){
            useMessage().error(error.message)
        }
        if(result){
            // 保存元数据
            useMessage().success('自动保存成功')
        }
    }).catch(err => { 
        useMessage().error('网络错误')
    });
}
// 提交表单
const onSubmit = (e) => {
    e?.preventDefault();
    let { uuid, title, poster, keywords, description,content } = state.draft;
    autoSave(content);
    apiFetch('article/update', { uuid, title, poster, keywords, description }).then((res) => {
        console.log(res)
        state.mode = 'preview';
        loadArticle(true);
        seMessage().success('更新成功')
    }).catch(error => { 
        useMessage().error(error.message)
    });
}
//
onMounted(() => {
    loadArticle(true);
});
// 路由跳转(动态组件内部跳转)
const navigateTo = (path, params = '') => {
    emit('jump', path, params);
}
</script>

<style></style>