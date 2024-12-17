<template>
    <dialog open="true">
        <TransitionGroup tag="div" mode="out-in">
            <slot></slot>
        </TransitionGroup>
    </dialog>
</template>

<script setup>
import { computed, reactive } from 'vue'
const state = reactive({ 'message':[] })
  
const messaged = computed(()=>state.message.filter(item=>item.active));
const onDestroy = (uuid)=>{
    state.message.find(item=>item.uuid==uuid).active = false;
    state.message = state.message.filter(item=>item.active);
}
// 暴漏方法
const onOpen = (method,params,duration)=>{
    let uuid = Math.random().toString(32);
    let timer = setTimeout(()=>{ onDestroy(uuid) },duration)
    state.message.push({uuid,method,params,timer,duration,active:true})
};
const onClose = (method,params,duration)=>{
    let uuid = Math.random().toString(32);
    let timer = setTimeout(()=>{ onDestroy(uuid) },duration)
    state.message.push({uuid,method,params,timer,duration,active:true})
};
defineExpose({onOpen,onClose});
</script>
<style lang="scss">
    .y-dialog-container{
        user-select: none;
        position: fixed;
        top: 10px;
        left: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        z-index: 99999;
        .y-message{
            transform: translate(-50%);
            cursor: pointer;
            min-width: 180px;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content:flex-start;
            margin: 5px;
            padding: 10px;
            box-shadow: 0 0 2px 1px #e1e1e1;
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