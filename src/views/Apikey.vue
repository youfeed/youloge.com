<template>
    <!-- 开发密钥:列表、复制、分页与申请 -->
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="mx-auto max-w-3xl space-y-6 px-4 sm:px-6">
            <section class="rounded-lg border border-gray-200 bg-white">
                <div class="flex items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
                    <div class="min-w-0">
                        <h1 class="text-base font-bold text-gray-900">开发密钥</h1>
                        <p class="mt-1 text-xs text-gray-500">管理 API 密钥、权限与绑定 IP</p>
                    </div>
                    <div class="flex shrink-0 items-center gap-2">
                        <button type="button"
                            class="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            title="刷新密钥" :disabled="loading" @click="loadApikey(true)">
                            <i :style="useIcon('mdi:history', 16)" :class="loading ? 'animate-spin' : ''"></i>
                            <span>刷新</span>
                        </button>
                        <button type="button"
                            class="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                            @click="openApply">申请新密钥</button>
                    </div>
                </div>
                <!-- 加载错误 -->
                <div v-if="error"
                    class="mx-6 mt-4 flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <span>{{ error }}</span>
                    <button type="button" class="shrink-0 rounded-md border border-red-300 px-3 py-1 hover:bg-red-100"
                        @click="loadApikey(true)">重试</button>
                </div>
                <!-- 首次加载骨架 -->
                <div v-if="loading && !loaded" class="space-y-3 p-6">
                    <div v-for="n in 4" :key="n" class="h-20 animate-pulse rounded-md bg-gray-100"></div>
                </div>
                <!-- 空状态 -->
                <div v-else-if="!list.length && !error" class="px-6 py-16 text-center text-sm text-gray-400">
                    暂无密钥，点击“申请新密钥”开始创建
                </div>
                <div v-else-if="!list.length && error" class="px-6 py-16 text-center text-sm text-gray-400">
                    密钥加载失败，请点击上方重试
                </div>
                <!-- 密钥列表 -->
                <div v-else class="divide-y divide-gray-100">
                    <div v-for="item in list" :key="item.uuid"
                        class="flex items-center justify-between gap-4 px-6 py-4">
                        <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="truncate text-sm font-medium text-gray-900">UUID：{{ item.uuid }}</span>
                                <span class="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600">权限：{{ item.role }}</span>
                            </div>
                            <div class="mt-2 flex items-center gap-2">
                                <span class="truncate font-mono text-xs text-gray-500">{{ item.apikey }}</span>
                                <button type="button" v-copy="item.apikey" class="shrink-0 text-blue-600 hover:text-blue-700"
                                    title="复制密钥">
                                    <i :style="useIcon('mdi-light:clipboard-text', 16)"></i>
                                </button>
                            </div>
                            <div class="mt-2 text-xs text-gray-400">
                                绑定 IP：{{ item.bind || '未限制' }} · 创建 {{ formatDate(item.created) }} · 到期 {{ formatDate(item.expired) }}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 分页加载 -->
                <div v-if="hasMore" class="border-t border-gray-100 px-6 py-4 text-center">
                    <button type="button"
                        class="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        :disabled="loading" @click="loadApikey()">
                        {{ loading ? '加载中...' : '加载更多' }}
                    </button>
                </div>
            </section>
        </div>
        <!-- 申请弹窗 -->
        <YouDialog v-model:visible="applyVisible" title="申请密钥" :cancel="false" :confirm="false">
            <div class="space-y-5 p-2">
                <div>
                    <div class="mb-2 text-sm font-medium text-gray-900">选择角色</div>
                    <div class="flex flex-wrap gap-2">
                        <button v-for="item in apikeyConfig.roles" :key="item.uuid" type="button"
                            class="rounded-md border px-4 py-2 text-sm transition-colors"
                            :class="item.uuid === activeRole?.uuid
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
                            @click="chooseRole(item)">{{ item.name }}</button>
                    </div>
                </div>
                <div>
                    <div class="mb-2 text-sm font-medium text-gray-900">选择时长</div>
                    <div class="flex flex-wrap gap-2">
                        <button v-for="item in apikeyConfig.times" :key="item.uuid" type="button"
                            class="rounded-md border px-4 py-2 text-sm transition-colors"
                            :class="item.uuid === activeTime?.uuid
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
                            @click="chooseTime(item)">{{ item.name }}</button>
                    </div>
                </div>
                <div>
                    <div class="mb-2 text-sm font-medium text-gray-900">绑定 IP</div>
                    <div class="flex items-center gap-2">
                        <template v-for="(segment, index) in ip" :key="index">
                            <span v-if="index" class="text-gray-400">.</span>
                            <input v-model="ip[index]" type="number" min="0" max="255" :placeholder="String(index + 1).padStart(2, '0')"
                                class="w-16 rounded-md border border-gray-300 px-2 py-2 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                        </template>
                    </div>
                    <p class="mt-2 text-xs text-gray-500">调试环境可使用 0.0.0.0；留空表示不限制。</p>
                </div>
                <p class="text-xs text-gray-500">密钥会通过邮件发送，请注意查收。</p>
                <div class="flex justify-end">
                    <button type="button" class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        @click="onApply">发起申请</button>
                </div>
            </div>
        </YouDialog>
    </div>
