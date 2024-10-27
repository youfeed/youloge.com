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
      README
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['params']),emit = defineEmits(['jump']);
const state = reactive({
  profile:{}
}),{profile} = toRefs(state);

//
onMounted(()=>{
  state.profile = useAuth();
  const profile = useAuth();
    console.log('profile',profile)
});
// 路由跳转(动态组件内部跳转)
const navigateTo = (path,params='')=>{
    emit('jump',path,params);
}
</script>

<style>

</style>