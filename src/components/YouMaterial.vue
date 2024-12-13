<template>
  <div class="">
    <h1 class="text-2xl font-bold">素材选择(0/{{props.limit}})</h1>
    <div class="mt-4">
      
    </div>
    <div class="" @click="onCancel">取消</div>
    <div class="" @click="onSubmit">确认</div>
  </div>
</template>

<script setup>
const props = defineProps({
    'mime':{
      type:String,
      default:'image'
    },'limit':{
      type:Number,
      default:1
    }
}),emit = defineEmits(['confirm','cancel']);
//
const state = reactive({
  err:0,msg:'',data:{},list:[],
  profile:{}
}),{err,msg,data,list,profile} = toRefs(state);

// 素材列表
const loadMaterial = ()=>{
  apiFetch(`material/${props.mime}`,{cursor:'',limit:10},true).then(res=>{
    // state.list.push(...res.data.data);Object.assign(state,res);
  })
}
// 取消选择
const onCancel = ()=>{
  emit('cancel',[]);
}
// 确认提交
const onSubmit = ()=>{
    console.log('onSubmit')
    emit('confirm',[]);
}
// 暴漏方法 props
// 初始加载
onMounted(()=>{
    loadMaterial(); 
    console.log(props,emit)
})

</script>

<style>
.y-material-container{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
}

</style>