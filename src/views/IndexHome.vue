<template>
  <div class="layout w-screen h-screen relative">
    <header class="fixed w-full px-2 z-1">
      <div class="h-10 flex flex-row justify-between items-center">
        <div class="flex items-center">
          <div class="w-5 h-5">
            <img class="mx-auto w-full w-auto block select-none" src="/loge.svg" alt="">
          </div>
          <span>Youloge <sup class="text-sm text-fuchsia-600">像素大战</sup></span>
        </div>
        <div class="flex items-center gap-2">
            <div>{{ hover.x }}x{{ hover.y }}</div>
            <input type="color" id="colorPicker" v-model="color" />
            <div>{{ width }}x{{ height }}</div>
        </div>
        <button @click="onLogin" class="border-0 bg-blue-400 text-white rounded-md px-4 py-2 hover:bg-blue-500"><span class="i-tdesign:mail"></span> 登录</button>
      </div>
    </header>
    <main class="grid grid-cols-24 gap-4">
      <div class="col-span-4"></div>
      <div class="col-span-16">
        <div id="container" class="relative w-screen h-screen" ref="containerRef">
          <canvas id="canvas" ref="canvasRef" v-on="getBind" :style="{ transform: transformMatrix }"></canvas>
        </div>
      </div>
      <div class="col-span-4"></div>
    </main>
    <!-- <main class="max-w-screen-md mx-auto mt-40 ">
      <div class="mt-10">  @change="onColorChange"
        <h1 class="color-blue font-size-36px mt-10" v-ripple>杰克布达</h1>
        <p class="font-size-24px font-bold text-gray-800 mt-10">但行好事 莫问前程</p>
        <p class="font-size-18px font-bold text-gray-500 mt-2">开源、快速、零权限、零成本 接口服务平台</p>
      </div>
    </main> -->
    <footer class="fixed bottom-0 border-0 border-solid border-t-1 border-gray-300 w-full">
      <div class="mt-2 text-center text-gray-500">
        <a href="https://beian.miit.gov.cn/" class="text-gray no-underline">
          <p>ICP备案/许可证号：皖ICP备19004549号</p>
        </a>
        <p>皖公安备 34112402000344</p>
      </div>
    </footer>
  </div>
</template>
<script setup>
const { success, warning, error, info } = useMessage();
const useYouPlus = YouPlus({
    debug:false
});

const containerRef = ref(null);
const canvasRef = ref(null);
const canvasCtx = ref(null);
const state = reactive({
    color:'#23ca92',hover:{},
    width:0,height:0,
    socket:null,
    pixels:[],
    canvas:null,
    ctx: null,
    isDragging: false,
    initialX: 0,
    initialY: 0,
    currentX: 0,
    currentY: 0,
    scale: 1,
    initialScale: 1,
    startX: 0,
    startY: 0,
    mouseX:0,
    mouseY:0,
}),{canvas,color,width,height,hover} = toRefs(state);
//
const onStart = ({button,clientX,clientY,offsetX,offsetY}=e)=>{
    if(button == 0){
        state.isDragging = true;
        state.initialX = clientX;
        state.initialY = clientY;
        state.startX = state.currentX;
        state.startY = state.currentY;
    }
    if(button ==2){
        rightClick(offsetX,offsetY);
    }
}
const onMove = ({clientX,clientY,offsetX,offsetY})=>{
    if(state.isDragging){
        state.currentX = clientX - state.initialX + state.startX;
        state.currentY = clientY - state.initialY + state.startY;
    }else{
        state.mouseX = offsetX;
        state.mouseY = offsetY;
    }
    // console.log(clientX,clientY,offsetX,offsetY)
} 
const onEnd = ()=>{
    state.isDragging = false
} 
const onWheel = (event)=>{
    const { clientX, clientY } = event;
    // const canvas = canvasRef.value;
    // const rect = canvas.getBoundingClientRect();
    // const mouseX = clientX - rect.left;
    // const mouseY = clientY - rect.top;

    // // 计算缩放前后的偏移量
    // const oldScale = state.scale;
    // const delta = event.deltaY < 0 ? 1.1 : 0.9; // 放大或缩小的比例
    // const newScale = state.scale * delta;

    // const deltaX = mouseX * (newScale - oldScale);
    // const deltaY = mouseY * (newScale - oldScale);

    // // 更新缩放比例和偏移量
    // state.scale = newScale;
    // state.currentX += deltaX;
    // state.currentY += deltaY;
    
    const delta = Math.sign(event.deltaY);
    console.log(delta)
    const newScale = state.scale - delta * 0.2;
    state.scale = Math.max(0.5, Math.min(newScale, 20));
}
/**
 * 初始化socket
 * open: 
 */
