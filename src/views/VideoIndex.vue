<template>
  <div id="container" class="m-2 sm:m-4 md:m-8">
    <div class="feed columns-xs columns-1 sm:columns-2 md:columns-3 xl:columns-4 2xl:columns-6 gap-4" cc="grid ">
      <template v-for="item in data" :key="item.uuid">
        <div class="align-top">
          <div class="inline-block">
            <router-link :to="{path:`/video/${item.uuid}`}" class="no-underline">
              <div class="relative">
                <img :src="item.poster" class="aspect-video w-full" alt="">
                <div class="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                  <div class=" text-white rounded bg-black/20 flex justify-between items-center gap-1">
                    <i class="i-tdesign-browse"></i>{{ useViews(item.views,'') }}
                  </div>
                  <div class=" text-white rounded bg-black/20 flex justify-between items-center gap-1">
                    <i class="i-tdesign:time text-sm" /> {{ useDuration(item.duration) }}
                  </div>
                </div>
              </div>
              
              <div class="flex">
                <div class="size-10">
                  <router-link :to="{path:`/${item.account.user}`}" class="no-underline size-10">
                    <img :src="useImage(item.account.avatar,80)" class="w-full" alt="">
                  </router-link>
                </div>
                <div class="pl-2 w-full">
                  <router-link :to="{path:`/${item.account.user}`}" class="no-underline">
                    <div class="flex items-center justify-between">
                      <div class="text-slate-800">{{ item.account.name }}@{{ item.account.user }}</div>
                      <div class="text-slate-700">{{ useTimeago(item.created) }}</div>
                    </div>
                  </router-link>
                  <div class="text-slate-900 no-underline text-base">
                    {{ item.title }} 
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </template>
    </div>
    
    <!-- <div class="minor">Home</div> -->
  </div>
  <div id="loading"></div>
</template>
<script setup>
const state = reactive({
  limit:20,
  offset:0,
  count:0,
  data:[
    {
      uuid:1000,
      title:'海天佛国普陀山海天佛国普陀山海天佛国普陀山海天佛国普陀山(下集 )',
      description:'description',
      views:'100000566',
      poster:'https://p3-sign.bdxiguaimg.com/tos-cn-i-pk90l89vgd/f63b40d36c5f4a9587e2477b5f967101~tplv-pk90l89vgd-crop-center:864:486.avif?appId=1768&channelId=94349543909&customType=custom%2Flarge&imageType=video1609&is_stream=1&lk3s=9d3f5bff&logId=20240923224134CAE22B16996288F6B0FE&requestFrom=103&x-expires=1758638495&x-signature=Vyy5%2B%2B7rqY21pvu0aQeEmqR3BoQ%3D',
      created:'2023-12-12 12:12:12',
      updated:'2024-12-12 12:12:12',
      duration:'520',
      label:[],
      account:{
        uuid:1055500,
        user:'youloge',
        name:'张小路',
        mail:'1000@youloge.com',
        avatar:'FrAPCSKUnNee1lhTMUnkWOgULZZ4'
      }
    },{
      uuid:1000,
      title:'海天佛国普陀山(下集 )',
      description:'description',
      views:'100000566',
      poster:'https://p3-sign.bdxiguaimg.com/tos-cn-i-pk90l89vgd/f63b40d36c5f4a9587e2477b5f967101~tplv-pk90l89vgd-crop-center:864:486.avif?appId=1768&channelId=94349543909&customType=custom%2Flarge&imageType=video1609&is_stream=1&lk3s=9d3f5bff&logId=20240923224134CAE22B16996288F6B0FE&requestFrom=103&x-expires=1758638495&x-signature=Vyy5%2B%2B7rqY21pvu0aQeEmqR3BoQ%3D',
      created:'2023-12-12 12:12:12',
      updated:'2024-12-12 12:12:12',
      duration:'520',
      label:[],
      account:{
        uuid:1055500,
        user:'youloge',
        name:'张小路',
        mail:'1000@youloge.com',
        avatar:'FrAPCSKUnNee1lhTMUnkWOgULZZ4'
      }
    },{
      uuid:1000,
      title:'海天佛国普陀山(下集 海天佛国普陀山)',
      description:'description',
      views:'100000566',
      poster:'https://p3-sign.bdxiguaimg.com/tos-cn-i-pk90l89vgd/f63b40d36c5f4a9587e2477b5f967101~tplv-pk90l89vgd-crop-center:864:486.avif?appId=1768&channelId=94349543909&customType=custom%2Flarge&imageType=video1609&is_stream=1&lk3s=9d3f5bff&logId=20240923224134CAE22B16996288F6B0FE&requestFrom=103&x-expires=1758638495&x-signature=Vyy5%2B%2B7rqY21pvu0aQeEmqR3BoQ%3D',
      created:'2023-12-12 12:12:12',
      updated:'2024-12-12 12:12:12',
      duration:'520',
      label:[],
      account:{
        uuid:1055500,
        user:'youloge',
        name:'张小路',
        mail:'1000@youloge.com',
        avatar:'FrAPCSKUnNee1lhTMUnkWOgULZZ4'
      }
    }
  ]
}),{data} = toRefs(state);
// const imgCDN 
const calc = computed(()=>{
  
})
const getSearch = ()=>{
  const {limit,offset} = state;
  apiFetch('search/video',{limit,offset}).then(res=>{
    console.log(res)
  })
}
const io = new IntersectionObserver((entries, observer) => {
  // 如果 intersectionRatio 为 0，则目标在视野外，
  // 我们不需要做任何事情。
  if (entries[0].intersectionRatio <= 0) return;
  getSearch()

  console.log("Loaded new items",entries,observer);
},{ rootMargin: '0px', threshold: 1.0});
//
onMounted(()=>{
  console.log('r')
  io.observe(document.querySelector("#loading"));
})
</script>

<style>

</style>