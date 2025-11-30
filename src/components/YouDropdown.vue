<template>
    <div class="y-dropdown" ref="dropdownRef">
        <div 
            class="y-dropdown-trigger" 
            ref="triggerRef" 
            @click="handleClick"
            @contextmenu="handleContextMenu"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
        >
            <slot></slot>
        </div>
        <teleport to="body">
            <div 
                v-show="isOpen" 
                v-size="sizePanelChange"  
                ref="panelRef" 
                class="y-dropdown-panel" 
                :style="panelStyle"
            >
                <slot name="dropdown"></slot>
            </div>
        </teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, useTemplateRef, watch } from 'vue';
import { useScreen } from '../composables/useScreen';

const { vw, vh } = useScreen();
const dropdownRef = useTemplateRef('dropdownRef');
const triggerRef = useTemplateRef('triggerRef');
const panelRef = useTemplateRef('panelRef');

const emit = defineEmits(['open', 'close', 'select']);
const props = defineProps({
    trigger: { 
        type: String, 
        default: 'click',
        validator: (val) => ['click', 'hover', 'contextmenu'].includes(val)
    },
    placement: { 
        type: String, 
        default: 'bottom',
        validator: (val) => ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end'].includes(val)
    },
    gap: { type: Number, default: 4 },
    panelWidth: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
    hideOnClick: { type: Boolean, default: true }
});

// 核心状态
const isOpen = ref(false);
const panelPos = ref({ top: '0px', left: '0px' });
const panelSize = ref({ width: 0, height: 0 });
const timer = ref(null);

// 参考 Element Plus 的计算算法
const calcPanelPos = () => {
    const trigger = triggerRef.value;
    if (!trigger) return;

    const triggerRect = trigger.getBoundingClientRect();
    console.log('triggerRect', triggerRect)
    const { gap, placement } = props;
    
    // 使用响应式的视口尺寸
    const viewportW = vw.value;
    const viewportH = vh.value;
    
    // 优先使用 v-size 指令提供的响应式尺寸，回退到 props 或触发器尺寸
    const panelW = panelSize.value.width || props.panelWidth || triggerRect.width;
    const panelH = panelSize.value.height || 0;
    
    let top, left;
    
    // 根据 placement 属性确定位置
    switch (placement) {
        case 'top':
            top = triggerRect.top - panelH - gap;
            left = triggerRect.left + (triggerRect.width - panelW) / 2;
            break;
        case 'top-start':
            top = triggerRect.top - panelH - gap;
            left = triggerRect.left;
            break;
        case 'top-end':
            top = triggerRect.top - panelH - gap;
            left = triggerRect.right - panelW;
            break;
        case 'bottom':
            top = triggerRect.bottom + gap;
            left = triggerRect.left + (triggerRect.width - panelW) / 2;
            break;
        case 'bottom-start':
            top = triggerRect.bottom + gap;
            left = triggerRect.left;
            break;
        case 'bottom-end':
            top = triggerRect.bottom + gap;
            left = triggerRect.right - panelW;
            break;
    }
    
    // 边界检测和调整
    // 水平边界调整
    if (left < 8) {
        left = 8;
    } else if (left + panelW > viewportW - 8) {
        left = viewportW - panelW - 8;
    }
    
    // 垂直边界调整
    if (top < 8) {
        // 如果上方空间不足，尝试放在下方
        top = triggerRect.bottom + gap;
    } else if (top + panelH > viewportH - 8) {
        // 如果下方空间不足，尝试放在上方
        top = triggerRect.top - panelH - gap;
    }
    
    console.log('计算面板位置:', { 
        viewportW, viewportH, 
        panelW, panelH,
        placement,
        最终位置: { top, left }
    });
    
    panelPos.value = { top: `${top}px`, left: `${left}px` };
};

// 面板尺寸变化回调
const sizePanelChange = (size) => {
    console.log('面板尺寸变化:', size);
    
    // 更新面板尺寸 - 触发 watch 监听器自动重新计算位置
    panelSize.value = {
        width: size.width || size.inlineSize || 0,
        height: size.height || size.blockSize || 0
    };
};

// 只处理响应式数据，非变动值抽到样式里
const panelStyle = computed(() => ({
    top: panelPos.value.top,
    left: panelPos.value.left,
    width: props.panelWidth > 0 ? `${props.panelWidth}px` : undefined,
    opacity: isOpen.value ? 1 : 0,
    transform: isOpen.value ? 'scale(1)' : 'scale(0.95)'
}));

