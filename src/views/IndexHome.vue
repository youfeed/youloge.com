<template>
  <div class="layout flex flex-col min-h-screen">
    <header class="fixed w-full px-2">
      <div class="h-10 flex flex-row justify-between items-center">
        <div class="flex items-center">
          <div class="w-5 h-5">
            <img class="mx-auto w-full w-auto block select-none" src="/loge.svg" alt="">
          </div>
          Youloge.COM
        </div>
        <div  @click="showSuccess"> 文档</div>
      </div>
    </header>
    <main class="mt-20 grid grid-cols-1 p-4 min-h-150 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:p-8 md:p-20 lg:p-30">
      <div class="col-span-full"  v-copy="5000000" >
        <h1 class="color-blue font-size-36px" v-ripple>杰克布达</h1>
        <p class="font-size-24px font-bold text-gray-800">快速、零权限、零成本</p>
        <p class="font-size-18px font-bold text-gray-500">开源开放接口服务平台.</p>
      </div>
    </main>
    <footer class="border-0 border-solid border-t-1 border-gray-300 w-full">
      <div class="mt-10 text-center text-gray-500">
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

const showSuccess = () => {
  success('操作成功！');
  warning('warningwarning')
};
</script>

<style>

</style>