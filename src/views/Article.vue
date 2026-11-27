<template>
    <div class="max-w-screen-md mx-auto">
        <div class="panel bg-light rounded-sm flex flex-col justify-between h-screen md:h-auto">
            <template v-if="state.mode == 'preview'">
                <div
                    class="panel-head safe-capsule flex items-center justify-start gap-2 h-10 border-b-solid border-b border-gray-200">
                    <div @click="loadArticle">文章</div>
                    <div @click="loadArticle()">已发布</div>
                    <div @click="loadArticle()">审核中</div>
                    <div @click="loadArticle()">草稿</div>
                </div>
                <div class="panel-body pt-2 flex-1">
                    <div class="lists overflow-hidden overflow-y-auto">
                        <template v-for="item in list" :key="item.uuid">
                            <div class="list border-b-solid border-b border-gray-300 py-4">
                                <div class="text-lg font-bold text-gray-600">
                                    {{ item.title }}
                                </div>
                                <div class="flex justify-between items-center px-2">
                                    <div class="text-sm text-gray-500">{{
                                        item.uuid }} · {{ item.created }} · {{ item.views }} · {{ item.status_text }}
                                    </div>
                                    <template v-if="item.status == 0">
                                        <div class="text-sm text-green-500 cursor-pointer" @click="onEditor(item)">编辑草稿
                                        </div>
                                    </template>
                                    <template v-else-if="item.status == 1">
                                        <div class="text-sm text-gray-500">
                                            <router-link :to="`/article/${item.uuid}`" target="_blank"
                                                class="text-blue-600 hover:text-blue-500">
                                                浏览作品
                                            </router-link>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="text-sm text-red-400 cursor-pointer" @click="revokeReview(item)">
                                            撤回审核</div>
                                    </template>
                                </div>
                            </div>
                        </template>
                        <div v-if="cursor.next_cursor"
                            class="my-10 flex items-center justify-center cursor-pointer text-blue-600 hover:text-blue-500"
                            @click="loadArticle()">加载更多</div>
                    </div>
                </div>
                <div class="panel-foot h-15 flex items-center justify-between gap-2">
                    <div @click="newDraft">新建草稿</div>
                    <div class="">文章提交审核通过后将无法在修改</div>
                </div>
                <!-- README -->
            </template>
            <template v-if="state.mode == 'draft'">
                <div
                    class="panel-head safe-capsule flex items-center justify-between h-12 border-b-solid border-b border-gray-200">
                    <div class="flex items-center gap-5">
                        <div>
                            <button @click="returnList">返回列表</button>
                        </div>
                    </div>
                </div>
                <div class="panel-body pt-2 flex-1">
                    <form class="flex flex-col gap-4">
                        <div class="title">
                            <label class="my-2">
                                <input rows="1" name="title" v-model="draft.title"
                                    class="border-0 p-2 w-full text-6 h-10 truncate bg-white resize-none"
                                    placeholder="请输入标题(最多64个字)" />
                            </label>
                        </div>
                        <template v-if="draft.content">
                            <YouEditor name="content" v-model="draft.content" @autosave="saveDraft"></YouEditor>
                        </template>
                        <hr class="my-1" />
                        <div class="setting bg-light-50 p-1">
                            <h3 class="text-md font-bold">发布设置：<span class="text-gray-500">良好的标题描述更容易被搜索到</span></h3>
                            <div class="metadata flex flex-col gap-2 border-1 border-gray-500 p-2">
                                <div class="poster flex">
                                    <div class="label w-20">封面设置</div>
                                    <div class="flex-auto" @click="onPoster">
                                        <img :src="useImage(draft.poster, 80)" alt="">
                                        <p>图片上传格式支持 JPEG、JPG、PNG</p>
                                    </div>
                                </div>
                                <div class="keywords">
                                    <div class="label">话题标签</div>
                                    <div class="flex gap-1 bg-white p-2">
                                        <div class="flex gap-1">
                                            <template v-for="(item, index) in draft.keywords" :key="index">
                                                <div class="border-1 rounded p-1 relative">
                                                    <span>#{{ item }}</span>
                                                    <span class="absolute w-4 h-4 -right-1 -top-1 flex items-center justify-center cursor-pointer bg-red-400 text-white rounded-full" @click="deleteKeyword" :data-index="index">x</span>
                                                </div>
                                            </template>
                                        </div>
                                        <div class="border-1 rounded p-1 flex-auto" v-if="draft.keywords.length < 7">
                                            <input type="text" class="border-0 outline-none w-full" @change="keywordChange">
                                        </div>
                                    </div>
                                </div>
                                <div class="description">
                                    <div class="label">文章描述</div>
                                    <div class="description">
                                        <input rows="1" name="title" v-model="draft.description"
                                            class="border-1 p-2 h-10 truncate bg-white w-full resize-none"
                                            placeholder="描述不超 144个字" />
                                        <p class="text-gray-500 text-sm">描述不超 144个字</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="panel-foot flex items-center justify-between gap-2">
                    <div class="p-2 bg-green-400 text-light-50 rounded cursor-pointer" @click="saveDraft">保存草稿(Ctrl+S)
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="p-2 bg-blue-400 text-light-50 rounded cursor-pointer" @click="saveSettings">保存设置
                        </div>
                        <div class="p-2 bg-red-400 text-light-50 rounded cursor-pointer" @click="releaseReview">发布审核
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { onUnmounted } from 'vue';

