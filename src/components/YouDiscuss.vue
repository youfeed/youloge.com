<template>
  <template v-if="err == 0">
    <div class="flex items-center justify-center h-screen-sm">
      <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
    </div>
  </template>
  <template v-if="err == 200">
    <div class="disscuss flex flex-col gap-2 overflow-y-auto">

      <div class="head flex items-center justify-between h-10" @click="onExpand">
        <div class="text-lg"> {{data.total}} 条点评</div>
        <div class="flex items-center gap-2 uppercase"> 
          <span class="i-tdesign:format-horizontal-align-center"></span>
          <span>{{mode}}/{{code}}</span>
        </div>
      </div>
      
      <!-- 加载数据 -->
      <div class="reviews max-h-xs overflow-y-auto">
        <template v-if="reviews.err == 0">
          <div class="flex items-center justify-center h-screen-sm">
            <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
          </div>
        </template>
        <template v-if="reviews.err == 200">

            <!-- 评论数据 -->
            <template v-for="item in reviews.data?.data" :key="item.uuid">
              <div class="review flex gap-2  my-4">
                <div class="avatar"><img :src="useImage(item.account.avatar,'80')" class="w-8 h-8 rounded-full"></div>
                <div class="content w-full">
                  <div class="user flex items-center justify-between">
                    <span class="named">{{item.account.name}}@{{ item.account.user }}</span>
                    <span class="timed">{{useTimeago(item.created)}} - {{useTimeago(item.updated)}}</span>
                  </div>
                  
                  <div class="rich whitespace-pre-wrap" v-html="item.content"></div>
                  <div class="feedback flex gap-2 items-center">
                    <div class="cursor-pointer flex gap-2 items-center">
                      <div class="i-tdesign:thumb-up-2"></div> <span>{{ item.liked }}</span>
                    </div>
                    <div class="cursor-pointer flex gap-2 items-center">
                      <div class="i-tdesign:chat-bubble-1"></div> <span>{{ item.reply }} </span>
                    </div>
                    <div class="cursor-pointer flex gap-2 items-center" @click="atReply(item)">
                      回复
                    </div>
                  </div>
                  <div class="replys  my-2" v-if="item.reply > 0">
                    
                    <template v-for="items in item.data?.data" :key="items.uuid">
                      <div class="reply flex gap-2 my-2">
                        <div class="avatar"><img :src="useImage(items.account.avatar,'80')" class="w-8 h-8 rounded-full"></div>
                        <div class="content w-full">
                          <div class="user flex items-center justify-between">
                            <span class="named">{{items.account.name}}@({{ items.account.user }})回复{{items.quote.name}}@({{ items.quote.user }})</span>
                            <span class="timed">{{useTimeago(items.created)}} - {{useTimeago(items.updated)}}</span>
                          </div>
                          <div class="rich">{{items.content}}</div>
                          <div class="feedback flex gap-2 items-center">
                            <div>
                              <div class="i-tdesign:thumb-up-2"></div> <span>{{ items.liked }}</span>
                            </div>
                            <div>
                              <div class="i-tdesign:chat-bubble-1"></div> 
                            </div>
                            <div @click="atQuote(items)">
                              <span> 回复 </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    
                    <div class="loadreply" @click="loadReply(item)" v-if="item.reply - (item.data?.data.length || 0) > 0">加载 余下{{(item.count || item.reply) - (item?.data?.length || 0)}} 条回复 </div>
                    
                  </div>
                </div>
              </div>
            </template>
            <!-- 评论数据 -->
            <template v-if="reviews.data.data.length == 0">
              <div class="flex items-center justify-center">
                <div class="font-size-2xl color-gray-400">暂无评论</div>
              </div>
            </template>

        </template>
        <template v-else>
          <div class="flex items-center justify-center h-screen-sm">
            <div class="font-size-2xl  w-40 h-40 color-gray-400">{{reviews.msg}}</div>
          </div>
        </template>
      </div>
      <!-- 加载数据 -->

      <div class="dianping relative">
        <div class="collapse flex gap-2">
          <div class="avatar"><img :src="useImage(profile?.avatar,'80')" class="w-8 h-8 rounded-full"></div>
          <div class="content b-1 b-gray-200 w-full relative">
            <div class="flex gap-2 items-center justify-between my-1">
              <div class="max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                <span>
                  {{ toggled.account?.name || profile.name }}@{{ toggled.account?.user || profile.user }}:{{ toggled.content }}
                </span>
              </div>
              <div class="">
                <span class="color-blue-500" v-if="!toggled.account">发表点评</span>
                <span class="color-blue-500" v-else-if="profile.uuid == toggled.account?.uuid">编辑点评</span>
                <span class="color-blue-500" v-else>回复点评</span>
              </div>
            </div>
            <form action="" @submit.prevent="onSubmit" @reset.prevent="onReset">
              <div class="textarea">
                <textarea class="w-full h-full p-2 min-h-12 rounded-md " name="content" v-model="content" rows="4" placeholder="每个作品仅能发表一个点评 48小时内可编辑"></textarea>
                <!-- <div class="rich w-full h-full p-2 min-h-12 focus:min-h-30" contenteditable ></div> -->
                <div class="counter absolute left-2 bottom-2 text-gray-400 pointer-events-none">点评 编辑 回复</div>
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
        <div class="w-full h-full absolute flex items-center justify-center top-0 backdrop-blur-sm border border-gray-500 rounded-lg" v-if="logged == false">
          <div @click="onLogin" class="w-40 h-10 bg-blue-500 color-white rounded-lg flex items-center justify-center cursor-pointer">点击登录</div>
        </div>
      </div>


    </div>
  </template>
  <template v-else>
    <div class="flex items-center justify-center h-screen-sm">
      <div class="font-size-2xl color-gray-400">{{ msg }}</div>
    </div>
  </template>
