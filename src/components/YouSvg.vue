<!-- 图标SVG加载 图标集:图标名称 -->
<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="props.width || props.size" :height="props.height || props.size" :viewBox="viewBox" v-html="content"></svg>
</template>

<script setup>
import { reactive,toRefs,watchEffect } from 'vue';
const state = reactive({
    viewBox:[0,0,24,24],
    content:'<path fill="#7d2424" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="0.5"/><path fill="#7d2424" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path>'
}),{viewBox,content} = toRefs(state);
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    size: {
      type: [String, Number],
      default: '16'
    },
    width:{
        type: [String, Number],
        default: '16',
    },
    height:{
        type: [String, Number],
        default: '16',
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
const loadIcon = async(iconname,abort) => {
    const [prefix, name] = iconname.split(':');
    if (!iconname || !prefix || !name) return;
    try {
        let color = encodeURIComponent(props.color);
        let {width,height,size} = props;
        const url = `https://api.iconify.design/${prefix}/${name}.svg?height=${height || size}&width=${width || size}&color=${color}&download=1`
        const response = await fetch(url,{signal: abort.signal});
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');
        state.viewBox = svgElement.attributes.viewBox.value;
        state.content = svgElement.innerHTML.trim();
    } catch (error) {
        console.error('图标无法下载', error);
    }
}
watchEffect((onInvalidate) => {
    const controller = new AbortController();
    loadIcon(props.name, controller);
    onInvalidate(() => controller.abort());
})
</script>

<style>

</style>