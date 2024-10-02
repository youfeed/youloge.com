<template>
  <div :class="cls">
    
    <div class="head flex items-center justify-between h-10" @click="onExpand">
      <div class="text-lg"> {{count}} 条评论</div>
      <div> <div class="i-tdesign:format-horizontal-align-center"></div> </div>
    </div>
    
    <div class="body">
      
      <template v-for="item in data" :key="item.uuid">
        <div class="review flex gap-2  my-4">
          <div class="avatar"><img :src="useImage(item.account.avatar,'80')" class="w-8 h-8 rounded-full"></div>
          <div class="content w-full">
            <div class="user"><span class="named">{{item.account.name}}@({{ item.account.user }})</span><span class="timed">{{useTimeago(item.created)}}</span></div>
            <div class="rich">{{item.content}}</div>
            <div class="feedback flex gap-2 items-center">
              <div>
                <div class="i-tdesign:thumb-up-2"></div> <span>{{ item.liked }}</span>
              </div>
              <div>
                <div class="i-tdesign:chat-bubble-1"></div> <span>{{ item.reply }} </span>
              </div>
              <div>
                回复
              </div>
            </div>
            <div class="replys  my-2" v-if="item.reply > 0">
              
              <template v-for="items in item.data" :key="items.uuid">
                <div class="reply flex gap-2 my-2">
                  <div class="avatar"><img :src="useImage(items.account.avatar,'80')" class="w-8 h-8 rounded-full"></div>
                  <div class="content">
                    <div class="user"><span class="named">{{items.account.name}}@({{ items.account.user }})</span><span class="timed">{{useTimeago(items.created)}}</span></div>
                    <div class="rich">{{items.content}}</div>
                    <div class="feedback flex gap-2 items-center">
                      <div>
                        <div class="i-tdesign:thumb-up-2"></div> <span>{{ items.liked }}</span>
                      </div>
                      <div>
                        <div class="i-tdesign:chat-bubble-1"></div> <span> 回复 </span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              
              <div class="loadreply" @click="onReply(item)" v-if="(item.count || item.reply) - (item?.data?.length || 0) > 0">加载 余下{{(item.count || item.reply) - (item?.data?.length || 0)}} 条回复 </div>
              
            </div>
            
          </div>
        </div>
      </template>
      
      <!-- <div class="load" v-show="next">加载评论 2596 - 259F</div> -->
    </div>
    
    <div class="dianping">
      <div class="" v-if="!profile">
        点击登录
      </div>
      <div class="collapse flex gap-2">
        <div class="avatar"><img :src="useImage(profile?.avatar,'80')" class="w-8 h-8 rounded-full"></div>
        <div class="content b-1 b-gray-200 rounded-lg border-solid w-full relative">
          <form action="" @submit.prevent="onSubmit" @reset.prevent="onReset">
            <div class="textarea">
              <textarea class="w-full h-full p-2 min-h-12 rounded-md" name="content" v-model="modelValue" cols="40" rows="4" placeholder="每个作品仅能发表一个点评 48小时内可编辑"></textarea>
              <!-- <div class="rich w-full h-full p-2 min-h-12 focus:min-h-30" contenteditable ></div> -->
              <div class="counter absolute left-2 bottom-2 text-gray-400 pointer-events-none">0/140</div>
            </div>
            <div class="navbar absolute right-0 bottom-0 flex gap-2 items-center p-2">
              <div class="emoji">
                <!-- <ul class="nav">
                  <li><img src="https://open.youloge.com/sticker/default/default!50"></li>
                  <li><img src="https://open.youloge.com/sticker/default/default!50"></li>
                  <li><img src="https://open.youloge.com/sticker/default/default!50"></li>
                </ul> -->
              </div>
              <div class="button flex gap-2">
                <button type="reset" class="cancel bg-light-blue-200 color-white px-2 py-1 rounded-md b-0 cursor-pointer">取消</button>
                <button type="submit" class="submit bg-blue-800 color-white px-2 py-1 rounded-md b-0 cursor-pointer">评论</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
    </div>
    
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, toRefs } from "vue"
const props = defineProps(['type','mode'])

const state = reactive({
  type:'',
  mode:'',
  cursor:0,
  limit:10,
  err:0,
  msg:'',
  count:0,
  data:[],
  
  mask:false,
  next:'',
  reply:'',
  uuid:'1234567',
  ukey:'TKoLtLJatVyqbbNWQFb_yMdoFzoWx40b9I7JzUYwRORqiHB7MxNdfqpN8hnSsx3hdbThUbauq0M60DNkZQZDrQ==',
  name:'youloge.discuss',
  hash:location.hash,
  referrer:document.referrer,
  review:[],
  sticker:[],
  discuss:{
    chosen: 0,
    verify: 0,
    review: 0,
    uuid: "PLCuUJD4erSUbdLbm5PbYPPLoiig8",
    ukey: "j2vTktHzMQM4aeYx3Y9zbBJRxrgUV",
    owner: "PVD5xhMEisCxpmzFusooSfpAtJvBB",
    updated: "2023-03-20 06:25:52",
    created: "2023-03-20 06:25:52",
  },
  profile:{
    uuid:'',
    name:'',
    avatar:'',
    signer:'',
  }
}),{err,msg,data,count,profile,discuss} = toRefs(state);
// 
// const cls = computed(()=>['discuss',{'mask':state.mask}])
// 开始提取数据
const onInit = ()=>{
  let {mode,uuid} = state;
  apiFetch('discuss/info',{mode:'drive',uuid:1005}).then(r=>r.json()).then(res=>{
    // state.discuss = res.data
    // Object.assign(state,res.data)
    console.log(res)
  });
}
onMounted(()=>{
  state.type = props.type;
  state.mode = props.mode;
  state.profile = useAuth();
  console.log(state.profile)
  //
  onReview(true);
});
// 获取评论 - 分页
const onReview = (isfirst=false)=>{
  let {type,mode,cursor,limit} = state;
  console.log(type,mode,cursor,limit)
  // let {uuid} = state.discuss;
  apiFetch('discuss/review',{type:type,mode:mode,cursor:cursor,limit:limit}).then(r=>r.json()).then(res=>{
    isfirst ? Object.assign(state,res) : state.data.push(...res.data);

    console.log(res)
    // state.review = res.data
  })
}
// 获取回复 - 分页
const onReply = (item,isfirst=false)=>{
  let {err,uuid,cursor,limit} = item;
  console.log(item)
  apiFetch('discuss/reply',{review:uuid,cursor:cursor || false}).then(r=>r.json()).then(res=>{
    err ? item.data.push(...res.data) : Object.assign(item,res);
  })
}
// 发表评论
const onSubmit = ()=>{
  let {content} = state;
  console.log(content)
}
</script>

<style lang="scss">

</style>