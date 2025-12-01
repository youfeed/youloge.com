<template>
    <div v-if="err==0">
      <div class="flex items-center justify-center h-screen-sm">
        <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
      </div>
    </div>
    <div v-else-if="err == 200">
      <div class="head  border-b-1 border-gray-500 border-b-solid pb-2">
        <div class="flex items-center justify-between max-w-3xl mx-auto">
          <div class="flex gap-2">
            <div class="w-15 h-15 sm:w-15 sm:h-15 bg-cover bg-center rounded-full" >
              <img :src="useImage(profile.avatar,'80')" alt="" class="max-w-full max-h-full">
            </div>
            <div class="">
              <div class="flex ">
                <div class="font-bold max-w-40 truncate" @click="xyz">{{ profile.name }}</div>
                <div class="max-w-20 truncate">@{{ profile.user }}</div>
              </div>
              <div class="mt-1"><span class="hidden sm:inline">{{ profile.uuid }} · </span>{{ profile.mail }}<span class="hidden sm:inline"> · {{ profile.created }}</span></div>
            </div>
          </div>
          <div class="ml-2">
            <div class="font-size-sm color-gray-400" title="对方不知道你的关注，但你可以获取他的最新动态">
              <you-follow type="account" :uuid="profile.uuid" v-slot="{status}"></you-follow>
            </div>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="mt-5 max-w-3xl mx-auto">
          <div v-html="readme"></div>
        </div>
      </div>
      <div class="foot"></div>
    </div>
    <div v-else>
      <div class="flex items-center justify-center h-screen-sm">
        <div class="font-size-2xl  color-gray-400">{{ msg }}</div>
      </div>
    </div>
</template>

<script setup>
const state = reactive({
  err:0,msg:'',params:'',
  profile:{},readme:'',
}),{err,msg,profile,readme} = toRefs(state)
const route = useRoute();
// 获取用户资料
const userInfo = () => {
  let {user} = state.params;
  apiFetch('profile/user',{user:user}).then(result=>{
    state.err = 200;
    state.profile = result;
    loadReadme()
  }).catch(err=>{
    state.err = 404;
    state.msg = '用户未注册';
  });
}
// 获得用户介绍
const loadReadme = ()=>{
  let {uuid} = state.profile;
  fetch(`https://cdn.youloge.com/readme/${uuid}?t=${Date.now()}`).then(r=>{
    if(r.ok){
      return r.text();
    };
    throw new Error();
  }).then(text=>{
    state.readme = text;
  }).catch(err=>{
    console.log(err)
  });
}
// 
const stateSubscribe = storeSubscribe();
const xyz = ()=>{
  stateSubscribe.update('account')
}
onMounted(()=>{
  state.params = route.params;
  userInfo()
});
console.log(route)

</script>

<style>

</style>