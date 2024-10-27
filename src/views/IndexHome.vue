<template>
  <div class="layout flex flex-col min-h-screen">
    <header class="fixed w-full px-2">
      <div class="h-10 flex flex-row justify-between items-center">
        <div class="flex items-center">
          <div class="w-5 h-5">
            <img class="mx-auto w-full w-auto block select-none" src="/loge.svg" alt="">
          </div>
          Youloge
        </div>
        <div  @click="onLogin"> 登录</div>
      </div>
    </header>
    <main class="max-w-screen-md mx-auto mt-40 ">
      <div class="mt-10">
        <h1 class="color-blue font-size-36px mt-10" v-ripple>杰克布达</h1>
        <p class="font-size-24px font-bold text-gray-800 mt-10">但行好事 莫问前程</p>
        <p class="font-size-18px font-bold text-gray-500 mt-2">开源、快速、零权限、零成本 接口服务平台</p>
      </div>
    </main>
    <footer class="fixed bottom-0 border-0 border-solid border-t-1 border-gray-300 w-full">
      <div class="mt-2 text-center text-gray-500">
        <a href="https://beian.miit.gov.cn/" class="text-gray no-underline">
          <p>ICP备案/许可证号：皖ICP备19004549号</p>
        </a>
        <p>皖公安备 34112402000344</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { success, warning, error, info } = useMessage();
// const {show} = useLoading()
// warning('操作成功！');

// useLoading().show()

const onLogin = () => {
  usePlus('login').then(res=>{

  }).catch(err=>{
    warning(err.msg)
  })

  success('操作成功！');
};
</script>

<style>

</style>