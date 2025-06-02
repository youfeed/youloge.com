<template>
  <div class="max-w-7xl mx-auto p-4">
    <div class="profile flex items-center mb-4 relative bg-light p-2 rounded-sm">
      <div>
        <img :src="useImage(profile.avatar,'80')" alt="avatar" class="rounded-full w-12 h-12 border"/>
      </div>
      <div class="ml-2">
        <div class="text-sm font-bold flex items-center">
          <div class="name">{{profile.name}}</div>
          <div class="user max-w-40 truncate">@{{ profile.user }}</div>
        </div>
        <div class="text-sm text-gray-400">{{ profile.uuid }} · {{profile.mail}}</div>
      </div>
      <div class="absolute right-1 top-1 text-sm text-blue-500 cursor-pointer" @click="mode='profile'">编辑</div>
    </div>
    <!-- FEED -->
    <div class="feed">
      <div>
        <div class="text-sm font-bold flex items-center">
          <div class="name">Feed</div>
        </div>
      </div>
      <div class="grid col-span-4 grid-cols-2 gap-2">
        <div class="rounded-xl border bg-card text-card-foreground shadow @container/card"><div class="flex flex-col space-y-1.5 p-6 relative"><div class="text-sm text-muted-foreground">Total Revenue</div><div class="tracking-tight @[250px]/card:text-3xl text-2xl font-semibold tabular-nums">$1,250.00</div><div class="absolute right-4 top-4"><div class="items-center border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground flex gap-1 rounded-lg text-xs"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up size-3"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>+12.5%</div></div></div><div class="flex p-6 pt-0 flex-col items-start gap-1 text-sm"><div class="line-clamp-1 flex gap-2 font-medium">Trending up this month <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up size-4"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg></div><div class="text-muted-foreground">Visitors for the last 6 months</div></div></div>
        <div class="rounded-xl border bg-card text-card-foreground shadow @container/card"><div class="flex flex-col space-y-1.5 p-6 relative"><div class="text-sm text-muted-foreground">Total Revenue</div><div class="tracking-tight @[250px]/card:text-3xl text-2xl font-semibold tabular-nums">$1,250.00</div><div class="absolute right-4 top-4"><div class="items-center border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground flex gap-1 rounded-lg text-xs"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up size-3"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>+12.5%</div></div></div><div class="flex p-6 pt-0 flex-col items-start gap-1 text-sm"><div class="line-clamp-1 flex gap-2 font-medium">Trending up this month <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up size-4"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg></div><div class="text-muted-foreground">Visitors for the last 6 months</div></div></div>
        <div class="rounded-xl border bg-card text-card-foreground shadow @container/card"><div class="flex flex-col space-y-1.5 p-6 relative"><div class="text-sm text-muted-foreground">Total Revenue</div><div class="tracking-tight @[250px]/card:text-3xl text-2xl font-semibold tabular-nums">$1,250.00</div><div class="absolute right-4 top-4"><div class="items-center border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground flex gap-1 rounded-lg text-xs"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up size-3"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>+12.5%</div></div></div><div class="flex p-6 pt-0 flex-col items-start gap-1 text-sm"><div class="line-clamp-1 flex gap-2 font-medium">Trending up this month <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up size-4"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg></div><div class="text-muted-foreground">Visitors for the last 6 months</div></div></div>
      </div>
    </div>
    <!-- README -->
    <div class="README">
      <div class="flex justify-between items-center mb-4 h-5 p-1">
        <div>README</div>
        <div>
          <div class="text-sm text-blue-500 cursor-pointer" @click="onMode">编辑 预览</div>
        </div>
      </div>
      <!-- 默认预览 -->
      <template v-if="mode == 'preview'">
        <div v-html="html"></div>
      </template>
      <!-- 编辑个人说明 -->
      <template v-if="mode == 'editor'">
        <YouEditor v-model="html"></YouEditor>
        <button class="" @click="saveReadme">记得保存</button>
      </template>
      <!-- 编辑个人资料 -->
      <template v-if="mode == 'profile'">
        <div class="item">
          <div class="title">头像</div>
          <div @click="chooseAvatar">选择新头像</div>
        </div>
        <div>
          <form @submit.prevent="updateName">
            <div>
              <label>昵称</label>
              <div class="tips">可以更好被搜索到(每次消耗1RGB)</div>
            </div>
            <input type="text" v-model="profile.name" />
            <button type="submit">变更</button>
          </form>
        </div>
        <div>
          <form @submit.prevent="">
            <div>
              <label>别称</label>
              <div class="tips">@别名可以更好被搜索到(30天可以修改一次)</div>
            </div>
            <input type="text" v-model="profile.user" />
            <button>变更</button>
          </form>
        </div>
        <div>2333</div>
        <button @click="mode='preview'">返回</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useDialog } from '../composables/useDialog';

const props = defineProps(['params']),emit = defineEmits(['jump']);
const state = reactive({
  profile:{},mode:"preview",html:''
}),{profile,mode,html} = toRefs(state);
//
// 获得用户介绍
const getReadme = ()=>{
  let {uuid} = state.profile;
  fetch(`https://cdn.youloge.com/readme/${uuid}?t=${new Date().getTime() / 1000 / 60 >> 0}`).then(r=>{
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
  apiFetch('account/readme',{size:bolb.size}).then(res=>{
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
// 更换头像
const chooseAvatar = ()=>{
  useMaterial({type:'image',limit:1}).then(items=>{
    let [item] = items;
    state.profile.avatar = item.etag;
    console.log('ss',items,item.etag)
    apiFetch('profile/avatar',{uuid:item.uuid}).then(res=>{
      useMessage().success('保存成功');
      useStorage('profile',{avatar:item.etag});
    })
  })
}
// 修改昵称
const updateName = ()=>{
  apiFetch('profile/name',{name:state.profile.name}).then(res=>{
    useMessage().success('保存成功');
    useStorage('profile',{name:state.profile.name});
  })
}
onMounted(()=>{
  state.profile = useAuth();
  const profile = useAuth();
  // console.log('profile',profile)
  getReadme();
});
// 路由跳转(动态组件内部跳转)
const navigateTo = (path,params='')=>{
    emit('jump',path,params);
}
</script>

<style>

</style>