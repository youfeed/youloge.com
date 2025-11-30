<template>
    <!-- 菜单触发按钮 -->
    <div class="menu-trigger" @click="onShow">
        <you-svg :name="props.icon" size="16" class="text-sm mr-1"></you-svg>
        <slot></slot>
    </div>

    <!-- 侧边栏容器 -->
    <teleport to="body">
        <dialog ref="dialog" class="you-guide-container" :style="styled" @click="onBackdropClick" @touchstart="onBackdropClick">
            <div ref="content" class="you-guide-content flex flex-col" >
                <div class="aside-header flex items-center justify-between h-14 p-2">
                    <div class="font-bold text-gray-800 text-shadow">Youloge.com</div>
                    <button class="i-carbon:close hover:bg-gray-100 p-1 rounded cursor-pointer w-4 h-4"@click="onClose">
                        <!-- <you-svg name="carbon:close" size="16"></you-svg> -->
                        X
                    </button>
                </div>

                <div class="aside-body p-4 flex-1">
                    <div class="menu-section">
                        <h3 class="text-gray-600 text-sm font-medium mb-2">导航</h3>
                        <ul class="menu-list">
                            <router-link to="/" class="menu-item">
                                <you-svg name="carbon:home" size="10" class="mr-2"></you-svg>首页
                            </router-link>
                            <router-link to="/video" class="menu-item">
                                <you-svg name="carbon:video-player" size="10" class="mr-2"></you-svg>视频
                            </router-link>
                            <router-link to="/goods" class="menu-item">
                                <you-svg name="carbon:shopping-cart" size="10" class="mr-2"></you-svg>购物
                            </router-link>
                            <router-link to="/article" class="menu-item">
                                <you-svg name="carbon:home" size="10" class="mr-2"></you-svg>文章
                            </router-link>
                            <router-link to="/drive" class="menu-item">
                                <you-svg name="carbon:home" size="10" class="mr-2"></you-svg>云盘
                            </router-link>
                        </ul>
                    </div>
                    <hr class="my-4 text-gray-200" />
                    <div class="menu-section">
                        <h3 class="text-gray-600 text-sm font-medium mb-2">订阅</h3>
                        <ul class="menu-list">
                            <li class="menu-item" @click="onMenuClick('my-personal')">
                                <you-svg name="carbon:user-avatar" size="10" class="mr-2"></you-svg>个人中心
                            </li>
                        </ul>
                    </div>
                    <hr class="my-4 text-gray-200" />

                    <div class="menu-section">
                        <h3 class="text-gray-600 text-sm font-medium mb-2">我的</h3>
                        <ul class="menu-list">
                            <li class="menu-item" @click="onMenuClick('my-personal')">
                                <you-svg name="carbon:user-avatar" size="10" class="mr-2"></you-svg>个人中心
                            </li>
                            <li class="menu-item" @click="onMenuClick('my-video')">
                                <you-svg name="carbon:video-player" size="10" class="mr-2"></you-svg>钱包余额
                            </li>
                            <li class="menu-item" @click="onMenuClick('my-shopping')">
                                <you-svg name="carbon:shopping-cart" size="10" class="mr-2"></you-svg>商品购物
                            </li>
                            <li class="menu-item" @click="onMenuClick('my-articles')">
                                <you-svg name="carbon:document" size="10" class="mr-2"></you-svg>资讯文章
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="aside-footer p-4 border-t">
                    <div class="text-xs text-gray-500">
                        @2025 Jakebuda,Inc.
                    </div>
                    <div class="flex gap-2 mt-2">
                        <!-- 社交媒体或链接图标 -->
                        <a href="#" class="text-gray-400 hover:text-gray-600">
                            <you-svg name="carbon:logo-github" size="12"></you-svg>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-gray-600">
                            <you-svg name="carbon:logo-twitter" size="12"></you-svg>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-gray-600">
                            <you-svg name="carbon:logo-wechat" size="12"></you-svg>
                        </a>
                    </div>
                </div>
            </div>
        </dialog>
    </teleport>
