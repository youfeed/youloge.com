<template>
    <dialog ref="dialog" @close="onCancel" class="y-dialog rounded-sm shadow-sm">
        <div>
            <div class="head flex justify-between items-center border-b">
                <div>{{props.title}}</div>
                <button class="i-carbon:close hover:bg-blueGray cursor-pointer" @click="onCancel"></button>
            </div>
            <div class="body py-4 text-gray-600 min-w-32" v-html="props.content"></div>
            <div class="foot flex justify-end items-center mt-1">
                <button @click="onCancel" v-if="props.cancel" class="bg-gray-200 rounded-sm px-4 py-2 border-none cursor-pointer">{{props.cancel}}</button>
                <button @click="onConfirm" v-if="props.confirm" class="bg-blue-600 rounded-sm px-4 py-2 border-none text-white ml-2 cursor-pointer">{{props.confirm}}</button>
            </div>
        </div>
    </dialog>
</template>

<script setup>
const props = defineProps({
    title:{
        type:String,
        default:'提示'
    },
    content:{
        type:String,
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
const dialog = ref(null);
const emit = defineEmits(['confirm','cancel']);
// 暴漏方法
const onConfirm = ()=>{
    emit('confirm',[]);
}
const onCancel = ()=>{
    emit('cancel',[]);
};

onMounted(()=>{
    console.log('dialog',dialog)
    // dialog.value.show()
    dialog.value.showModal()
})
</script>
<style lang="scss">
    .y-dialog-container{
        user-select: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99999;
        .y-dialog{
            position: relative;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            display: flex;
            align-items: center;
            justify-content:flex-start;
            margin: 5px;
            padding: 10px;
            border: 0;
            box-shadow: 0 0 2px 1px #e1e1e1;
        }
    }
    dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
        // opacity: 0.75;
    }
    .v-enter-active,.v-leave-active {
        transition: all 0.5s ease;
    }
    .v-enter-from, .v-leave-to {
        opacity: 0;
        transform: translateY(60px);
    }
</style>