<template>
    <TransitionGroup tag="div" mode="out-in">
        <div v-for="item in messaged" :key="item.uuid" :class="['y-message', `y-message-${item.method}`]"
            @click="onClose(item)">
            <div v-html="item.params || 'unknown'"></div>
        </div>
    </TransitionGroup>
</template>

<script setup>
const state = reactive({ 'message': [] })
const messaged = computed(() => state.message.filter(item => item.active));

const onClose = ({ timer, uuid }) => (clearTimeout(timer), onDestroy(uuid));
const onDestroy = (uuid) => {
    state.message.find(item => item.uuid == uuid).active = false;
    state.message = state.message.filter(item => item.active);
}
// 暴漏方法
const onPush = (method, params, duration) => {
    let uuid = Math.random().toString(32);
    let timer = setTimeout(() => { onDestroy(uuid) }, duration)
    state.message.push({ uuid, method, params, timer, duration, active: true })
};
defineExpose({ onPush });
</script>
<style lang="scss">
.y-message-container {
    user-select: none;
    position: fixed;
    top: 10px;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 99999;

    .y-message {
        transform: translate(-50%);
        cursor: pointer;
        min-width: 180px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin: 5px;
        padding: 10px;
        box-shadow: 0 0 2px 1px #e1e1e1;
        // 左侧状态竖线（核心：通过伪元素实现，不增加DOM）
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 4px;
            bottom: 4px;
            width: 4px;
            border-radius: 2px; // 竖线圆角，更美观
        }
    
        // hover效果：轻微上浮+加深阴影
        &:hover {
            transform: translate(-50%) translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        }
    }

}

// 1. info状态：蓝色系
.y-message-info {
    background-color: #f0f7ff;
    color: #1890ff; // 文字色与竖线色一致

    &::before {
        background-color: #1890ff;
    }
}

// 2. success状态：绿色系
.y-message-success {
    background-color: #f0fff4;
    color: #52c41a;

    &::before {
        background-color: #52c41a;
    }
}

// 3. error状态：红色系
.y-message-error {
    background-color: #fff1f0;
    color: #ff4d4f;

    &::before {
        background-color: #ff4d4f;
    }
}

// 4. warning状态：黄色系（修正derge为常见warning）
.y-message-warning {
    background-color: #fffbe6;
    color: #faad14;

    &::before {
        background-color: #faad14;
    }
}

.v-enter-active,
.v-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: translate(-50%) translateY(20px);
}
</style>