let params = defineProps(['params']); const emit = defineEmits(['jump']);
const state = reactive({
    err: 0, msg: '', list: [], profile: {},
    mode: 'preview',// preview draft
    status: '',// 0 草稿 1 发布 2 审核 3 驳回 4 撤回 5 删除
    cursor: {
        next_cursor: ''
    },
    draft: {
        title: '',
        poster: '',
        content: '',
        keywords: [],
        description: '',
        rich_down: '',
        rich_load: ''
    },
}), { err, msg, list, cursor, status, profile, draft } = toRefs(state);
// 返回列表
const returnList = () => {
    state.mode = 'preview';
    loadArticle(true);
}
// 加载文章列表
const loadArticle = (isClear = false) => {
    isClear && (state.list = [], state.cursor.next_cursor = '');
    // 
    apiFetch('article/list', { cursor: state.cursor.next_cursor }).then(({ data, ...cursor }) => {
        state.cursor = cursor;
        data.forEach(is => {
            let findIndex = state.list.findIndex(it => it.uuid == is.uuid);
            findIndex == -1 && state.list.push(is);
        });
    }).catch(error => {
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
    console.log('loadloadloadloadload', load)
    let { rich_down } = state.draft;
    fetch(`${rich_down}&t=${Date.now()}`).then(r => r.text()).then(text => {
        state.draft.content = text;
    }).catch(err => {
        state.draft.content = `<p>暂无内容</p>`
    }).finally(() => {
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
// 发布审核 releaseReview
const releaseReview = (e) => {
    e?.preventDefault();
    let load = useLoading();
    let { uuid } = state.draft;
    apiFetch('article/status', { uuid: uuid, status: 10 }).then((res) => {
        useMessage().success('状态修改成功');
        setTimeout(() => {
            returnList()
        }, 1500)
    }).catch(error => {
        useMessage().error(error.message)
    }).finally(() => {
        load.close();
    });
}
// 撤回审核 revokeReview
const revokeReview = (item) => {
    apiFetch('article/status', { uuid: item.uuid, status: 0 }).then((res) => {
        useMessage().success('状态修改成功');
        item.status = 0;
    }).catch(error => {
        useMessage().error(error.message)
    }).finally(() => {
        load.close();
    });
}
// 保存设置
const saveSettings = (e) => {
    e?.preventDefault();
    let load = useLoading();
    let { uuid, title, poster, keywords, description } = state.draft;
    apiFetch('article/update', { uuid, title, poster, keywords, description }).then((res) => {
        useMessage().success('保存设置成功')
    }).catch(error => {
        useMessage().error(error.message)
    }).finally(() => {
        load.hide();
    });
}
// 保存草稿
const saveDraft = () => {
    let load = useLoading();
    let { uuid, content, rich_load } = state.draft;
    let blob = new Blob([content], { type: 'text/plain' });
    let formData = new FormData(); formData.append('key', uuid); formData.append('file', blob, `${uuid}.txt`);
    fetch(rich_load, { method: 'POST', body: formData }).then(r => r.json()).then(({ error, result }) => {
        if (error) {
            useMessage().error(error.message)
        }
        if (result) {
            // 保存元数据
            useMessage().success('自动保存成功')
        }
    }).catch(err => {
        useMessage().error('网络错误')
    }).finally(() => {
        load.close();
    });
}
// 选择封面
const onPoster = () => {
    console.log('onPoster')
    useMaterial({
        type: 'image',
        limit: 1
    }).then(([result]) => {
        state.draft.poster = result.etag
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}
// 添加标签
const keywordChange = (e) => {
    let { value } = e.target;
    let findIndex = state.draft.keywords.findIndex(it => it == value);
    findIndex == -1 && state.draft.keywords.push(value);
    e.target.value = ''
    console.log('keywordChange', state.draft.keywords)
}
// 删除标签
const deleteKeyword = (e) => {
    let { index } = e.target.dataset;
    console.log('deleteKeyword', index)
    state.draft.keywords.splice(index, 1)
}
// 按键监听
const handleKeydown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        state.mode == 'draft' && saveDraft()
    }
}
//
onMounted(() => {
    loadArticle(true);
    window.addEventListener('keydown', handleKeydown)
});
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
});
</script>

<style></style>