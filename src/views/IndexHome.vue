<template>
  <div class="layout w-screen h-screen relative">
    <header class="fixed w-full px-2">
      <div class="h-10 flex flex-row justify-between items-center">
        <div class="flex items-center">
          <div class="w-5 h-5">
            <img class="mx-auto w-full w-auto block select-none" src="/loge.svg" alt="">
          </div>
          Youloge
        </div>
        <button @click="onLogin" class="border-0 bg-blue-400 text-white rounded-md px-4 py-2 hover:bg-blue-500"><span class="i-tdesign:mail"></span> 登录</button>
      </div>
    </header>
    <main >
        <div id="container" class="relative w-screen h-screen" ref="containerRef">
          <canvas id="canvas" ref="canvasRef" v-on="getBind" :style="{ transform: transformMatrix }"></canvas>
          <div id="picker">
            <input type="color" id="colorPicker" v-model="color" />
          </div>
        </div>
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
// import {ref, onMounted,computed } from 'vue';
const { success, warning, error, info } = useMessage();
//
const containerRef = ref(null);
const canvasRef = ref(null);
const state = reactive({
    color:'#23ca92',
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
}),{canvas,color} = toRefs(state);
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
        state.scale = 10
        rightClick(clientX,clientY);
    }
//   console.log(e)

}
const onMove = ({clientX,clientY,offsetX,offsetY})=>{
    if(state.isDragging){
        state.currentX = clientX - state.initialX + state.startX;
        state.currentY = clientY - state.initialY + state.startY;
    }else{
        state.mouseX = clientX;
        state.mouseY = clientY;
    }
} 
const onEnd = ()=>{
    state.isDragging = false
} 
const onWheel = (event)=>{
    const delta = Math.sign(event.deltaY);
    const newScale = state.scale - delta * 0.4;
    state.scale = Math.max(0.7, Math.min(newScale, 20));
}
const initSocket = ()=>{
  let wss = new WebSocket('ws://127.0.0.1:997/pixel');
  wss.onopen = function(){
    syncCanvas();autoPost();
    console.log('socket连接成功')
  }
  wss.onmessage = function(e){
    let json = JSON.parse(e.data);
    if(json.type == 'pixel.block'){
        console.log('pixel.block',json)
        const compressed = new Uint8Array(json.blob.data);
        console.log('compressed',compressed.length)
        const restored  = pako.inflate(compressed) // , { to: 'string' }
        const clampedArray = new Uint8ClampedArray(restored.buffer, restored.byteOffset, restored.byteLength);
        console.log('clampedArray',clampedArray)
        const imageData = new ImageData(clampedArray, 256, 256);
        state.ctx.putImageData(imageData, 0, 0);
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
        sendMessage({type:'pixel.update',x:shift.x,y:shift.y,color:shift.color})
    }
    setTimeout(() => {
        autoPost()
    }, 10);
}
//
const drawPixel = (x, y, color)=>{
    const imageData = state.ctx.createImageData(1, 1);
    const [r, g, b, a] = color;
    imageData.data.set([r, g, b, a]);
    state.ctx.putImageData(imageData, x, y);
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
    const {left,top} = canvasRef.value.getBoundingClientRect();
    const x = (mouseX - currentX) / scale >> 0;
    const y = (mouseY - currentY) / scale >> 0;
    const color = state.color;
    const rgba = hexToRGBA(color)
    drawPixel(x, y, rgba, color);
    state.pixels.push({ x, y, rgba, color });
    console.log(state.color)
}
const drawMousePixel = () => {
  if (state.ctx) {
    const { ctx, mouseX, mouseY, scale, currentX, currentY } = state;
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    // 重新绘制所有右键绘制的点
    state.pixels.forEach(({ x, y, rgba }) => {
      drawPixel(x, y, rgba);
    });
    const x = (mouseX - currentX) / scale >> 0;
    const y = (mouseY - currentY) / scale >> 0;
    drawPixel(x, y, hexToRGBA(state.color));
  }
//   requestAnimationFrame(drawMousePixel);
};
//
onMounted(()=>{
  const ctx = canvasRef.value.getContext('2d');
  state.ctx = ctx;
  ctx.fillStyle = 'blue';
  ctx.fillRect(50, 50, 100, 100);
  //
  initSocket()
  //
  requestAnimationFrame(drawMousePixel);
})
const onLogin = () => {
  usePlus('login').then(profile=>{
    console.log(profile)
    useStorage('profile',profile);
    location.reload()
  }).catch(err=>{
    warning(err.msg)
  })
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
#picker{
    position: absolute;
    top: 100px;
    right: 100px;
}
#canvas {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
    /* cursor: none; */
    visibility: visible;
    image-rendering: pixelated;
    transform-origin: 0px 0px 0px;
    box-shadow: 0px 0px 2px 1px #d9baba;
}
</style>