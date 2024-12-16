<template>
  <div class="">
    <h1 class="text-2xl font-bold">
        <div>素材选择({{onConut}}/{{props.limit}})</div>
        <label class="" for="file">上传素材</label>
    </h1>
    <div class="mt-4">
      <div class="flow">
        <div class="" v-for="(item,index) in state.list" :key="index">
            <div class="relative porter-bottom-1/2" @click="onSelect(item)">
                <img :src="useImage(item.url,80)" alt="">
                <div class="name">{{ item.checked }}</div>
            </div>
        </div>
      </div>
    </div>
    <div class="" @click="onCancel">取消</div>
    <div class="" @click="onSubmit">确认</div>
  </div>
  <input type="file" id="file" :accept="state.accept" name="file" class="hidden" @change="onFileChange"/>
</template>

<script setup>
const props = defineProps({
    'mime':{
      type:String,
      default:'image'
    },
    'limit':{
      type:Number,
      default:1
    }
}),emit = defineEmits(['confirm','cancel']);
//
const onConut = computed(()=>{
  return state.list.filter(item=>item.checked).length;
});
const state = reactive({
  err:0,msg:'',data:{},list:[],
  profile:{},accept:`${props.mime}/*`,
}),{err,msg,data,list,profile} = toRefs(state);

// 素材列表
const loadMaterial = ()=>{
  apiFetch(`material/${props.mime}`,{cursor:'',limit:10},true).then(res=>{
    state.list = res.data.data;
    console.log(state.list )
    // state.list.push(...res.data.data);Object.assign(state,res);
  })
}
// 取消选择
const onCancel = ()=>{
  emit('cancel',[]);
}
// 选择切换
const onSelect = (item)=>{
    item.checked = !item.checked;
    if(onConut.value >= props.limit){
        let items = state.list.filter(item=>item.checked);
        console.log(items)
        emit('confirm',items);
    }
}
// 确认提交
const onSubmit = ()=>{
    console.log('onSubmit')
    emit('confirm',[]);
}
// 文件上传
const onFileChange = (e)=>{
    let [file] = e.target.files
    console.log(1111,file)
    apiFetch(`material/create`,{type:props.mime,size:file.size}).then(res=>{
        onUpload(res.data.url,file);
    });
}
// 上传文件
const onUpload = (url,file)=>{
    const formData = new FormData();
    formData.append('file',file,file.name);
    console.log('formData',formData)
    const xhr = new XMLHttpRequest();
    xhr.open('POST',url,true);
    // xhr.setRequestHeader('Content-Type',file.mime);
    xhr.send(formData);
    xhr.onload = ()=>{
        console.log(xhr.responseText)
    };
    xhr.onerror = ()=>{
        console.log(xhr.responseText)
    }
    xhr.onprogress = (e)=>{
        console.log(e)
    }
    
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