</template>
<script setup>
// import { computed, onMounted, reactive, toRefs } from "vue"
// import useAuth from "../composables/useAuth";
const props = defineProps(['mode','code'])

const state = reactive({
  mode:'',code:'',logged:false,
  err:0,msg:'',data:{},
  cursor:0,
  limit:10,
  // 评论数据
  reviews:{
    err:0,msg:'',cursor:0,limit:10,data:[]
  },
  mask:false,
  next:'',
  reply:'',
  method:'review',
  content:'',
  toggled:{},
  
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
}),{err,msg,data,mode,code,logged,profile,reviews,toggled,content} = toRefs(state);
// 开始提取数据
const loadInfo = ()=>{
  let {mode,code,logged} = state;
  console.log(mode,code)
  apiFetch('discuss/info',{mode:mode,code:code},logged).then(res=>{
    Object.assign(state,res);loadReview(true);
    res.data.mime && (state.toggled = res.data.mime);

    console.log(res)
  });
}
onMounted(()=>{
  const {signature} = useAuth();
  state.mode = props.mode;
  state.code = props.code;
  state.logged = Boolean(signature);
  state.profile = useAuth();
  console.log(999,state.logged,props)
  loadInfo();
  // loadReview(true);
});
// 获取评论 - 分页 
const loadReview = (isfirst=false)=>{
  let {mode,code,reviews} = state;
  let {cursor,limit} = reviews;
  apiFetch('discuss/review',{mode:mode,code:code,cursor:cursor,limit:limit}).then(res=>{
    isfirst ? Object.assign(state.reviews,res) : state.reviews.data.push(...res.data);
    console.log(state.reviews)
  });
}
// 获取回复 - 分页
const loadReply = (item)=>{
  let {err,uuid,cursor,data} = item;
  apiFetch('discuss/reply',{review:uuid,cursor:cursor || false}).then(res=>{
    data ? item.data.push(...res.data) : Object.assign(item,res);
    console.log('item',item)
    // res.err ? item.replys.push(...res.data) : Object.assign(item.replys,res.data);
  })
}
/**
 * 发表评论
 * atReview: type mode content signatrue 
 * atReply: review:uuid content signature
 * atQuote: review:uuid quote content signature
 */
const atReview = (item)=>{
  state.method ='review';
  state.toggled = item;
  console.log(item)
}
const atReply = (item)=>{
  state.method ='reply';
  state.toggled = item;
  state.content = '';
  console.log(item)
}
const atQuote = (item)=>{
  state.method ='quote';
  state.toggled = item;
  state.content = '';
  console.log(item)
}

// 发表评论 mode atReview atReply atQuote
const onSubmit = ()=>{
  let {mode,code,content,method} = state;
  let {uuid,account} = state.toggled;
  let body = {};
  if(method == 'review'){
    body = {mode:mode,code:code,content}
  }
  if(method == 'reply'){
    body = {review:uuid,quote:account.uuid,content}
  }
  if(method == 'quote'){
    body = {review:uuid,quote:account.uuid,content}
  }
  apiFetch(`discuss/to${method}`,body,true).then(res=>{
    console.log(res)
    // err ? item.data.push(...res.data) : Object.assign(item,res);
  });
}
// 登录
const onLogin = ()=>{
  usePlus('login').then(profile=>{
    useStorage('profile',profile);
    state.profile = profile;state.logged = true;
    console.log(99999,profile)
  });
}

</script>

<style lang="scss">

</style>