</template>
<!-- guide -->
<script setup>
import { computed, ref, onMounted, watch } from 'vue';
// 使用 useTemplateRef 替代普通 ref
const dialog = useTemplateRef('dialog');
const content = useTemplateRef('content');
// 使用 defineModel 替代 modelValue
const modelValue = defineModel({
    type: Boolean,
    default: false
});
const props = defineProps({
    icon: {
        type: String,
        default: 'tdesign:view-list'
    }
});
// 定义事件
const emit = defineEmits(['menu-click']);


const activeMenuItem = ref(null);

// 计算样式
const styled = computed(() => ({
    height: '100%',
    maxHeight: 'unset',
    minWidth: '240px',
    maxWidth: '80vw',
    inset: '0 auto 0 0',
    border: '0',
    outline: '0',
    borderRadius: '0 20px 20px 0',
    padding: '0',
    overflow: 'hidden',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent'
}));

// 打开菜单
const onShow = () => {
    if (dialog.value) {
        dialog.value.showModal();
        modelValue.value = true;
    }
};

// 关闭菜单
const onClose = () => {
    if (dialog.value) {
        dialog.value.close();
        modelValue.value = false;
    }
};

// 点击背景关闭
const onBackdropClick = (e) => {
    // 检查点击是否在内容区域内
    if (content.value && !content.value.contains(e.target)) {
        // 如果点击不在内容区域内，则关闭菜单
        onClose();
    }
};

// 菜单项点击处理
const onMenuClick = (menuId) => {
    activeMenuItem.value = menuId;
    emit('menu-click', menuId);
    // 可以根据需要决定是否关闭菜单
    // onClose();
};

// 监听 modelValue 变化
watch(modelValue, (newVal) => {
    if (newVal) {
        onShow();
    } else {
        onClose();
    }
});

onMounted(() => {
    // 初始状态不自动打开
    if (modelValue.value) {
        onShow();
    }
});

// 暴露方法
defineExpose({
    onShow,
    onClose
});
</script>

<style lang="scss">
// 菜单触发按钮样式
.menu-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
    
    &:active {
        transform: scale(0.95);
    }
}

.you-guide-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    opacity: 0;
    transition: opacity 0.3s ease;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: none;
    border: none;
    outline: none;

    &[open] {
        opacity: 1;
        pointer-events: auto;
    }
}

.you-guide-container::backdrop {
    background-color: #9e9e9e57;
}

.you-guide-content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 240px;
    max-width: 80vw;
    background-color: #fff;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    border-radius: 0 20px 20px 0;
}

.you-guide-container[open] .you-guide-content {
    transform: translateX(0);
}

.aside-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.aside-header {
    border-bottom: 1px solid #f0f0f0;
}

.aside-body {
    flex: 1;
    overflow-y: auto;
}

.aside-footer {
    border-top: 1px solid #f0f0f0;
}

.menu-section {
    margin-bottom: 1rem;

    h3 {
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
    }
}

.menu-list {
    list-style: none;
    padding: 0;
    margin: 0;

    .menu-item {
        display: flex;
        align-items: center;
        padding: 4px 6px;
        cursor: pointer;
        border-radius: 0.5rem;
        transition: background-color 0.2s ease;
        margin-bottom: 0.25rem;

        &:hover {
            background-color: #f5f5f5;
        }

        &:active {
            background-color: #eaeaea;
        }

        &.active {
            background-color: #e6f7ff;
            color: #1890ff;
        }
    }
}

/* 已移除旧样式，使用新的类名和布局 */

// 响应式设计
@media (max-width: 768px) {
    .you-guide-content {
        width: 80vw !important;
        max-width: 280px;
    }
}

@media (max-width: 480px) {
    .you-guide-content {
        width: 85vw !important;
        max-width: none;
    }
}
</style>