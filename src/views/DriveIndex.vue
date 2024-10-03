<template>
  <div class="feeds">
    <div v-if="err==0">
      <div class="flex items-center justify-center h-screen-sm">
        <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
      </div>
    </div>
    <div v-else-if="err == 200">
      <div class="grid">
        <template v-for="item in data" :key="item.uuid">
          <div class="mx-auto mt-6 max-w-2xl border-solid border-1 rounded border-gray-300 p-2">
            <div class="head flex items-center justify-start h-8 gap-2">
              <div>
                <div class="w-8 h-8"><div><img src="https://img.youloge.com/FrAPCSKUnNee1lhTMUnkWOgULZZ4!80" alt="" class="w-full h-full rounded-full"></div></div>
              </div>
              <div>
                name @user 
              </div>
            </div>
            <div class="body my-2">
              <div class="title">titletitletitletitle</div>
              <div class="description">descriptiondescriptiondescriptiondescription</div>
              <div class="description">descriptiondescriptiondescriptiondescription</div>
            </div>
            <div class="foot flex items-center h-8 gap-2">
              <div><router-link to="drive/search?label=100&q=">label1</router-link></div>
              <div>label1</div>
              <div>label1</div>
              <div>label1</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-else>
      <div class="flex items-center justify-center h-screen-sm">
        <div class="font-size-2xl  w-40 h-40 color-gray-400">{{ msg }}</div>
      </div>
    </div>
  </div>
  <div class="aside">
    <div>统计信息</div>
  </div>
</template>

<script setup>
import { reactive, toRefs,onMounted } from "vue"

const state = reactive({
  err:0,
  msg:'',
  count:0,
  data:{},
}),{err,msg,data} = toRefs(state);
//
const onSearch = ()=>{
  apiFetch('search/drive',{}).then(r=>r.json()).then(res=>Object.assign(state,res)).catch((err)=>{ 
    console.log('err',state,err)

  })
  // console.log('err',state)
}
onMounted(()=>{

  onSearch();
})
</script>

<style>

</style>