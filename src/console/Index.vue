<template>
  <div class="max-w-xl mx-auto p-4">
    <div class="profile flex items-center mb-4 relative bg-light p-2 rounded-sm">
      <div>
        <img :src="useImage(profile.avatar,'80')" alt="avatar" class="rounded-full w-12 h-12 border"/>
      </div>
      <div class="ml-2">
        <div class="text-sm font-bold">{{profile.name}}@{{ profile.user }} · {{ profile.uuid }}</div>
        <div class="text-sm text-gray-400">{{profile.mail}}</div>
      </div>
      <div class="absolute right-1 top-1 text-sm text-blue-500 cursor-pointer" @click="navigateTo('profile')">编辑</div>
    </div>
    <!-- README -->
    <div class="README">
      <div class="flex justify-between items-center mb-4 h-5 p-1">
        <div>README</div>
        <div>
          <div class="text-sm text-blue-500 cursor-pointer" @click="onMode">编辑 预览</div>
        </div>
      </div>
      
      <template v-if="mode == 'preview'">
        <div v-html="html"></div>
      </template>
      <template v-if="mode == 'editor'">
        <YouEditor v-model="html"></YouEditor>
        <button class="" @click="saveReadme">记得保存</button>
      </template>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['params']),emit = defineEmits(['jump']);
const state = reactive({
  profile:{},mode:"preview",html:''
}),{profile,mode,html} = toRefs(state);
//
// 获得用户介绍
const getReadme = ()=>{
  let {uuid} = state.profile;
  fetch(`https://cdn.youloge.com/readme/${uuid}`).then(r=>{
    if(r.ok){
      return r.text();
    };
    throw new Error();
  }).then(html=>{
    state.html = html;console.log(html)
  }).catch(err=>{
    console.log(333)
    console.log(err)
  })
}
// 切换模式
const onMode = ()=>{
  state.mode = state.mode == 'preview'?'editor':'preview';
}
// 保存介绍
const saveReadme = ()=>{
  let bolb = new Blob([state.html],{type:'text/html'});
  useMessage().success('保存成功');
  console.log(bolb)
  apiFetch('account/readme',{size:bolb.size},true).then(res=>{
    onUpload(res.data.upload,bolb)
  })
}
// 上传文档
const onUpload = (upload,bolb)=>{
  let formData = new FormData();
  formData.append('file',bolb,'1.html');
  formData.append('key',state.profile.uuid);
  fetch(upload,{method:'POST',body:formData}).then(r=>r.json()).then(res=>{
    res.error && useMessage().error(res.error);
    res.err && useMessage().success('保存成功');
  }).catch(err=>{
    console.log(err)
    useMessage().error('保存失败');
  })
}
//
onMounted(()=>{
  state.profile = useAuth();
  const profile = useAuth();
    console.log('profile',profile)
    getReadme();
});
// 路由跳转(动态组件内部跳转)
const navigateTo = (path,params='')=>{
    emit('jump',path,params);
}
</script>

<style>

</style>