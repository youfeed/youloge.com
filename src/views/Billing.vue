<template>
    <!-- 消费账单:收支明细与分页加载 -->
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="mx-auto max-w-3xl space-y-6 px-4 sm:px-6">
            <!-- 标题与统计 -->
            <section class="rounded-lg border border-gray-200 bg-white">
                <div class="flex items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
                    <div class="min-w-0">
                        <h1 class="text-base font-bold text-gray-900">消费账单</h1>
                        <p class="mt-1 text-xs text-gray-500">查看账户收支明细，金额按变动前后余额计算。</p>
                    </div>
                    <button type="button"
                        class="inline-flex shrink-0 items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        title="刷新账单" :disabled="loading" @click="refresh">
                        <i :style="useIcon('mdi:history', 16)" :class="loading ? 'animate-spin' : ''"></i>
                        <span>刷新</span>
                    </button>
                </div>
                <div class="grid grid-cols-3 divide-x divide-gray-100 px-6 py-5">
                    <div class="text-center">
                        <div class="text-xs text-gray-500">已加载</div>
                        <div class="mt-1 text-lg font-semibold text-gray-900">{{ summary.count }}</div>
                    </div>
                    <div class="text-center">
                        <div class="text-xs text-gray-500">收入</div>
                        <div class="mt-1 text-lg font-semibold text-emerald-600">+{{ summary.income }}</div>
                    </div>
                    <div class="text-center">
                        <div class="text-xs text-gray-500">支出</div>
                        <div class="mt-1 text-lg font-semibold text-red-600">-{{ summary.expense }}</div>
                    </div>
                </div>
            </section>
            <!-- 加载错误提示 -->
            <div v-if="error"
                class="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span>{{ error }}</span>
                <button type="button" class="shrink-0 rounded-md border border-red-300 px-3 py-1 hover:bg-red-100"
                    @click="refresh">重试</button>
            </div>
            <!-- 账单列表 -->
            <section class="rounded-lg border border-gray-200 bg-white">
                <!-- 首次加载骨架 -->
                <div v-if="loading && !list.length" class="space-y-3 p-6">
                    <div v-for="n in 4" :key="n" class="h-16 animate-pulse rounded-md bg-gray-100"></div>
                </div>
                <!-- 空状态 -->
                <div v-else-if="!list.length && !error" class="px-6 py-16 text-center text-sm text-gray-400">
                    暂无账单记录
                </div>
                <div v-else-if="!list.length && error" class="px-6 py-16 text-center text-sm text-gray-400">
                    账单加载失败，请点击上方重试
                </div>
                <!-- 明细 -->
                <div v-else class="divide-y divide-gray-100">
                    <div v-for="item in list" :key="item.uuid ?? item.id"
                        class="flex items-center justify-between gap-4 px-6 py-4">
                        <div class="flex min-w-0 items-center gap-3">
                            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" :class="toneClass(item)">
                                <i :style="useIcon(direction(item) >= 0 ? 'mdi:chevron-double-down' : 'mdi:chevron-double-up', 18)"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="truncate text-sm font-medium text-gray-900">{{ item.remark || '账户变动' }}</div>
                                <div class="mt-1 text-xs text-gray-400">{{ formatDate(item.created) }}</div>
                            </div>
                        </div>
                        <div class="shrink-0 text-right">
                            <div class="text-sm font-semibold" :class="amountClass(item)">{{ amountText(item) }}</div>
                            <div class="mt-1 text-xs text-gray-400">余额 {{ formatNumber(item.latest) }}</div>
                        </div>
                    </div>
                </div>
                <!-- 分页加载 -->
                <div v-if="hasMore" class="border-t border-gray-100 px-6 py-4 text-center">
                    <button type="button"
                        class="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        :disabled="loading" @click="loadBilling()">
                        {{ loading ? '加载中...' : '加载更多' }}
                    </button>
                </div>
            </section>
        </div>
    </div>
</template>
<script setup>
// 消费账单页:收支明细、本地统计与分页加载
const state = reactive({
    list: [],
    cursor: {
        next_cursor: '',
    },
    loading: false,
    error: '',
});
const { list, loading, error } = toRefs(state);
// 是否还有下一页
const hasMore = computed(() => Boolean(state.cursor.next_cursor));
// 金额格式化:保留两位小数并加千分位
const formatNumber = (value) => Number(value || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
// 时间格式化:兼容后端 YYYY-MM-DD 格式
const formatDate = (value) => {
    if (!value) {
        return '--';
    }
    const date = new Date(String(value).replace(/-/g, '/'));
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('zh-CN', { hour12: false });
};
// 收支方向:1 收入,-1 支出,0 持平
const direction = (item) => {
    const diff = Number(item.latest) - Number(item.oldest);
    return diff > 0 ? 1 : diff < 0 ? -1 : 0;
};
// 收支图标与金额配色
const toneClass = (item) => direction(item) > 0
    ? 'bg-emerald-50 text-emerald-600'
    : direction(item) < 0 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500';
const amountClass = (item) => direction(item) > 0
    ? 'text-emerald-600'
    : direction(item) < 0 ? 'text-red-600' : 'text-gray-600';
// 带符号的变动金额
const amountText = (item) => {
    const sign = direction(item);
    const prefix = sign > 0 ? '+' : sign < 0 ? '-' : '';
    return `${prefix}${formatNumber(Math.abs(Number(item.latest) - Number(item.oldest)))}`;
};
// 已加载记录的本地统计
const summary = computed(() => {
    let income = 0;
    let expense = 0;
    state.list.forEach((item) => {
        const diff = Number(item.latest) - Number(item.oldest);
        if (diff > 0) {
            income += diff;
        } else if (diff < 0) {
            expense -= diff;
        }
    });
    return {
        count: state.list.length,
        income: formatNumber(income),
        expense: formatNumber(expense),
    };
});
// 拉取账单,支持刷新与加载更多
const loadBilling = (isFirst = false) => {
    if (state.loading) {
        return;
    }
    if (isFirst) {
        state.list = [];
        state.cursor.next_cursor = '';
    }
    state.loading = true;
    state.error = '';
    const nextCursor = isFirst ? '' : state.cursor.next_cursor;
    apiFetch('wallet/billing', { cursor: nextCursor }).then(({ data = [], ...cursor }) => {
        state.cursor = cursor;
        data.forEach((item) => {
            if (!state.list.some((it) => it.uuid === item.uuid)) {
                state.list.push(item);
            }
        });
    }).catch((err) => {
        state.error = err?.message ?? '账单加载失败';
        useMessage().error(state.error);
    }).finally(() => {
        state.loading = false;
    });
};
// 刷新账单
const refresh = () => loadBilling(true);
onMounted(() => loadBilling(true));
</script>
