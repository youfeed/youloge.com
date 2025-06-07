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
                <li>个人中心</li>
                <li>视频短片</li>
                <li>购物</li>
                <li>资讯文章</li>
            </ul>
        </div>
        <hr/>
        <div>
            <p>我的</p>
            <ul>
                <li>个人中心</li>
                <li>视频短片</li>
                <li>购物</li>
                <li>资讯文章</li>
            </ul>
        </div>
        <hr/>
        <footer>
            @2025 Jakebuda,Inc All rights reserved.
            <div class="flex gap-2"></div>
        </footer>
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
    inset:'0 auto 0 0',
    border:'0',
    outline:'0',
    borderRadius:'20px',
    borderBottomLeftRadius:0,
    borderTopLeftRadius:0,
  }
}),{dialog,styled} = toRefs(state);

const onShow = ()=>{
  state.dialog.showModal();
}
const onClose = ()=>{
  state.dialog.close();
}
const onClick = (e)=>{
  e.stopPropagation();
  e.currentTarget == e.target && onClose();
}
defineExpose({onShow,onClose});
</script>

<style>

</style>