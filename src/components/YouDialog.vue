<template>
    <dialog ref="dialog" @close="onCancel" class="y-dialog rounded-sm shadow-sm">
        <div>
            <div class="head flex justify-between items-center border-b">
                <div>{{props.title}}</div>
                <button class="i-carbon:close hover:bg-blueGray cursor-pointer" @click="onCancel"></button>
            </div>
            <div class="body py-4 text-gray-600 min-w-32">
                <slot v-if="$slots.default"></slot>
                <div class="HTMLElement" v-else-if="isDomContent" v-dom="props.content"></div>
                <div v-else v-html="props.content"></div>
            </div>
            <div class="foot flex justify-end items-center mt-1">
                <button @click="onCancel" v-if="props.cancel" class="bg-gray-200 rounded-sm px-4 py-2 border-none cursor-pointer">{{props.cancel}}</button>
                <button @click="onConfirm" v-if="props.confirm" class="bg-blue-600 rounded-sm px-4 py-2 border-none text-white ml-2 cursor-pointer">{{props.confirm}}</button>
            </div>
        </div>
    </dialog>
</template>

<script setup>
const dialogRef = useTemplateRef('dialog');
const props = defineProps({
    visible:{
        type:Boolean,
        default:false
    },
    title:{
        type:String,
        default:'弹窗提示'
    },
    content:{
        type:[String,Object,HTMLElement],
        default:''
    },
    cancel:{
        type:[String,Boolean],
        default:'取消'
    },
    confirm:{
        type:[String,Boolean],
        default:'确认'
    }
});
const emit = defineEmits(['confirm','cancel']);
const visibleModel = defineModel('visible');
// 辅助方法
const isDomContent = computed(() => {
  return !!props.content && props.content instanceof HTMLElement;
});

// 暴漏方法
const onConfirm = ()=>{
    visibleModel.value = false
    emit('confirm',[]);
}
const onCancel = ()=>{
    visibleModel.value = false
    emit('cancel',[]);
};
// 监听变化
watch(()=>props.visible,(newVal)=>{
    newVal ? dialogRef.value?.showModal() : dialogRef.value?.close();
},{ immediate: true });
// 
onMounted(()=>{
    props.visible && dialogRef.value?.showModal();
})
onUnmounted(() => {
  dialogRef.value?.close();
});
</script>
<style lang="scss">
    .y-dialog{
        user-select: none;
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -20%);
        border: 0;
        padding: 10px;
        box-shadow: 0 0 2px 1px #e1e1e1;
        z-index: 99999;
        &::backdrop {
            background-color: rgba(0, 0, 0, 0.1);
        }
    }
    .v-enter-active,.v-leave-active {
        transition: all 0.5s ease;
    }
    .v-enter-from, .v-leave-to {
        opacity: 0;
        transform: translateY(60px);
    }
</style>