<template>
    <div v-if="visible" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 定义 visible 状态
  const visible = ref(false);
  
  // 显示加载指示器
  const toggle = () => {
    visible.value = !visible.value;
  };
  // 暴露 show 和 hide 方法给父组件
  defineExpose({ toggle });
  </script>
  
  <style scoped>
  .loading-overlay {
    position: fixed;
    top: -20%;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  .spinner {
    border: 4px solid rgba(73, 69, 69, 0.3);
    border-top: 4px solid #ffffff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>