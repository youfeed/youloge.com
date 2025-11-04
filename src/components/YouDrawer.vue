<template>
    <div class="y-drawer-container">
        <dialog ref="dialog" :open="props.visible" @close="onCancel" popover="auto" :style="dialogStyle" class="y-drawer rounded-sm shadow-sm">
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
import { computed } from 'vue';

const dialogRef = useTemplateRef('dialog')
const props = defineProps({
    visible: Boolean,
    subtitle: String,
    size:String,
    onCancel:Function,
    onConfirm:Function,
    width:{
        type:String,
        default: '300px',
    },
    height:{
        type:String,
        default: '100%',
    },
    placement:{
        type:String,
        default: 'left',
        validator:(val)=>{
            return ['left','top','right','bottom'].includes(val);
        }
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
// 计算样式
const dialogStyle = computed(()=>{
    const {placement,width,height,} = props;
    return {
        width:width,
        height:height,
        maxWidth:'100vw',
        maxHeight:'100vh',
        left: placement === 'left' ? '0' : 'auto',
        right: placement === 'right' ? '0' : 'auto',
        transform: placement === 'left' ? 'translateX(-100%)' : 'translateX(100%)',
        transition:'transform 0.2s ease-in-out',
        position: 'fixed',
        top: '0',
        bottom: '0',
        zIndex: '100',
        border: 'none',
        borderRadius: '0',
        backgroundColor: '#ffffff',
        // 左弹出 → 右侧阴影 右弹出 → 左侧阴影
        boxShadow: placement === 'left'  ? '2px 0 10px rgba(0, 0, 0, 0.1)' : '-2px 0 10px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        '--backdrop-opacity': ''
    }
});
//
const onCancel = () => {
    props.onCancel()
    emit('update:visible', false);
    emit('cancel', []);
    console.log('cancel');
}
const onConfirm = ()=>{
    props.onConfirm()
    emit('update:visible', false);
    emit('confirm',[]);
}
onMounted(()=>{
    dialogRef.value.showModal()
    // dialogRef.value.showPopover()
    console.log('dialogRef',dialogRef)
})
// 暴漏方法
</script>
<style lang="scss">
// .y-drawer-container {
//     user-select: none;
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     z-index: 999999999;
//     background-color: rgba(0, 0, 0, .5);
//     .y-drawer {
//         position: fixed;
//         top: 20%;
//         left: 50%;
//         transform: translate(-50%, -50%);
//         z-index: 999999999;
//         background-color: #fff;
//         width: 300px;
//         // height: 100%;
//         overflow-y: auto;
//         margin: 5px;
//         padding: 10px;
//         border: 0;
//     }
// }
dialog::backdrop {
    background-color: rgba(0, 0, 0, .5);
    // opacity: 0.75;
}
/* 打开状态：滑入视图（translateX(0)） */
.y-drawer[open],.y-drawer:modal {
  transform: translateX(0) !important;
}

/* 无动画模式：覆盖过渡效果 */
.y-drawer.no-animation {
  transition: none !important;
}
</style>