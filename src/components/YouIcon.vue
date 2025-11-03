<!-- 图标加载 图标集:图标名称 -->
<template>
    <i :class="classed" :style="styled" v-if="svgContent" v-html="svgContent"></i>
    <slot v-else>
        <i class="animate-pulse bg-gray-200 w-4 h-4 rounded" />
    </slot>
</template>

<script setup>
import { computed,ref,watchEffect } from 'vue';
const svgContent = ref(null);
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    size: {
      type: [String, Number],
      default: '16',
      validator: (value) => {
        return Number(value) % 4 === 0
      }
    },
    color: {
        type: String,
        default: 'currentColor'
    },
    // rotate 
}), emits = defineEmits(['click']);
// CDN加载
// https://api.simplesvg.com
// https://api.unisvg.com
// https://api.iconify.design
// 加载图标
const loadIcon = async(iconname) => {
    const [prefix, name] = iconname.split(':');
    if (!iconname || !prefix || !name) return;
    try {
        let color = encodeURIComponent(props.color);
        const url = `https://api.iconify.design/${prefix}/${name}.svg?width=unset&color=${color}&download=1`
        const response = await fetch(url);
        const text = await response.text();
        svgContent.value = text;
    } catch (error) {
        console.error(`图标无法下载`);
    }
}
const styled = computed(()=>({
    width: `${props.size}px`,
    height: `${props.size}px`,
}))
const classed = computed(()=>({
  'inline-flex items-center justify-center': true,
  [`text-${props.color}`]:props.color,
}));
watchEffect(() => {
  loadIcon(props.name)
})
</script>

<style>

</style>