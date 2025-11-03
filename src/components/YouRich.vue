<template>
    <div>
        <div class="rich" v-html="props.modelValue"></div>
    </div>
</template>

<script setup>
import '@/assets/prism/index.css';
import '@/assets/prism/index.js';
import { nextTick } from 'vue';
import 'youloge.custom';
const props = defineProps(['modelValue']), emit = defineEmits(['update:modelValue']);
const model = useVmodel(props, 'modelValue', emit);

onMounted(()=>{
    
});
watch(()=>props.modelValue,()=>{
    nextTick(()=>{
        const codeBlocks = document.querySelectorAll('.rich pre code');
        codeBlocks.forEach(block=>{
          const preElement = block.parentElement
          // 给 pre 加插件类名（按需启用）
          preElement.classList.add('line-numbers') // 行号
          preElement.classList.add('copy-to-clipboard') // 复制按钮 
          preElement.classList.add('show-language') // 显示语法（可选）
          // preElement.classList.add('command-line') // 显示语法（可选）
          Prism.highlightElement(block)
        });
    });
},{
    immediate:true
})
onBeforeUnmount(()=>{

});

</script>

<style>
.rich {
  line-height: 1.8;
}

.rich pre {
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
  border-radius: 8px;
}

/* 确保行号不被遮挡 */
.rich .line-numbers {
  padding-left: 4rem !important; /* 适配行号宽度 */
}
</style>