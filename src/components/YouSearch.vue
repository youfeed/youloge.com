<template>
  <div>
    <y-header aria="搜索" aside="true"></y-header>
    <main class="search">
      <article>
        <section></section>
      </article>
      <div class="container">描述：这是一个用于展示组件内部的变量652动态分配的示例</div>
    </main>
    <y-footer></y-footer>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from "vue";

const state = reactive({
  uuid:''
});
onMounted(()=>{
  let q = new URL(location.href).searchParams.get('q')

})
const {uuid} = toRefs(state)
</script>

<style style lang="scss">

</style>