<template>
  <!-- IM即时通讯 -->
  <div class="max-w-screen-md mx-auto p-4">
     <div class="cookies">
      <div>cookies</div>
      <div>
        <template v-for="item in cookiesList" :key="item.uuid">
          <div class="flex gap-2 border-b py-2 cursor-pointer" @click="onCookies(item)">
            <div><img :src="useImage(item.slave.avatar,'80')" alt=""></div>
            <div>
              <div>{{ item.name }}#{{ item.uuid }}</div>
              <div>{{ item.session.type }}:{{ item.slave.name }}:{{ item.slave.uuid }}:{{ item.slave.status }}</div>
            </div>
          </div>
        </template>
      </div>
     </div>
     <div class="cookies">
      <div>ChatRoom - {{ message?.item?.name }}</div>
      <div class="room">
        <div class="flex flex-col-reverse gap-2 max-h-md overflow-y-auto p-5" title="消息列表">
          <template v-for="item in messageList" :key="item.uuid">
            <!-- 我发送的 -->
            <template v-if="item.sender == message.item.master">
              <div class="self-end bg-indigo-300 max-w-3/5 p-2 rounded">
                <div>{{ profile.name }}</div>
                <div>{{ item.type }}</div>
                <div>{{ item.payload.content }}</div>
              </div>
            </template>
            <!-- 我接收的 -->
            <template v-if="item.sender == message.item.slave.uuid">
              <div class="self-start bg-gray-600 max-w-3/5 p-1 rounded text-white">
                <div>{{ message.item.slave.name }}</div>
                <div>{{ item.type }} {{ item.uuid }}</div>
                <div>{{ item.payload.content }}</div>
              </div>
            </template>
            <!-- <template v-if="message.master == item.sender"></template> -->
          </template>
        </div>
        <div class="" title="输入框"></div>
      </div>
     </div>
  </div>
</template>

<script setup>
const props = defineProps(['params']),emit = defineEmits(['jump']);
const state = reactive({
  err:0,msg:'',data:{},profile:{},
  cookies:{},cookiesList:[],
  message:{},messageList:[]
}),{err,msg,data,list,profile,cookies,cookiesList,message,messageList} = toRefs(state);
// 会话列表
const getCokies = ()=>{
  let {next_cursor} = state.cookies;
  apiFetch('chat/cookies',{cursor:next_cursor},true).then(res=>{
    Object.assign(state,res);state.cookiesList.push(...res.data.data);
    console.log(res)
  })
}
// 会话消息
const getMessage = ()=>{
  let {next_cursor,item} = state.message;
  apiFetch('chat/message',{session:item.session.uuid,cursor:next_cursor},true).then(res=>{
    Object.assign(state,res);state.messageList.push(...res.data.data);
    console.log(20,state.messageList)
  })
}

// 点击会话
const onCookies = (item)=>{
  state.message.item = item;
  state.messageList = []
  console.log(10,state.message)
  getMessage();
}
onMounted(()=>{
    state.profile = useAuth();
    getCokies();
})
// 路由跳转(动态组件内部跳转)
const navigateTo = (path,params='')=>{
    emit('jump',path,params);
}
</script>

<style>

</style>