<template>
    <div class="max-w-screen-md mx-auto p-4 border-solid border-1 rounded border-gray-300">
        <template v-if="mode == 'preview'">
            <div class="flex justify-between items-center mb-4 border-b-solid border-b-1 border-gray-300 p-b-2">
                <div class="flex gap-2">
                    <div class="navbar">
                        <span>云盘文件</span>
                        <span>已购文件</span>
                    </div>
                    <button @click="reFresh"
                        class="p-1 bg-transparent border-none rounded-sm ml-2 cursor-pointer hover:bg-gray-200">
                        <i class="i-tdesign-refresh"></i>
                    </button>
                </div>
                <button @click="onChoose"
                    class="bg-blue-600 rounded-sm px-2 py-1 border-none text-white ml-2 cursor-pointer"><span
                        class="i-tdesign:arrow-up-circle"></span>上传</button>
            </div>
            <div>
                <template v-for="item in list" :key="item.id">
                    <div class="mb-4 hover:bg-gray-100 p-2">
                        <div class="font-medium">
                            <p class="text-current decoration-none hover:opacity-80">{{ item.title }}{{ item.kind }}</p>
                            <!-- <router-link :to="`/drive/${item.uuid}`" target="_blank"
                                class="text-current decoration-none hover:opacity-80">
                                {{ item.title }}{{ item.kind }}
                            </router-link> -->
                        </div>
                        <div>
                            {{ useBytes(item.size) }} · {{ item.mime }} {{ useTimeago(item.created) }}
                        </div>

                        <div class="flex justify-between">
                            <div>
                                <div class="text-sm ">售价:<span class="text-red-500">#<sup>{{ item.amount
                                }}</sup>RGB</span>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <span v-if="item.status == 0" @click="onModify(item)" class="cursor-pointer text-green hover:opacity-60">修改</span>
                                <span v-if="item.status == 1" @click="onBrowse(item)" class="cursor-pointer text-blue hover:opacity-60">查看</span>
                                <span v-if="item.status == 0" @click="onPublish(item)" class="cursor-pointer text-orange hover:opacity-60">上架</span>
                                <span v-if="item.status == 10" @click="unPublish(item)" class="cursor-pointer text-red hover:opacity-60">下架</span>
                            </div>
                        </div>
                    </div>
                </template>
                <div v-if="data.next_cursor" @click="loadDrive(false)">加载更多</div>
            </div>
        </template>
        <template v-else-if="mode == 'draft'">
            <div class="panel-head flex items-center justify-between  h-10 border-b-solid border-b border-gray-200">
                <div class="flex items-center gap-5">
                    <div @click="onExit" class="p-1 rounded bg-gray-300 text-gray-900 cursor-pointer">返回列表</div>
                </div>
                <div>UUID: {{ draft.uuid }} ({{ useBytes(draft.size) }})</div>
            </div>
            <div class="panel-body pt-2">
                <form class="flex flex-col gap-4">
                    <div class="title relative">
                        <label class="my-2">
                            <input rows="1" name="title" v-model="draft.title"
                                class="border-0 p-2 w-full text-6 h-10 truncate resize-none"
                                placeholder="请输入标题(最多64个字)" />
                        </label>
                        <p class="absolute right-1 bottom-1 text-sm text-gray-400">{{ draft.title.length }} / 64 </p>
                    </div>
                    <div class="description">
                        <div class="label">描述说明</div>
                        <div class="description relative flex-1">
                            <input rows="1" name="title" v-model="draft.description"
                                class="border-0 w-full p-2 h-10 truncate resize-none" placeholder="描述不超 144个字" />
                            <p class="absolute right-1 bottom-1 text-sm text-gray-400">{{ draft.description.length }} / 144 </p>
                        </div>
                    </div>
                    <div class="keywords">
                        <div class="label">话题标签</div>
                        <div class="flex gap-1">
                            <you-tag v-model="draft.keywords" :min="1" :max="6" editor></you-tag>
                        </div>
                    </div>
                    <div class="money">
                        <div class="label">销售价格: </div>
                        <div class="flex gap-4 items-center justify-center">
                            <div>
                                <p>您收款</p>
                                <input type="number" min="0.01" max="5000" v-model="draft.payer"
                                    @change="payerChange" />
                            </div>
                            <div>
                                <p>买家支付</p>
                                <input type="number" min="0.01" max="5000" v-model="draft.payee"
                                    @change="payeeChange" />
                            </div>
                        </div>
                        <div>手续费45%+开发者佣金5%</div>
                    </div>
                    <hr class="my-1" />
                    <div class="metadata">
                        <div class="poster flex">
                            <div class="label w-20">封面设置</div>
                            <div class="flex-auto" @click="onPoster">
                                <img :src="useImage(draft.poster, 80)" alt="">
                                <p>图片上传格式支持 JPEG、JPG、PNG</p>
                            </div>
                        </div>

                    </div>

                </form>
                <div class="flex justify-end gap-4 mt-5">
                    <div class="p-2 bg-blue-400 text-light-50 rounded cursor-pointer" @click="saveSettings">保存设置</div>
                    <div class="p-2 bg-red-400 text-light-50 rounded cursor-pointer" @click="releaseReview">发布审核</div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>

