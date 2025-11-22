<template>
    <div class="">
        <form action="" @submit.prevent="onSubmit" class="border-b-1 flex gap-2">
            <div class="flex gap-2">
                <div v-for="item in list" :key="item"
                    class="flex items-center justify-center bg-gray-100 text-gray-800 rounded">
                    {{ item }}
                    <span @click.stop="onDelete(item)" class="cursor-pointer inline-block">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="bp-icon bp-icon-close-line"
                            fill="#595959" style="width: 14px; height: 14px;">
                            <path
                                d="m12 10.586 4.95-4.95 1.414 1.415-4.95 4.95 4.95 4.95-1.415 1.414-4.95-4.95-4.949 4.95-1.414-1.415 4.95-4.95-4.95-4.95L7.05 5.638l4.95 4.95Z">
                            </path>
                        </svg>
                    </span>
                </div>
            </div>
            <input type="text" v-model.trim="text" v-if="modelValue.length < max" class="border-1 rounded-sm">
            <p class="tag-hint">
                {{ modelValue.length }}/{{ max }}
                <span v-if="modelValue.length >= max" class="text-red-500">（已达上限）</span>
            </p>
        </form>
    </div>
</template>

<script setup>
const model = defineModel({
    type:Array,
    required:true
});
const props = defineProps({
    closeable : {
        type: Boolean,
        default: false
    },
    min: {
        type: [Number,String],
        default: 0
    },
    max: {
        type: [Number,String],
        default: 6
    },
});
const state = reactive({
    text: '',
    list: []
}), { text, list } = toRefs(state);

// const model = useVmodel(props, 'modelValue', emit);
//
const currentMin = computed(() => Number(props.min));
const currentMax = computed(() => Number(props.max));
// 删除标签
const onDelete = (item) => {
    let inx = state.list.findIndex(is => item)
    state.list.splice(inx, 1)
}
//
const onSubmit = () => {
    console.log('state.list',state.list)
    let text = state.text;
    if (state.list.includes(text)) return;
    if (text) {
        state.list.push(text);
        state.text = '';
        model.value = state.list
    }
}

onMounted(()=>{
    state.list = props.modelValue;
})
</script>

<style></style>