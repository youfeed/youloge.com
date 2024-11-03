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
            <div class="w-10 h-10 sm:w-15 sm:h-15 bg-cover bg-center rounded-full" >
              <img :src="useImage(data.avatar,'80')" alt="" class="max-w-full rounded-sm">
            </div>
            <div class="">
              <div class="font-bold ">{{ data.name }} · @{{ data.user }}</div>
              <div class="mt-1"><span class="hidden sm:inline">{{ data.uuid }} · </span>{{ data.mail }}<span class="hidden sm:inline"> · {{ data.created }}</span></div>
            </div>
          </div>
          <div class="ml-2">
            <div class="font-size-sm color-gray-400" title="对方不知道你的关注，但你可以获取他的最新动态">
              <div class="i-tdesign:usergroup-add w-6 h-6"></div>添加好友
            </div>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="mt-5 max-w-3xl mx-auto">
          <div v-html="html"></div>
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
  err:0,msg:'',data:{},
  html:'2333',params:'',profile:{},viewlist:[
    {src:'https://www.wetools.com/imgplaceholder/800x800?text=0'},
    {src:'https://www.wetools.com/imgplaceholder/800x800?text=1'},
    {src:'https://www.wetools.com/imgplaceholder/800x800?text=2'},
    {src:'https://www.wetools.com/imgplaceholder/800x800?text=3'},
    {src:'https://www.wetools.com/imgplaceholder/800x800?text=4'},
  ]
}),{err,msg,data,html,params,viewlist} = toRefs(state)
const route = useRoute();
// 获取用户资料
const userInfo = () => {
  let {user} = state.params;
  apiFetch('account/info',{user:user}).then(res=>{
    Object.assign(state,res);
    res.data.uuid && getReadme()
  })
}
// 
const onSave = ()=>{
  console.log(999,state.html)

}
// 获得用户介绍
const getReadme = ()=>{
  let {uuid} = state.data;
  fetch(`https://cdn.youloge.com/readme/${uuid}?t=${new Date().getTime()}`).then(r=>{
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
onMounted(()=>{
  state.params = route.params;
  userInfo()
})
console.log(route)

</script>

<style>

</style>