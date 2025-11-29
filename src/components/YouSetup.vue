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
import { onMounted, useTemplateRef, defineAsyncComponent,computed, ref,nextTick, inject } from 'vue';
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
const reFresh = () => {
    keyComponent.value += 1; 
    console.log('reFresh')
}
const onClose = () => {
    console.log('close')
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
    props.ready({ name: 9999 })
});
</script>

<style lang="scss" scoped>
.y-setup{
    border: 0;
}
.y-setup-capsule {
    position: fixed;
    right: 10px;
    top: 10px;
    display: flex;
    gap: 4px;
    padding: 10px;
    background-color: #f1f1f1;
    border-radius: 20px;
    z-index: 9999;
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