const initSocket = ()=>{
  let wss = new WebSocket('wss://wss.youloge.com/pixel');
  wss.onopen = function(){
    wss.send(`{"id":"0000","type":"pixel.info"}`)
    console.log('socket连接成功')
  }
  wss.onmessage = function(e){
    let json = JSON.parse(e.data);
    if(json.type == 'pixel.info'){
        canvasRef.value.width = state.width = json.width;
        canvasRef.value.height = state.height = json.height;
        canvasRef.value.style.width = state.width + 'px';
        canvasRef.value.style.height = state.height + 'px';
        wss.send(`{"id":"0001","type":"pixel.block"}`)
    }
    if(json.type == 'pixel.block'){
        const compressed = new Uint8Array(json.blob.data);
        console.log('compressed',compressed.length)
        const restored  = pako.inflate(compressed)
        const clampedArray = new Uint8ClampedArray(restored.buffer, restored.byteOffset, restored.byteLength);
        const imageData = new ImageData(clampedArray, state.width, state.height);
        canvasCtx.value.putImageData(imageData,0,0);
    }
    if(json.type == 'pixel.update'){
        let {x,y,blob} = json;
        const imageData = new ImageData(new Uint8ClampedArray(blob.data), 1, 1);
        canvasCtx.value.putImageData(imageData, x, y);
        if(state.hover.x == x && state.hover.y == y){
            state.hover.data = imageData.data
        }
    }
    if(json.type == 'pixel.tips'){
        alert(json.msg)
    }
  }
  wss.onclose = function(){}
  state.socket = wss;
}
const sendMessage = (data) => {
    state.socket.send(JSON.stringify(data))
}
// 同步画布
const syncCanvas = ()=>{
    sendMessage({type:'pixel.block',x:0,y:0,level:4})
}
// 自动提交
const autoPost = ()=>{
    let shift = state.pixels.shift();
    if(shift){
        let data = {type:'pixel.update',x:shift.x,y:shift.y,color:shift.color}
        console.log('data',data)
        sendMessage(data)
    }
    setTimeout(() => {
        autoPost()
    }, 10);
}
//
const drawPixel = (x, y, data)=>{
    const imageData = new ImageData(new Uint8ClampedArray(data), 1, 1);
    canvasCtx.value.putImageData(imageData, x, y);
}
const hexToRGBA = (hex) =>{
  hex = hex.replace(/^#/, '');
  // 将十六进制字符串转换为整数
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const a = parseInt(hex.substring(6, 8), 16) || 255;
  return [r, g, b, a];
}
const transformMatrix = computed(() => {
  return `matrix(${state.scale}, 0, 0, ${state.scale}, ${state.currentX}, ${state.currentY})`;
});
const rightClick = (clientX,clientY)=>{
    const {mouseX,mouseY,currentX,currentY,scale} = state
    state.socket.send(JSON.stringify({type:'pixel.update',x:mouseX,y:mouseY,color:state.color}))
}
// 悬浮配色
const hoverPixel = () => {
    const { ctx,hover, mouseX, mouseY, scale, currentX, currentY } = state;
    if(mouseX && mouseY && (hover.x !== mouseX || hover.y !== mouseY)){
        // 恢复旧像素
        if(hover.data){
            const imageOld = new ImageData(hover.data, 1, 1);
            canvasCtx.value.putImageData(imageOld, hover.x, hover.y);
        }
        // 存储新像素
        const imageNew = canvasCtx.value.getImageData(mouseX,mouseY,1,1);
        state.hover = {x:mouseX,y:mouseY,data:imageNew.data}
        // console.log('hover',state.hover)
        // 绘制Hover点
        drawPixel(mouseX, mouseY, hexToRGBA(state.color));
    }
    requestAnimationFrame(hoverPixel);
}
//
onMounted(()=>{
  canvasCtx.value = canvasRef.value.getContext('2d');
  // 
  initSocket()
  requestAnimationFrame(hoverPixel);
})
const onLogin = () => {
  useYouPlus.useLogin().then(profile=>{
    console.log(profile)
    useStorage('profile',profile);
    location.reload()
  }).catch(err=>{
    console.log(err)
    warning(err.msg)
  });
};
const preventDefault = (handler) => (event) => {
    event.preventDefault();
    handler && handler(event);
};
const getBind = {
    // mousedown:onStart,
    mousedown:preventDefault(onStart),
    mousemove:preventDefault(onMove),
    mouseup:preventDefault(onEnd),
    mouseleave:preventDefault(onEnd),
    wheel:preventDefault(onWheel),
    contextmenu:preventDefault(),

    // touchstart:onStart, 
    // touchmove:onMove,
    // touchend:onEnd,
    // touchcancel:onEnd
};
</script>

<style>
#container{overflow: hidden;}
#canvas {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
    visibility: visible;
    image-rendering: pixelated;
    /* transform-origin: 0px 0px 0px; */
    box-shadow: 0px 0px 0px 8px #9C27B0
}
</style>