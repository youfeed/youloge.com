<template>
    <dialog id="top-layer" class="y-setup" ref="dialog">
        <div class="y-setup-capsule">
            <div @click="reFresh" class="y-setup-capsule__fresh">刷新</div>
            <div>|</div>
            <div @click="onClose" class="y-setup-capsule__close">关闭</div>
        </div>
        <div class="y-setup-container">
            <transition name="fade" mode="out-in" appear>
                <div class="y-setup-component">
                    <component :is="asyncComponent" :key="keyComponent"></component>
                </div>
            </transition>
        </div>
    </dialog>
</template>

<script setup>
import { onMounted, onUnmounted, useTemplateRef, defineAsyncComponent,computed, ref,nextTick, inject } from 'vue';
const dialogRef = useTemplateRef('dialog');
const keyComponent = ref(0);
const props = defineProps({
    name: String,
    routes: Object,
    // routes: Array,
    ready: Function,
    error: Function,
    destroy: Function,
});

// // 保存原始的CSS变量值，用于重置
// const originalRootVars = ref({});

// // 设置全局CSS变量（仅在小屏模式下）
// const setRootVariables = () => {
//     const root = document.documentElement;
    
//     // 检查是否为小屏
//     const isSmallScreen = window.innerWidth <= 680;
    
//     if (isSmallScreen) {
//         // 保存原始值
//         const varsToSave = [
//             '--capsule-area-top',
//             '--capsule-area-right', 
//             '--capsule-area-bottom',
//             '--capsule-area-left',
//             '--capsule-border-radius',
//             '--capsule-background',
//             '--capsule-padding'
//         ];
        
//         varsToSave.forEach(varName => {
//             const value = getComputedStyle(root).getPropertyValue(varName);
//             if (value) {
//                 originalRootVars.value[varName] = value;
//             }
//         });
        
//         // 设置新的值到:root
//         root.style.setProperty('--capsule-area-top', '10px');
//         root.style.setProperty('--capsule-area-right', '10px');
//         root.style.setProperty('--capsule-area-bottom', '30px');
//         root.style.setProperty('--capsule-area-left', '90px');
//         root.style.setProperty('--capsule-border-radius', '8px');
//         root.style.setProperty('--capsule-background', '#f1f1f1');
//         root.style.setProperty('--capsule-padding', '4px');
//     }
// };

// // 重置全局CSS变量
// const resetRootVariables = () => {
//     const root = document.documentElement;
    
//     // 恢复原始值
//     Object.entries(originalRootVars.value).forEach(([varName, value]) => {
//         if (value) {
//             root.style.setProperty(varName, value);
//         } else {
//             root.style.removeProperty(varName);
//         }
//     });
// };

const reFresh = () => {
    keyComponent.value += 1; 
    console.log('reFresh')
}
const onClose = () => {
    console.log('close')
    // resetRootVariables(); // 关闭时重置变量
    props.destroy()
}
const asyncComponent = computed(() => {
    let {[props.name]:component} = props.routes;
    console.log('component',props.routes,props.name,component)
    if(!component){
        props.error()
    }
    return defineAsyncComponent({
        loader: component
    })
})
onMounted(() => {
    dialogRef.value.showModal();
    // setRootVariables(); // 打开时设置变量
    props.ready({ name: 9999 })
});

// 组件卸载时也要重置变量
onUnmounted(() => {
    // resetRootVariables();
});
</script>

<style lang="scss">
/* 默认情况下不设置全局CSS变量，仅在小屏模式下设置 */
/* 小屏模式下的全局CSS变量，供其他页面使用 */
@media (max-width: 680px) {
    :root {
        --capsule-area-top: 10px;
        --capsule-area-right: 10px;
        --capsule-area-bottom: 30px;
        --capsule-area-left: 90px;
        --capsule-border-radius: 8px;
        --capsule-background: #f1f1f1;
        --capsule-padding: 4px;
    }
}

.y-setup{
    border: 0;
}
.y-setup-capsule {
    position: fixed;
    right: 10px;
    top: 10px;
    display: flex;
    gap: 4px;
    padding: 4px;
    background-color: #f1f1f1;
    border-radius: 20px;
    z-index: 9999;
    border: 1px solid;
}

.y-setup::backdrop {
    backdrop-filter: blur(10px);
}

.y-setup-container {
    min-width: 500px;
    min-height: 600px;
    max-width: 680px;
    max-height: 700px;
    overflow-y: auto;
    background-color: #f1f1f1;
    border-radius: 8px;
    padding: 8px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
/* 小屏样式：当屏幕宽度小于680px时 */
@media (max-width: 680px) {
    .y-setup-container {
        width: 100%;
        height: 100%;
        max-width: none;
        max-height: none;
        border-radius: 0;
        padding: 0;
        top: 0;
        left: 0;
        transform: none;
    }
}
.y-setup-capsule__fresh,.y-setup-capsule__close{
    cursor: pointer;
    user-select: none;
    &:hover{
        color: var(--primary-text-hover);
    }
}
</style>