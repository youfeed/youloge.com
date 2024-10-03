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
            <div class="w-20 h-20 bg-cover bg-center rounded-full" >
              <img :src="useImage(data.avatar,'150')" alt="" class="w-full h-full rounded-sm">
            </div>
            <div class="">
              <div class="text-lg font-bold ">{{ data.name }} · @{{ data.user }}</div>
              <div class="mt-4">{{ data.uuid }} · {{ data.mail }} · {{ data.created }}</div>
            </div>
          </div>
          <div class="ml-2">
            <div class="font-size-sm color-gray-400" title="对方不知道你的关注，但你可以获取他的最新动态">单项订阅</div>
          </div>
        </div>
      </div>
      <div class="body"></div>
      <div class="foot"></div>
    </div>
    <div v-else>
      <div class="flex items-center justify-center h-screen-sm">
        <div class="font-size-2xl  color-gray-400">{{ msg }}</div>
      </div>
    </div>
</template>

<script setup>
import { onMounted, toRefs } from "vue";
const state = reactive({
  err:0,
  msg:'',
  data:{},
  user:'',
  profile:{}
}),{user,err,msg,data} = toRefs(state)
const route = useRoute();
// 获取用户资料
const userInfo = () => {
  let {user} = state;
 apiFetch('profile/user',{user:user}).then(r=>r.json()).then(res=>Object.assign(state,res))
}
onMounted(()=>{
  state.user = route.params.user;
  userInfo()
})
console.log(route)

</script>

<style>

</style>