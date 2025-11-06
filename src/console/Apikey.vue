<template>
    <div class="max-w-screen-md mx-auto p-4 border-solid border-1 rounded border-gray-300">
        <div class="flex justify-between items-center mb-4 border-b-solid border-b-1 border-gray-300 p-b-2">
            <div class="flex items-center gap-2">
                <div>开发密钥</div>
                <div @click="loadApikey(true)" class="i-tdesign-loading hover:animate-spin"></div>
            </div>
            <button @click="onCreate" v-ripple
                class="bg-blue-600 rounded-sm px-2 py-1 border-none text-white ml-2 cursor-pointer">
                <YouIcon name="mdi-light:plus" />
                <span>申请新密钥</span>
            </button>
        </div>
        <div>
            <template v-for="item in list" :key="item.id">
                <div class="mb-2 hover:bg-gray-100 hover:rounded-lg p-2">
                    <div class="font-medium flex justify-between items-center">
                        <div>UUID:{{ item.uuid }} - 权限:{{ item.role }}</div>
                        <div>
                            <span>IP:{{ item.bind }}</span>
                            <span class=""></span>
                        </div>
                    </div>
                    <div class="text-sm text-dark-50 flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="max-w-30 truncate">{{ item.apikey }}</div>
                            <div class="cursor-pointer" v-copy="item.apikey">
                                <YouIcon name="mdi-light:clipboard-text"></YouIcon>
                            </div>
                        </div>
                        <div>{{ item.created }} / {{ item.expired }}</div>
                    </div>
                </div>
            </template>
            <div v-if="cursor.next_cursor" @click="loadApikey()">加载更多</div>
        </div>
        <!-- 申请弹窗 -->
        <YouDialog v-model:visible="applyVisible" title="申请密钥" :cancel="false" :confirm="false">
            <div>
                <div>
                    <div>选择角色: <span class="font-bold">{{ activeRole.name }}</span></div>
                    <div class="flex gap-1 my-2">
                        <template v-for="item in apikeyConfig.roles" :key="item.uuid">
                            <div @click="activeRole = item"
                                :class="[item.uuid == activeRole.uuid ? 'bg-blue text-white' : 'border-blue-800 text-blue-500']"
                                class="flex-inline px-5 py-2 rounded-lg border border-solid  font-medium transition-all duration-200 hover:outline-none">
                                {{ item.name }}</div>
                        </template>
                    </div>
                </div>
                <div>
                    <div>选择时长: <span class="font-bold">{{ activeTime.name }}</span></div>
                    <div class="flex gap-1 my-2">
                        <template v-for="item in apikeyConfig.times" :key="item.uuid">
                            <div @click="activeTime = item"
                                :class="[item.uuid == activeTime.uuid ? 'bg-blue text-white' : 'border-blue-800 text-blue-500']"
                                class="flex-inline px-5 py-2 rounded-lg border border-solid  font-medium transition-all duration-200 hover:outline-none">
                                {{ item.name }}</div>
                        </template>
                    </div>
                </div>
                <div>
                    <div>绑定IP 调试IP可使用 0.0.0.0 </div>
                    <div class="my-2">
                        <div class="flex items-center gap-1 md:gap-2 max-w-md w-full">
                            <input class="w-16 md:w-20 h-10 px-3 rounded-md border border-gray-300 
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                  text-center text-sm md:text-base font-medium transition-all duration-200" type="number" max="255"
                                min="0" placeholder="01">
                            <span class="text-gray-500 text-lg">.</span>
                            <input class="w-16 md:w-20 h-10 px-3 rounded-md border border-gray-300 
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                  text-center text-sm md:text-base font-medium transition-all duration-200" type="number" max="255"
                                min="0" placeholder="02">
                            <span class="text-gray-500 text-lg">.</span>
                            <input class="w-16 md:w-20 h-10 px-3 rounded-md border border-gray-300 
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                  text-center text-sm md:text-base font-medium transition-all duration-200" type="number" max="255"
                                min="0" placeholder="03">
                            <span class="text-gray-500 text-lg">.</span>
                            <input class="w-16 md:w-20 h-10 px-3 rounded-md border border-gray-300 
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                  text-center text-sm md:text-base font-medium transition-all duration-200" type="number" max="255"
                                min="0" placeholder="04">
                        </div>
                    </div>
                </div>
                <div class="my-2">密钥会通过邮件发送邮箱,请注意查收</div>
                <div class="flex justify-end">
                    <div
                        @click="onApply"
                        class="flex-inline px-5 py-2 text-blue-500 bg-blue text-white rounded-lg border border-solid  font-medium transition-all duration-200 hover:outline-non">
                        发起申请</div>
                </div>
            </div>
        </YouDialog>
    </div>
</template>

<script setup>
const props = defineProps(['params']), emit = defineEmits(['jump']);
const state = reactive({
    err: 0, msg: '',
    applyVisible: false,
    activeTime: {},
    activeRole: {},
    apikeyConfig: {
        status: false,
        times: [],
        roles: [],
    },
    list: [],
    cursor: {
        limlt: 10,
        next_cursor: '',
    },
}), { err, msg, cursor, list, applyVisible, apikeyConfig, activeRole, activeTime } = toRefs(state);
//
const loadApikey = (isFirst = false) => {
    isFirst && (state.list = [], state.cursor.next_cursor = '');
    let load = useLoading();
    let { next_cursor, limit } = state.cursor;
    apiFetch('apikey/list', { cursor: next_cursor, limit: limit }).then(({ data, ...cursor }) => {
        state.cursor = cursor;
        data.forEach(is => {
            let i = state.list.findIndex(it => it.uuid == is.uuid);
            i == -1 && state.list.push(is)
        });
    }).catch(err => {
        useMessage().error(err.message)
    }).finally(() => {
        load.close();
    });
}
// 加载配置
const loadConfig = () => {
    let { status } = state.apikeyConfig;
    status || apiFetch('config/apikey').then(result => {
        state.apikeyConfig.status = true;
        state.apikeyConfig.times = result.times.map(is => (is.actived = false, is))
        state.apikeyConfig.roles = result.roles.map(is => (is.actived = false, is))
        console.log(state.apikeyConfig.times)
    });
}
// 新增密钥
const onCreate = () => {
    state.applyVisible = true;
    
    // confirm
    // APIKEY 配置表
}
// 发起申请
const onApply = ()=>{
    useDialog({
        title:'提交确认',
        content:'密钥会发送邮箱,仅发送一次'
    }).then(res=>{
        state.applyVisible = false;
        console.log('ok')
    }).catch(()=>{})
}
// 
const chooseTime = (item) => {
    state.activeTime = item
}
//
onMounted(() => {
    loadApikey();
    loadConfig();
})
</script>

<style></style>