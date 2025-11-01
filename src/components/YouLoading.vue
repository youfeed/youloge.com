<template>
    <div v-if="taskGroup.length > 0" class="loading-overlay">
      <div class="spinner"></div>
      <div class="taskCount">x{{ taskGroup.length }}</div>
    </div>
</template>
  
<script setup>
  const state = reactive({
    taskGroup:[],
    lastMessage:'...'
  }),{taskGroup} = toRefs(state);
  // 
  const create = (options)=>{
    let uuid = crypto.randomUUID();
    let timer = setTimeout(()=>{
      remove(uuid);
    },options.duration || 8000)
    // 
    state.taskGroup.push({
      uuid:uuid,
      timer:timer
    });
    return uuid
  }
  // 移出指示器
  const remove = (uuid) => {
    let findIndex = state.taskGroup.findIndex(is=>is.uuid == uuid);
    findIndex == -1 || state.taskGroup.splice(findIndex,1);
  };
  // 暴露 create 和 remove 方法给函数组件
  defineExpose({ create,remove });
  </script>
  
  <style scoped>
  .loading-overlay,.taskCount {
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
  .taskCount{
    color: #c5c3c3;
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