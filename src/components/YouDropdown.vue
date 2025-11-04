<template>
  <div class="y-dropdown" ref="dropdownRef">
    <div 
      class="y-dropdown-trigger" 
      ref="triggerRef" 
      @click="toggleDropdown"
      :disabled="props.disabled"
    >
      <slot></slot>
    </div>
    <div 
      v-if="isOpen"
      class="y-dropdown-panel" 
      ref="panelRef" 
      :style="panelStyle"
    >
      <slot name="panel"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  gap: { type: Number, default: 4 }, // 间距（数字更精准）
  panelWidth: { type: Number, default: 0 }, // 0=自动匹配trigger宽度
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['open', 'close', 'select']);

// 核心状态
const isOpen = ref(false);
const dropdownRef = ref(null);
const triggerRef = ref(null);
const panelRef = ref(null);
const panelPos = ref({}); // 存储定位属性（top/bottom/left/right）

/** 1. 切换面板显示 */
const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  isOpen.value ? emit('open') : emit('close');
  if (isOpen.value) nextTick(calcPanelPos);
};

/** 2. 核心：判断 trigger 中心点偏向哪个角落（左上/右上/左下/右下） */
const getCornerDirection = () => {
  const trigger = triggerRef.value;
  if (!trigger) return '左上';

  const triggerRect = trigger.getBoundingClientRect();
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  // 计算 trigger 中心点坐标
  const triggerCenterX = triggerRect.left + triggerRect.width / 2;
  const triggerCenterY = triggerRect.top + triggerRect.height / 2;

  // 计算视口中心点坐标
  const viewportCenterX = viewportW / 2;
  const viewportCenterY = viewportH / 2;

  // 判断偏向：左右 + 上下
  const isLeft = triggerCenterX < viewportCenterX; // 偏向视口左侧
  const isTop = triggerCenterY < viewportCenterY; // 偏向视口上方

  // 组合成 4 个角落方向
  if (isLeft && isTop) return '左上';
  if (!isLeft && isTop) return '右上';
  if (isLeft && !isTop) return '左下';
  return '右下'; // 最后兜底
};

/** 3. 按角落方向计算面板定位（完全按你的规则实现） */
const calcPanelPos = () => {
  const trigger = triggerRef.value;
  const panel = panelRef.value;
  if (!trigger || !panel) return;

  const triggerRect = trigger.getBoundingClientRect();
  const panelW = props.panelWidth || triggerRect.width; // 面板宽度
  const panelH = panel.offsetHeight; // 面板实际高度
  const gap = props.gap;
  const corner = getCornerDirection();
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const pos = {};

  // 完全按你的规则实现定位，灵活使用 top/bottom/left/right
  switch (corner) {
    // 2. 左上 → top=trigger.bottom+gap，left=trigger.left（面板在trigger右下方，左对齐）
    case '左上':
      pos.top = `${triggerRect.bottom + gap}px`;
      pos.left = `${triggerRect.left}px`;
      break;
    // 3. 右上 → top=trigger.bottom+gap，right=视口宽度 - trigger.right（面板在trigger左下方，右对齐）
    case '右上':
      pos.top = `${triggerRect.bottom + gap}px`;
      pos.right = `${viewportW - triggerRect.right}px`; // 右对齐trigger右侧
      break;
    // 4. 左下 → bottom=视口高度 - (trigger.top - panelH - gap)，left=trigger.left（面板在trigger右上方，左对齐）
    case '左下':
      pos.bottom = `${viewportH - (triggerRect.top - panelH - gap)}px`;
      pos.left = `${triggerRect.left}px`;
      break;
    // 5. 右下 → bottom=视口高度 - (trigger.top - panelH - gap)，right=视口宽度 - trigger.right（面板在trigger左上方，右对齐）
    case '右下':
      pos.bottom = `${viewportH - (triggerRect.top - panelH - gap)}px`;
      pos.right = `${viewportW - triggerRect.right}px`;
      break;
  }

  // 兜底：避免面板超出视口边界（可选，增强稳定性）
  if (pos.left) pos.left = `${Math.max(parseInt(pos.left), 8)}px`;
  if (pos.right) pos.right = `${Math.max(parseInt(pos.right), 8)}px`;

  panelPos.value = pos;
};

/** 4. 面板样式（合并定位和基础样式） */
const panelStyle = computed(() => ({
  width: 'auto',
  minWidth: '120px',
//   maxWidth: '300px',
  backgroundColor: '#fff',
  border: '1px solid #e1e4e8',
  borderRadius: '6px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
  padding: '4px 0',
  boxSizing: 'border-box',
  position: 'fixed', // 脱离父元素，适配fixed header
  zIndex: 9999, // 置顶不被覆盖
  ...panelPos.value, // 动态定位属性（top/bottom/left/right）
  opacity: 1,
  transform: 'scale(1)',
  transition: 'opacity 0.2s ease, transform 0.2s ease'
}));

/** 5. 点击外部关闭 */
const handleClickOutside = (e) => {
  if (isOpen.value && !dropdownRef.value?.contains(e.target)) {
    isOpen.value = false;
    emit('close');
  }
};

/** 6. 窗口resize时更新位置 */
const handleResize = () => {
  if (isOpen.value) calcPanelPos();
};

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});

// 对外暴露方法
defineExpose({
  open: () => !props.disabled && (isOpen.value = true),
  close: () => (isOpen.value = false),
  toggle: toggleDropdown
});
</script>

<style lang="scss" scoped>
.y-dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;
  outline: none;
  height: 100%; // 适配header高度
  z-index: auto;

  .y-dropdown-trigger {
    // display: inline-flex;
    // align-items: center;
    // padding: 6px 12px;
    // background: #f6f8fa;
    // border: 1px solid #e1e4e8;
    // border-radius: 6px;
    // font-size: 14px;
    // color: #24292e;
    cursor: pointer;
    height: 100%;
    box-sizing: border-box;
    gap: 6px;

    &:focus-visible {
      outline: 2px solid #0969da;
      outline-offset: 2px;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .y-dropdown-panel {
    list-style: none;
    overflow: hidden;

    .y-dropdown-divider {
      height: 1px;
      margin: 4px 0;
      background: #e1e4e8;
    }
  }}
</style>