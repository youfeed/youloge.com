<template>
    <div class="y-drawer-container" v-if="props.visible">
        <dialog ref="dialog" :open="props.visible" @close="onCancel" class="y-drawer rounded-sm shadow-sm">
            <div class="head flex justify-between items-center border-b">
                <div>{{props.title}}</div>
                <button class="i-carbon:close hover:bg-blueGray cursor-pointer" @click="onCancel"></button>
            </div>
            <div class="body py-4 text-gray-600 min-w-32">
                <slot></slot>
            </div>
            <div class="foot flex justify-end items-center mt-1">
                <button @click="onCancel" class="bg-gray-200 rounded-sm px-4 py-2 border-none cursor-pointer">{{props.cancel}}</button>
                <button @click="onConfirm" class="bg-blue-600 rounded-sm px-4 py-2 border-none text-white ml-2 cursor-pointer">{{props.confirm}}</button>
            </div>
        </dialog>
    </div>
</template>

<script setup>
const props = defineProps({
    visible: Boolean,
    title: String,
    subtitle: String,
    size:String,
    placement:{
        type:String,
        default: 'right'
    },
    title:{
        type:String,
        default:'抽屉标题'
    },
    cancel:{
        type:[String,Boolean],
        default:'取消'
    },
    confirm:{
        type:[String,Boolean],
        default:'确认'
    }
}),emit = defineEmits(['update:visible','confirm','cancel']),dialog = ref(null);
//
const onCancel = () => {
    // dialog.value.close();
    emit('update:visible', false);
    // props.open = false;
    emit('cancel', []);
    console.log('cancel');
}
const onConfirm = ()=>{
    // dialog.value.close();
    emit('update:visible', false);
    emit('confirm',[]);
}
// 暴漏方法
const confirm = () => {
    
}
// defineExpose({
//   getBalance
// })
</script>

<style lang="scss">
    .y-drawer-container {
        user-select: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999999999;
        background-color: rgba(0, 0, 0, .5);
        .y-drawer {
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999999999;
            background-color: #fff;
            width: 300px;
            // height: 100%;
            overflow-y: auto;
            margin: 5px;
            padding: 10px;
            border: 0;
        }
    }
    dialog::backdrop {
        background-color: rgba(0, 0, 0, .5);
        // opacity: 0.75;
    }
</style>