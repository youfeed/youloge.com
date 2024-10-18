<template>
    <TransitionGroup tag="div" mode="out-in">
      <div v-for="item in messaged" :key="item.uuid" :class="['y-message',`y-message-${item.method}`]" @click="onClose(item)" >
        <div v-html="item.params ||'unknown'"></div>
      </div>
    </TransitionGroup>
</template>

<script setup>
  import { computed, reactive } from 'vue'
  const state = reactive({ 'message':[] })
  
  const messaged = computed(()=>state.message.filter(item=>item.active));
  const onClose = ({timer,uuid})=>(clearTimeout(timer),onDestroy(uuid));
  const onDestroy = (uuid)=>{
    state.message.find(item=>item.uuid==uuid).active = false;
    state.message = state.message.filter(item=>item.active);
}
// 暴漏方法
const onPush = (method,params,duration)=>{
    let uuid = Math.random().toString(32);
    let timer = setTimeout(()=>{ onDestroy(uuid) },duration)
    state.message.push({uuid,method,params,timer,duration,active:true})
};
defineExpose({onPush});
</script>
<style lang="scss">
    .y-message-container{
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