const router = useRouter()
const props = defineProps(['params']), emit = defineEmits(['jump']);
const state = reactive({
    err: 0, msg: '', data: {}, list: [],
    mode: 'preview',// preview draft
    // 分页游标
    cursor: {
        next_cursor: ''
    },
    draft: {
        title: '',
        poster: '',
        content: '',
        keywords: '',
        description: '',
    },
}), { err, msg, data, list, mode, draft } = toRefs(state);
//
const loadDrive = (isFirst = false) => {
    isFirst && (state.cursor.next_cursor = '', state.list = []);
    let { next_cursor } = state.cursor;
    apiFetch('drive/list', { cursor: next_cursor }).then(res => {
        state.err = 200;
        let { data, ...cursor } = res
        // 去重追加
        data.forEach(is => {
            let findIndex = state.list.findIndex(it => it.uuid == is.uuid);
            if (findIndex == -1) {
                state.list.push(is);
            }
        });
        state.cursor = cursor;
    }).catch(error => {
        state.msg = error.message;
    });
}
//
const reFresh = () => {
    state.data.next_cursor = null;
    state.list = [];
    loadDrive(true)
}
// 上传文件
const onChoose = () => {
    useMaterial({ type: 'drive', limit: 1 }).then(([res]) => {
        console.log('上传文件', res)
        onCreate(res)
    });
}
// 新增云盘
const onCreate = (material) => {
    apiFetch('drive/create', { uuid: material.uuid }).then(res => {
        useMessage().success('新增成功');
        loadDrive(true)
    }).catch(err => {
        useMessage().error(err.message)
    })
}
// 修改文件
const onModify = (item) => {
    item.payer = Number(item.amount).toFixed(2);
    item.payee = Number(item.amount / 2).toFixed(2);
    state.draft = item;
    state.mode = 'draft';

}
// 退出编辑
const onExit = () => {
    state.draft = {}
    state.mode = 'preview';
    loadDrive(true)
}
// 卖家收款
const payerChange = (e) => {
    let { value } = e.target;
    e.target.value = Number(value).toFixed(2);
    state.draft.payee = (value * 2).toFixed(2);
    state.draft.amount = (value * 2).toFixed(2);
    console.log('payerChange', e.target.value)
}
// 买家付款
const payeeChange = (e) => {
    let { value } = e.target;
    e.target.value = Number(value).toFixed(2);
    state.draft.payer = (value / 2).toFixed(2);
    state.draft.amount = (value / 2).toFixed(2);
    console.log('payeeChange', e)
}
// 更换封面
const onPoster = () => {
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
// 保存设置
const saveSettings = () => {
    let { uuid, title, keywords, description, amount, poster } = state.draft;
    apiFetch('drive/update', { uuid, title, keywords, description, amount, poster }).then(res => {
        console.log(res)
        useMessage().success(res.message)
    }).catch(err => {
        useMessage().error(err.message)
    })
}
// 上架文件
const onPublish = (item) => {
    apiFetch('drive/status', {
        uuid: item.uuid,
        status: 10,
        remark: '申请上架'
    }).then(res => {
        item.status = 10;
        useMessage().success('申请上架成功');
    }).catch(err => {
        useMessage().error(err.message);
    })
}
// 下架文件
const unPublish = (item) => {
    apiFetch('drive/status', {
        uuid: item.uuid,
        status: 0,
        remark: '下架撤回'
    }).then(res => {
        item.status = 0;
        useMessage().success('下架撤回成功');
    }).catch(err => {
        useMessage().error(err.message);
    })
}
// 查看预览
const onBrowse = (item) => {
    window.open(`/drive/${item.uuid}`)
    // router.push(`/drive/${item.uuid}`)
}
onMounted(() => {
    loadDrive()
});
</script>

<style></style>