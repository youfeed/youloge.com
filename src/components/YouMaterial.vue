<template>
  <dialog ref="dialog" @close="onCancel" class="y-material">
    <div class="">
        <div class="head flex justify-between items-center border-b">
            <div>素材选择({{onConut}}/{{props.limit}})</div>
            <label class="" for="file">上传素材</label>
        </div>
        <div class="body py-4">
            <div class="flow grid grid-cols-6 gap-2">
                <div class="" v-for="(item,index) in state.list" :key="index">
                    <div class="relative porter-bottom-1/2" @click="onSelect(item)">
                        <img :src="useImage(item.etag,80)" alt="">
                        <div class="name">{{ item.checked }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="foot flex justify-end items-center mt-1">
            <button @click="onCancel" class="bg-gray-200 rounded-sm px-4 py-2 border-none cursor-pointer">取消</button>
            <button @click="onConfirm" class="bg-blue-600 rounded-sm px-4 py-2 border-none text-white ml-2 cursor-pointer">确认</button>
        </div>
    </div>
  </dialog>
  <input type="file" id="file" :accept="onAccept" name="file" class="hidden" @change="onFileChange"/>
</template>

<script setup>
import { toRaw } from "vue";

const props = defineProps({
    'type':{
      type:String,
      default:'image'
    },
    'limit':{
      type:Number,
      default:1
    }
}),emit = defineEmits(['confirm','cancel']),dialog = ref(null);
//
const onConut = computed(()=>{
  return state.list.filter(item=>item.checked).length;
});
const onAccept = computed(()=>{
    return ['image','audio','video'].includes(props.type) ? `${props.type}/*` : '*/*';
})
const state = reactive({
  err:0,msg:'',data:{},list:[],
  cursor:{}
}),{err,msg,data,list,profile} = toRefs(state);

// 素材列表
const loadMaterial = ()=>{
  apiFetch(`material/${props.type}`,{cursor:'',limit:10}).then(res=>{
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
        emit('confirm',JSON.parse(JSON.stringify(items)));
    }
}
// 确认提交
const onConfirm = ()=>{
    if(onConut.value < props.limit){
        alert('请选择素材');return;
    }
    console.log('onConfirm')
    emit('confirm',[]);
}
// 文件上传
const onFileChange = (e)=>{
    let [file] = e.target.files
    console.log(1111,file)
    apiFetch(`material/create`,{type:props.type,size:file.size}).then(res=>{
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
    dialog.value.showModal()
    console.log(props,emit)
})
</script>

<style  lang="scss">
    .y-material-container {
        user-select: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999999999;
        // background-color: rgba(0, 0, 0, .5);
        .y-material {
            position: fixed;
            top: 40px;
            left: 50%;
            transform: translate(-50%);
            z-index: 999999999;
            background-color: #fff;
            width: 600px;
            // height: 100%;
            overflow-y: auto;
            margin: 5px;
            padding: 10px;
            border: 0;
        }
    }
    dialog::backdrop {
        background-color: rgba(0, 0, 0, .1);
        // opacity: 0.75;
    }

</style>