<template>
  <div class="profile-trigger" v-login="onTrigger" ref="trigger">
      <div class="w-6 h-6">
        <img :src="useImage(stateProfile.avatar,'80')" alt="" class="w-full h-full rounded-full">
      </div>
      <slot></slot>
  </div>
  
  <!-- 弹窗容器 -->
  <dialog ref="dialog" class="profile-dialog" :style="dialogStyle" @click.stop="onBackdropClick">
    <div ref="content" class="profile-content">
      <div class="profile-header">
        <div class="user-info">
          <div class="avatar">
            <img :src="useImage(stateProfile.avatar,'80')" alt="" class="w-full h-full rounded-full">
          </div>
          <div class="user-details">
            <div class="username font-bold text-gray-800">{{ stateProfile.name }}</div>
            <div class="email text-sm text-gray-500">{{ stateProfile.mail }}</div>
          </div>
        </div>
        <button class="close-btn" @click="onEdit">
            <you-svg name="carbon:edit"></you-svg>
        </button>
      </div>
      
      <div class="profile-menu">
        <ul class="menu-list">
          <li class="menu-item" @click="onMenuClick('profile')">
            <you-svg name="carbon:user" class="mr-2"></you-svg>个人资料
          </li>
          <li class="menu-item" @click="useSetup('setupWallet')">
            <you-svg name="carbon:wallet" class="mr-2"></you-svg>我的钱包
          </li>
          <li class="menu-item" @click="useSetup('setupBilling')">
            <you-svg name="carbon:shopping-bag" class="mr-2"></you-svg>我的订单
          </li>
          <li class="menu-item" @click="onMenuClick('notifications')">
            <you-svg name="carbon:notification" class="mr-2"></you-svg>消息提醒
          </li>
          <li class="menu-item" @click="onMenuClick('settings')">
            <you-svg name="carbon:settings" class="mr-2"></you-svg>设置
          </li>
          <li class="menu-divider"></li>
          <li class="menu-item text-red-500" @click="onMenuClick('logout')">
            <you-svg name="carbon:logout" class="mr-2"></you-svg>切换账户
          </li>
          <li class="menu-item text-red-500" @click="onMenuClick('logout')">
            <you-svg name="carbon:logout" class="mr-2"></you-svg>退出登录
          </li>
        </ul>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';

// 引入依赖
const stateProfile = storeProfile();

// 使用 useTemplateRef
const dialog = useTemplateRef('dialog');
const content = useTemplateRef('content');
const trigger = useTemplateRef('trigger');

// 使用 defineModel
const modelValue = defineModel({
    type: Boolean,
    default: false
});

// 定义事件
const emit = defineEmits(['menu-click']);

// 组件状态
const state = reactive({
  position: {
    top: '0px',
    left: '0px'
  }
});

// 计算对话框样式
const dialogStyle = computed(() => ({
  position: 'fixed',
  top: state.position.top,
  left: state.position.left,
  width: 'auto',
  height: 'fit-content',
  minWidth: '200px',
  maxWidth: '300px',
  padding: '0',
  margin: '0',
  border: 'none',
  outline: 'none',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  backgroundColor: '#fff',
  overflow: 'hidden',
  zIndex: 1000
}));

// 计算对话框位置
const calculatePosition = async () => {
  if (!trigger.value) return;
  
  await nextTick();
  
  const triggerRect = trigger.value.getBoundingClientRect();
  const contentWidth = 280; // 预估内容宽度
  const contentHeight = 380; // 预估内容高度
  
  // 计算右下方的位置，确保不超出视口
  let left = triggerRect.left + triggerRect.width - contentWidth;
  let top = triggerRect.bottom + 8; // 8px 间距
  
  // 确保不超出右边界
  if (left < 8) {
    left = 8;
  }
  
  // 确保不超出下边界
  if (top + contentHeight > window.innerHeight - 8) {
    top = triggerRect.top - contentHeight - 8; // 改为上方显示
  }
  
  state.position = {
    top: `${top}px`,
    left: `${left}px`
  };
};

// 触发菜单
const onTrigger = async () => {
  if (dialog.value) {
    await calculatePosition();
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
    onClose();
  }
};

// 菜单项点击处理
const onMenuClick = (menuId) => {
  emit('menu-click', menuId);
  onClose();
};
// 编辑资料
const onEdit = () => {
  emit('menu-click', 'edit');
  onClose();
};
// 监听 modelValue 变化
watch(modelValue, (newVal) => {
  if (newVal) {
    onTrigger();
  } else {
    onClose();
  }
});

// 监听窗口大小变化，重新计算位置
onMounted(() => {
  window.addEventListener('resize', calculatePosition);
  
  // 组件卸载时移除事件监听
  return () => {
    window.removeEventListener('resize', calculatePosition);
  };
});

// 暴露方法
defineExpose({
  onShow: onTrigger,
  onClose
});
</script>

<style lang="scss">
.profile-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.profile-dialog {
  opacity: 0;
  transition: opacity 0.2s ease;
  
  &[open] {
    opacity: 1;
  }
}

.profile-dialog::backdrop {
  background-color: transparent;
}

.profile-content {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  max-width: 300px;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  font-size: 16px;
}

.email {
  font-size: 12px;
  color: #666;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
}

.profile-menu {
  padding: 8px 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &.text-red-500 {
    color: #ff4d4f;
  }
}

.menu-divider {
  height: 1px;
  background-color: #f0f0f0;
  margin: 8px 16px;
}
</style>