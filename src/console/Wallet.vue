<template>
    <div>
        <div class="max-w-screen-md mx-auto p-4 border-solid border-1 rounded border-gray-300">
            <div class="flex justify-between items-center mb-4 border-b-solid border-b-1 border-gray-300 p-b-2">
                <div>我的钱包</div>
                <div @click="loadOverage" class="i-tdesign-loading"></div>
            </div>
            <div>
                <div class="flex justify-between items-center mb-4">
                    <div>余额</div>
                    <div class="text-xl font-bold">#{{ overage.balance }} RGB</div>
                </div>
                <div class="flex justify-between items-center mb-4">
                    <div>猫币</div>
                    <div class="text-xl font-bold">{{ overage.catcoin }}</div>
                </div>
                <div class="flex justify-between items-center mb-4">
                    <div>积分</div>
                    <div class="text-xl font-bold">{{ overage.integral }}</div>
                </div>
            </div>
            <div class="foot flex justify-between items-center border-t-solid border-t-1 border-gray-300 p-t-2">
                <div>海外账户·大额充值</div>
                <button class="bg-blue-600 text-white rounded border-current px-2 py-1 border-none pointer"
                    @click="onCharge">账户充值</button>
            </div>
        </div>
        <!-- 支付抽屉 -->
        <YouDialog v-model:visible="state.visible" title="账户充值" confirm="充值下单" size="mini" @confirm="onConfirm">
            <div class="p-4">
                <div class="text-xl font-bold">充值金额：<span class="text-red-500">￥{{charge.money}}</span></div>
                <div class="flex flex-wrap justify-between gap-2 my-2 mwx-w-50">
                    <template v-for="item in charge.preset" :key="item">
                        <div class="px-2 py-1  rounded-sm" :class="[charge.money==item ? 'bg-blue-600 text-white' : 'bg-gray-200 text-blue-400']" @click="charge.money=item">{{item}}</div>
                    </template>
                </div>
                <div class="text-gray-600">
                    充值说明 1:1比例充值为 # RGB
                </div>
            </div>
        </YouDialog>
    </div>
</template>

<script setup>
const props = defineProps(['params']), emit = defineEmits(['jump']);
const state = reactive({
    err: 0, msg: '', data: {},
    visible: false,
    charge:{
        money:'100.00',
        preset:['10.00','30.00','88.00','100.00','300.00','618.00']
    },
    overage: {
        amount:0,
        balance:0,
        catcoin:0,
        color:0,
        integral:0
    }
}), { err, msg, data, overage,charge } = toRefs(state);
// 获取余额
const loadOverage = () => {
    let load = useLoading();
    apiFetch('wallet/overage', {}).then(result => {
        state.overage = result
    }).catch(err=>{
        useMessage().error(err.message);
    }).finally(()=>{
        console.log(666666666)
        load.close()
    })
}
// 刷新余额
const reFresh = () => {
    state.data = {}
    loadOverage()
}
// 账户充值
const onCharge = () => {
    state.visible = true;
}
// 确认下单
const onConfirm = () => {
    let {money} = state.charge
    apiFetch('wallet/charge', {
        type: 'wechat',
        money: {
            symbol:'RGB',
            amount:money
        },
        remark: '账户充值'
    }).then(result => {
        console.log(result)
        showQrcode(result.href)
    }).catch(err=>{
        useMessage().error(err.message)
    })
}
// 显示支付
const showQrcode = (href) => {
    let data = encodeURIComponent(href);
    useQrcode(href).then(canvas=>{
        console.log(href)
        canvas.style = `width:150px`
        useDialog({
            title: '账户充值(扫码)',
            content: canvas,
            confirm: '我已充值',
        }).then(res => {
            loadOverage()
            console.log(res)
        }).catch(err => {
            console.log(err)
        });
    })
}

onMounted(() => {
    state.profile = useAuth();
    loadOverage();
});
</script>

<style></style>