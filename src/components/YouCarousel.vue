<template>
  <div class="carousel w-full h-full" style="overflow: hidden; position: relative; width: 100%; height: 100%; transform: translateZ(0);">
    <div class="carousel-slides" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0;">
        <div class="carousel-frame" v-on="events" style="height: 100%; width: 100%; transform: translate(0%, 0px) translateZ(0px);" :style="contentStyle">
            <template v-for="(item,index) in virtualList" :key="index">
                <div class="item bg-red-400" style="position: absolute; width: 100%; height: 100%;" :style="itemStyle(index)">
                    {{ index }}
                    <slot v-bind="item"></slot>
                </div>
            </template>
        </div>
    </div>
  </div>
</template>
<script setup>
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  'modelValue':{type:Array,required:true}
});
const model =  useVmodel(props,'modelValue',emit)
console.log(10,model.value.length,model,props.modelValue)
//
const state = reactive({
    current:0,
    duration:200,
    interval:2000,
    circular:true,
    vertical:false,
    virtualList:new Array(3)
}),{current,virtualList} = toRefs(state);

// computed Location
// 页码计算 [curr,next,prev]
const pageNumber = ()=>{
    let len = model.value.length
    let current = state.current;
    return [current,(current + 1) % len,(current - 1 + len) % len];
}
// 
const transformX = [
    [0,100,-100],
    [-100,0,100],
    [100,-100,0],
];
const getLocation = ()=>{
    let [curr,next,prev] = pageNumber();
    console.log(prev,curr,next);
    return {
        curr:model.value[curr],
        next:model.value[next],
        prev:model.value[prev],
    }
}


const startX = ref(0);
const startY = ref(0);
const isDragging = ref(false);
const currentX = ref(0);
const itemStyle = (index)=>{
    return {
        transform: `translate(${transformX[0][index]}%, 0px) translateZ(0px)`
    }
}
const contentStyle = computed(() => ({
    // transition: `transform ${state.duration}ms ease-in-out`,
    transform: `translate(${currentX.value * 1.5}%, 0px) translateZ(0px)`
}));
const onStart = (e)=>{
    let [{clientX,clientY}] = e.touches || [e];
    startX.value = clientX;
    startY.value = clientY;
    isDragging.value = true;
    console.log('onStart',clientX,clientY,e)
}
const onMove = (e)=>{
    if(isDragging.value == false) return;
    let [{clientX,clientY}] = e.touches || [e];
    onDrag(clientX- startX.value,clientY - startY.value)
}
const onDrag = (dx,dy)=>{
    console.log('onDrag',dx,dy)
    // 达到阈值 翻页
    if(Math.abs(dx) > 30 || Math.abs(dy) > 30){
        dx > 0 ? onPrev() : onNext();
        // dx < 0 ? onNext() : onPrev();
    }
    currentX.value = dx;
}
const onEnd = (e)=>{
    currentX.value = 0;
    isDragging.value = false;
    // console.log(e)
}
// 上一页
const onPrev = ()=>{
    let [curr,next,prev] = pageNumber();
    transformX.unshift(transformX.pop());
    onEnd();
    state.current = prev;
    console.log('onPrev',transformX)
}
// 下一页
const onNext = ()=>{
    let [curr,next,prev] = pageNumber();
    state.current = next;
    transformX.push(transformX.shift());
    onEnd();
    onVirtualList();
    console.log('onNext',transformX)
}
// 更新虚拟队列
const onVirtualList = ()=>{
    let {curr,next,prev} = getLocation();
    state.virtualList = [curr,next,prev];
    console.log('onUpdate',virtualList.value)
}
// 初始化
onMounted(()=>{
    let {curr,next,prev} = getLocation();
    state.virtualList = [curr,next,prev];
    console.log('onMounted',virtualList.value)
})
// 监听事件
const events = {
    mousedown:onStart,
    mousemove:onMove,
    mouseup:onEnd,
    mouseleave:onEnd,
    touchstart:onStart,
    touchmove:onMove,
    touchend:onEnd,
    touchcancel:onEnd
};
</script>

<style>

</style>