<template>
  <dialog ref="dialog" class="classed" :style="styled" @click.stop = "onClick">
    <div class="p-2">
        <div class="flex items-center justify-between">
          <div class=" font-bold text-gray-800  text-shadow">Youloge</div>
          <div class="font-size-2xl color-gray-400">x</div>
        </div>
        <div>
            <p></p>
            <ul>
                <li>个人资料</li>
                <li>我的钱包</li>
                <li>我的钱包</li>
                <li>我的订单</li>
                <li>消息提醒</li>
                <li>退出登录</li>
            </ul>
        </div>
        <hr/>
        <hr/>
    </div>
  </dialog>
</template>

<script setup>
const props = defineProps({
  open:Boolean,
});
const state = reactive({
  dialog:null,active:null,
  styled:{
    height:'100%',
    maxHeight:'unset',
    minWidth:'192px',
    inset:'0 0 0 auto',
    border:'0',
    outline:'0',
    borderRadius:'20px',
    borderBottomRightRadius:0,
    borderTopRightRadius:0,
  }
}),{dialog,styled} = toRefs(state);

const open = ()=>{
  console.log('open')
  state.dialog.showModal();
}
const onClose = ()=>{
  state.dialog.close();
}
const onClick = (e)=>{
  e.stopPropagation();
  e.currentTarget == e.target && onClose();
}
defineExpose({open,onClose});
</script>

<style>

</style>