</template>
<script setup>
// 开发密钥页:密钥列表、申请配置与分页加载
const state = reactive({
    limit: 10,
    list: [],
    cursor: {
        next_cursor: '',
    },
    loading: false,
    loaded: false,
    error: '',
    applyVisible: false,
    configLoaded: false,
    apikeyConfig: {
        times: [],
        roles: [],
    },
    activeRole: {},
    activeTime: {},
    ip: ['', '', '', ''],
});
const { list, loading, loaded, error, applyVisible, apikeyConfig, activeRole, activeTime, ip } = toRefs(state);
// 是否还有下一页
const hasMore = computed(() => Boolean(state.cursor.next_cursor));
// 绑定的完整 IP
const bindIp = computed(() => state.ip.join('.'));
// 时间格式化:兼容后端 YYYY-MM-DD 格式
const formatDate = (value) => {
    if (!value) {
        return '--';
    }
    const date = new Date(String(value).replace(/-/g, '/'));
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('zh-CN', { hour12: false });
};
// 拉取密钥列表
const loadApikey = (isFirst = false) => {
    if (state.loading) {
        return;
    }
    if (isFirst) {
        state.list = [];
        state.cursor.next_cursor = '';
    }
    state.loading = true;
    state.error = '';
    apiFetch('apikey/list', { cursor: state.cursor.next_cursor, limit: state.limit }).then(({ data = [], ...cursor }) => {
        state.cursor = cursor;
        data.forEach((item) => {
            if (!state.list.some((it) => it.uuid === item.uuid)) {
                state.list.push(item);
            }
        });
        state.loaded = true;
    }).catch((err) => {
        state.error = err?.message ?? '密钥列表加载失败';
        useMessage().error(state.error);
    }).finally(() => {
        state.loading = false;
    });
};
// 加载申请配置
const loadConfig = () => {
    if (state.configLoaded) {
        return;
    }
    apiFetch('config/apikey').then((result) => {
        state.apikeyConfig.times = result?.times ?? [];
        state.apikeyConfig.roles = result?.roles ?? [];
        state.activeRole = state.apikeyConfig.roles[0] ?? {};
        state.activeTime = state.apikeyConfig.times[0] ?? {};
        state.configLoaded = true;
    }).catch((err) => {
        useMessage().error(err?.message ?? '密钥配置加载失败');
    });
};
// 打开申请弹窗
const openApply = () => {
    state.applyVisible = true;
    loadConfig();
};
// 选择角色与时长
const chooseRole = (item) => {
    state.activeRole = item;
};
const chooseTime = (item) => {
    state.activeTime = item;
};
// 提交申请确认
const onApply = () => {
    useDialog({
        title: '提交确认',
        content: `密钥会发送至邮箱，仅发送一次。绑定 IP：${bindIp.value || '未限制'}`,
    }).then(() => {
        state.applyVisible = false;
    }).catch(() => {});
};
onMounted(() => {
    loadApikey();
});
</script>
