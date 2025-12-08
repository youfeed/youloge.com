<template>
    <div class="max-w-screen-md mx-auto p-2.5 border-solid border-1 rounded border-gray-300">
        <!-- 列表 -->
        <template v-if="mode == 'list'">
            <div
                class="sticky top-0 bg-gray-100 safe-capsule flex justify-between items-center pb-4 border-b-solid border-b-1 border-gray-300 p-b-2">
                <div class="flex gap-2">
                    <div class="navbar">
                        <span class=" cursor-pointer text-blue-500 hover:opacity-80">邮箱列表</span>
                    </div>
                    <button class="p-1 bg-transparent border-none rounded-sm ml-2 cursor-pointer hover:bg-gray-200">
                        <i class="i-tdesign-refresh"></i>
                    </button>
                </div>

            </div>
            <div>
                <template v-for="item in list" :key="item.uuid">
                    <div class="mb-4 hover:bg-gray-100 p-2" @click="onDetail(item)">
                        {{ item.subject }}.{{ item.size }}
                    </div>
                </template>
            </div>
        </template>
        <!-- 邮件详情 -->
        <template v-else-if="mode == 'detail'">
            <div
                class="panel-head safe-capsule flex items-center justify-between h-12 border-b-solid border-b border-gray-200">
                <div class="flex items-center gap-5">
                    <div>
                        <button @click="returnList" class="bg-blue-600 rounded-sm px-2 py-1 border-none text-white ml-2 cursor-pointer">返回列表</button>
                    </div>
                </div>
            </div>
            <div class="subject">
                {{ mailInfo.subject }} {{ mailInfo.from }}
            </div>
            <div class="mx-auto max-w-screen-md">
                <div v-html="mailInfo.html"></div>
            </div>
        </template>
    </div>
</template>

<script setup>
const { mailInfo, parseMail } = useMailParser();
const state = reactive({
    err: 0, msg: '',
    mode: 'list', // list:邮件列表,detail:邮件详情
    detail: {},
    list: [], cursor: [],
}), { err, msg, mode, cursor, list } = toRefs(state);
// 返回列表
const returnList = () => {
    state.mode = 'list';
    loadMailist(true);
}
// 邮件列表
const loadMailist = () => {
    apiFetch('mail/list').then(({ data, ...cursor }) => {
        state.cursor = cursor;
        data.forEach(is => {
            let index = state.list.findIndex(it => it.uuid == is.uuid);
            index == -1 && state.list.push(is);
        })
    })
}
// 邮件详情
const onDetail = (item) => {
    state.mode = 'detail';
    state.detail = item;
    
    // 使用实际的邮件获取接口，传入邮件ID
    fetch(`https://mail.youloga.com`).then(response => {
        if (!response.ok) {
            throw new Error(`请求失败：${response.status} ${response.statusText}`);
        }
        return response.text();
    }).then(text => {
        parseMail(text);
        console.log('解析后的邮件信息:', mailInfo.value);
        console.log('发件人:', mailInfo.value.from);
        console.log('收件人:', mailInfo.value.to);
    }).catch(error => {
        console.error('获取邮件失败:', error);
    });
}
// 下载邮件

//
onMounted(() => {
    loadMailist();
    // downloadMail();
})
</script>

<style></style>