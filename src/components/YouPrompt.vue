<template>
    <dialog ref="dialog" @close="onCancel" class="y-prompt rounded-sm shadow-sm">
        <div>
            <div class="head flex justify-between items-center border-b">
                <div>{{ props.title }}</div>
                <button class="i-carbon:close hover:bg-blueGray cursor-pointer" @click="onCancel"></button>
            </div>
            <div class="body py-4 text-gray-600 min-w-40">
                <form @submit.prevent="onSubmit" ref="form">
                    <div class="form-item p-1">
                        <input :name="props.name" :type="props.type" :pattern="props.pattern" :placeholder="props.placeholder"
                            class="y-prompt-input flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <slot v-if="$slots.default"></slot>
                    <div class="HTMLElement" v-else-if="isDomContent" v-dom="props.content"></div>
                    <div v-else v-html="props.content"></div>
                </form>
            </div>
            <div class="foot flex justify-end items-center mt-1">
                <button type="reset" @click="onCancel" v-if="props.cancel"
                    class="bg-gray-200 rounded-sm px-4 py-2 border-none cursor-pointer">{{ props.cancel }}</button>
                <button type="submit" @click="onConfirm" v-if="props.confirm"
                    class="bg-blue-600 rounded-sm px-4 py-2 border-none text-white ml-2 cursor-pointer">{{ props.confirm }}</button>
            </div>
        </div>
    </dialog>
</template>
<!-- YouPrompt -->
<script setup>

const formRef = useTemplateRef('form');
const dialogRef = useTemplateRef('dialog');
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: '输入提示'
    },
    name:{
        type: String,
        default: 'name'
    },
    type: {
        type: String,
        default: 'text'
    },
    min:{
        type:Number,
        default:0
    },
    max:{
        type:Number,
        default:0
    },
    maxlength:{
        type:Number,
        default:32
    },
    pattern: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: true
    },
    placeholder: {
        type: String,
        default: '请输入内容'
    },
    content: {
        type: [String, Object, HTMLElement],
        default: ''
    },
    cancel: {
        type: [String, Boolean],
        default: '取消'
    },
    confirm: {
        type: [String, Boolean],
        default: '确认'
    }
});
const emit = defineEmits(['update:visible', 'confirm', 'cancel']);
const modelVisible = useVmodel(props, 'visible', emit);
// 辅助方法
const isDomContent = computed(() => {
    return !!props.content && props.content instanceof HTMLElement;
});
// 验证表单
const checkValidity = ()=>{
    let {name} = props;
    let from = new FormData(formRef.value)
    let Valid = formRef.value.checkValidity();
    if(Valid == false){
        formRef.value.reportValidity();
        return false;
    }
    return {
        [name]:from.get(name)
    }
}
// 暴漏方法
const onConfirm = () => {
    let checked = checkValidity();
    if(checked){
        modelVisible.value = false;
        emit('confirm', checked);
    }
}
const onCancel = () => {
    modelVisible.value = false
    emit('cancel', []);
};

onMounted(() => {
    props.visible && dialogRef.value?.showModal();
    setTimeout(() => {
        // setCustomValidity()
    });
})
</script>

<style lang="scss">
.y-prompt {
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

.v-enter-active,
.v-leave-active {
    transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: translateY(60px);
}
</style>