// 打开面板
const openDropdown = () => {
    if (props.disabled || isOpen.value) return;
    
    // 1. 确认 triggerRef 的位置中心
    const trigger = triggerRef.value;
    if (!trigger) return;
    
    const triggerRect = trigger.getBoundingClientRect();
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;
    
    // 2. panelRef 初始点为 triggerRef 的位置中心
    // 设置初始位置为中心对齐
    panelPos.value = { 
        top: `${triggerRect.bottom + props.gap}px`, 
        left: `${triggerCenterX - 100}px` // 临时宽度，后续会被实际宽度替换
    };
    
    // 3. isOpen = true
    isOpen.value = true;
    emit('open');
    
    // 4. 计算 panelRef 的精确位置
    nextTick(() => {
        nextTick(calcPanelPos);
    });
};

// 关闭面板
const closeDropdown = () => {
    if (!isOpen.value) return;
    
    isOpen.value = false;
    emit('close');
};

// 切换面板状态
const toggleDropdown = () => {
    isOpen.value ? closeDropdown() : openDropdown();
};

// 事件处理器
const handleClick = () => {
    if (props.trigger === 'click') {
        toggleDropdown();
    }
};

const handleContextMenu = (e) => {
    if (props.trigger === 'contextmenu') {
        e.preventDefault();
        toggleDropdown();
    }
};

const handleMouseEnter = () => {
    if (props.trigger !== 'hover') return;
    
    if (timer.value) {
        clearTimeout(timer.value);
        timer.value = null;
    }
    
    timer.value = setTimeout(openDropdown, 100);
};

const handleMouseLeave = () => {
    if (props.trigger !== 'hover') return;
    
    if (timer.value) {
        clearTimeout(timer.value);
        timer.value = null;
    }
    
    timer.value = setTimeout(() => {
        if (!panelRef.value?.contains(document.activeElement)) {
            closeDropdown();
        }
    }, 200);
};

// 处理选项点击
const handleItemClick = (value) => {
    emit('select', value);
    if (props.hideOnClick) {
        closeDropdown();
    }
};

// 点击外部关闭
const handleClickOutside = (e) => {
    if (isOpen.value && !dropdownRef.value?.contains(e.target) && !panelRef.value?.contains(e.target)) {
        closeDropdown();
    }
};

// 生命周期
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', isOpen.value ? calcPanelPos : null);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('resize', calcPanelPos);
    
    if (timer.value) {
        clearTimeout(timer.value);
        timer.value = null;
    }
});

// 监听props变化
watch(() => props.disabled, (newVal) => {
    if (newVal && isOpen.value) {
        closeDropdown();
    }
});

watch(() => props.placement, () => {
    if (isOpen.value) {
        nextTick(calcPanelPos);
    }
});

// 监听视口尺寸变化，当视口尺寸变化时重新计算面板位置
watch([vw, vh], () => {
    if (isOpen.value) {
        nextTick(calcPanelPos);
    }
}, { flush: 'post' });

// 监听面板尺寸变化，当面板尺寸变化时重新计算位置
watch(() => [panelSize.value.width, panelSize.value.height], () => {
    if (isOpen.value && (panelSize.value.width > 0 || panelSize.value.height > 0)) {
        nextTick(calcPanelPos);
    }
}, { flush: 'post' });

// 对外暴露方法
defineExpose({
    open: openDropdown,
    close: closeDropdown,
    toggle: toggleDropdown,
    recalcPosition: calcPanelPos,
    handleItemClick
});
</script>

<style lang="scss" scoped>
.y-dropdown {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 100%;

    .y-dropdown-trigger {
        cursor: pointer;
        height: 100%;
        box-sizing: border-box;

        &:focus-visible {
            outline: 2px solid #0969da;
            outline-offset: 2px;
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }

}
    .y-dropdown-panel {
        position: fixed;
        width: auto;
        min-width: 120px;
        max-width: 300px;
        background-color: #fff;
        border: 1px solid #e1e4e8;
        border-radius: 8px;
        // 阴影盒子效果
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
        padding: 8px;
        box-sizing: border-box;
        z-index: 9999;
        list-style: none;
        overflow: hidden;
        transition: opacity 0.2s ease, transform 0.2s ease;
        
        .y-dropdown-divider {
            height: 1px;
            margin: 4px 0;
            background: #e1e4e8;
        }
    }
</style>