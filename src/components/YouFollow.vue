<template>
    <div class="you-follow select-none">
        <slot v-if="stateProfile.uuid" :status="status">
            <template v-if="status == -1">
                <div class="bg-green-500 text-white rounded-full px-2 py-1 cursor-pointer">正在处理</div>
            </template>
            <template v-else-if="status == 0">
                <div class="bg-blue-500 text-white rounded-full px-2 py-1 cursor-pointer"
                    @click="stateSubscribe.toggle('account', props.uuid)">关注</div>
            </template>
            <template v-else-if="status == 1">
                <div class="border-blue-500 border-2 text-blue-500 rounded-full px-2 py-1 hover:border-red-500 hover:text-red-500 cursor-pointer"
                    @click="stateSubscribe.toggle('account', props.uuid)">正在关注</div>
            </template>
        </slot>
        <div v-else v-login="()=>{}" class="bg-gray-500 text-white rounded-full px-2 py-1 cursor-pointer">请登录</div>
    </div>
</template>

<script setup>
const props = defineProps({
    type: {
        type: String,
        default: 'follow',
        validator: value => ['follow', 'video', 'drive'].includes(value)
    },
    uuid: {
        type: [String, Number],
        default: '',
        required: true
    }
});
const state = reactive({});
const stateSubscribe = storeSubscribe();
const stateProfile = storeProfile();

const status = computed(() => {
    let subscribeStatus = stateSubscribe.filter('account', props.uuid);
    console.log('subscribeStatus.66666666', subscribeStatus)
    return subscribeStatus;
});

onMounted(() => {
    // let follow = stateSubscribe.follow(123);
    console.log('stateProfile',stateProfile)
    // stateSubscribe.subscribe(state=>{
    //     console.log(state)
    // });
})
</script>

<style style lang="scss"></style>