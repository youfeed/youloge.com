<template>
  <div class="yousearch ">
    <form :action="`/${model.selectd}/search`" class="flex">
      <div class="left">
        <select name="source" v-model="model.selectd">
          <template v-for="item in model.options" :key="item.value">
            <option :value="item.value">{{ item.label }}</option>
          </template>
        </select>
      </div>
      <div>
        <input name="q" v-model="model.keyword" :placeholder="model.placeholder"/>
      </div>
      <div class="">
        <button >搜素</button>
      </div>
    </form>
  </div>
</template>

<script setup>

</script>

<style style lang="scss">

</style>