<template>
    <!-- 我的钱包:余额、猫币、积分与充值 -->
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="mx-auto max-w-3xl space-y-6 px-4 sm:px-6">
            <section class="rounded-lg border border-gray-200 bg-white">
                <div class="flex items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
                    <div class="min-w-0">
                        <h1 class="text-base font-bold text-gray-900">我的钱包</h1>
                        <p class="mt-1 text-xs text-gray-500">账户余额与充值入口</p>
                    </div>
                    <button type="button"
                        class="inline-flex shrink-0 items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        title="刷新余额" :disabled="loading" @click="loadOverage">
                        <i :style="useIcon('mdi:history', 16)" :class="loading ? 'animate-spin' : ''"></i>
                        <span>刷新</span>
                    </button>
                </div>
                <!-- 加载错误 -->
                <div v-if="error"
                    class="mx-6 mt-4 flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <span>{{ error }}</span>
                    <button type="button" class="shrink-0 rounded-md border border-red-300 px-3 py-1 hover:bg-red-100"
                        @click="loadOverage">重试</button>
                </div>
                <!-- 首次加载骨架 -->
                <div v-if="loading && !loaded" class="space-y-3 p-6">
                    <div class="h-28 animate-pulse rounded-lg bg-gray-100"></div>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div class="h-20 animate-pulse rounded-lg bg-gray-100"></div>
                        <div class="h-20 animate-pulse rounded-lg bg-gray-100"></div>
                    </div>
                </div>
                <!-- 资产信息 -->
                <div v-else class="grid gap-4 p-6 sm:grid-cols-2">
                    <div class="rounded-lg bg-blue-50 p-5 sm:col-span-2">
                        <div class="text-xs text-blue-600">账户余额</div>
                        <div class="mt-2 text-3xl font-bold text-blue-700">#{{ formatNumber(overage.balance) }} RGB</div>
                    </div>
                    <div class="rounded-lg border border-gray-100 p-5">
                        <div class="text-xs text-gray-500">猫币</div>
                        <div class="mt-2 text-2xl font-semibold text-gray-900">{{ formatNumber(overage.catcoin) }}</div>
                    </div>
                    <div class="rounded-lg border border-gray-100 p-5">
                        <div class="text-xs text-gray-500">积分</div>
                        <div class="mt-2 text-2xl font-semibold text-gray-900">{{ formatNumber(overage.integral) }}</div>
                    </div>
                </div>
                <!-- 充值入口 -->
                <div class="flex items-center justify-between gap-3 border-t border-gray-100 px-6 py-5">
                    <div class="min-w-0">
                        <div class="text-sm font-medium text-gray-900">海外账户·大额充值</div>
                        <div class="mt-1 text-xs text-gray-500">1:1 比例充值为 # RGB</div>
                    </div>
                    <button type="button"
                        class="shrink-0 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        @click="onCharge">账户充值</button>
                </div>
            </section>
        </div>
        <!-- 充值弹窗 -->
        <YouDialog v-model:visible="visible" title="账户充值" confirm="充值下单" @confirm="onConfirm">
            <div class="space-y-5 p-2">
                <div>
                    <div class="text-sm font-medium text-gray-900">充值金额</div>
                    <div class="mt-2 text-2xl font-bold text-red-500">￥{{ charge.money }}</div>
                </div>
                <div>
                    <div class="mb-2 text-sm font-medium text-gray-900">选择金额</div>
                    <div class="flex flex-wrap gap-2">
                        <button v-for="item in charge.preset" :key="item" type="button"
                            class="rounded-md border px-4 py-2 text-sm transition-colors"
                            :class="charge.money === item
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
                            @click="chooseAmount(item)">{{ item }}</button>
                    </div>
                </div>
                <input v-model="charge.money" type="number" min="1" step="0.01"
                    class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="自定义金额" />
                <p class="text-xs text-gray-500">充值说明：1:1 比例充值为 # RGB。</p>
            </div>
        </YouDialog>
    </div>
</template>
<script setup>
// 我的钱包页:资产展示、刷新与扫码充值
const state = reactive({
    loading: false,
    loaded: false,
    error: '',
    visible: false,
    charge: {
        money: '100.00',
        preset: ['10.00', '30.00', '88.00', '100.00', '300.00', '618.00'],
    },
    overage: {
        amount: 0,
        balance: 0,
        catcoin: 0,
        color: 0,
        integral: 0,
    },
});
const { loading, loaded, error, visible, charge, overage } = toRefs(state);
// 数字格式化:保留两位小数并加千分位
const formatNumber = (value) => Number(value || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
// 拉取钱包资产
const loadOverage = () => {
    if (state.loading) {
        return;
    }
    state.loading = true;
    state.error = '';
    apiFetch('wallet/overage', {}).then((result) => {
        state.overage = { ...state.overage, ...(result || {}) };
        state.loaded = true;
    }).catch((err) => {
        state.error = err?.message ?? '钱包信息加载失败';
        useMessage().error(state.error);
    }).finally(() => {
        state.loading = false;
    });
};
// 选择预设金额
const chooseAmount = (item) => {
    state.charge.money = item;
};
// 打开充值弹窗
const onCharge = () => {
    state.visible = true;
};
// 提交充值下单
const onConfirm = () => {
    apiFetch('wallet/charge', {
        type: 'wechat',
        money: {
            symbol: 'RGB',
            amount: state.charge.money,
        },
        remark: '账户充值',
    }).then((result) => {
        showQrcode(result?.href);
    }).catch((err) => {
        useMessage().error(err?.message ?? '充值下单失败');
    });
};
// 显示支付二维码,用户确认后刷新余额
const showQrcode = (href) => {
    if (!href) {
        useMessage().error('未获取到支付链接');
        return;
    }
    useQrcode(href, { width: 180, height: 180 }).then((canvas) => {
        canvas.classList.add('mx-auto');
        useDialog({
            title: '账户充值（扫码）',
            content: canvas,
            confirm: '我已充值',
        }).then(() => {
            loadOverage();
        }).catch(() => {});
    }).catch(() => {
        useMessage().error('二维码生成失败');
    });
};
onMounted(() => loadOverage());
</script>
