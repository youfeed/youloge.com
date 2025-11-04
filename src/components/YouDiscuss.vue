<template>
  <template v-if="err == 0">
    <div class="flex items-center justify-center h-screen-sm">
      <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
    </div>
  </template>
  <template v-if="err == 200">
    <div class="disscuss flex flex-col gap-2 overflow-y-auto">

      <div class="head flex items-center justify-between h-10" @click="onExpand">
        <div class="text-lg"> {{info.total}} 条点评</div>
        <div class="flex items-center gap-2 uppercase cursor-pointer" @click="loadReviews(true)"> 
          <span class="i-tdesign:format-horizontal-align-center"></span>
          <span>{{props.mode}}/{{props.code}}</span>
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
            <template v-for="item in reviews.data" :key="item.uuid">
              <div class="review flex gap-2  my-4">
                <div class="avatar"><img :src="useImage(item.account.avatar,'80')" class="w-8 h-8 rounded-full"></div>
                <div class="content w-full">
                  <div class="user flex items-center justify-between">
                    <span class="named">{{item.account.name}}@{{ item.account.user }}</span>
                    <span class="timed">{{useTimeago(item.created)}} - {{useTimeago(item.updated)}}</span>
                  </div>
                  <div class="rich whitespace-pre-wrap">
                    <template v-for="(block,index) in item.content" :key="index">
                        <span v-if="block.type == 'text'">{{block.text}}</span>
                    </template>
                  </div>
                  <div class="feedback flex gap-2 items-center">
                    <div class="cursor-pointer flex gap-2 items-center">
                      <div class="i-tdesign:thumb-up-2"></div> <span>{{ item.liked }}</span>
                    </div>
                    <div class="cursor-pointer flex gap-2 items-center">
                      <div class="i-tdesign:chat-bubble-1"></div> <span>{{ item.reply }} </span>
                    </div>
                    <div class="cursor-pointer flex gap-2 items-center" @click="onReply(item)">
                      回复
                    </div>
                  </div>
                  <div class="replys  my-2" v-if="item.reply_count > 0">
                    <template v-for="items in item.replys" :key="items.uuid">
                      <div class="reply flex gap-2 my-2">
                        <div class="avatar"><img :src="useImage(items.account.avatar,'80')" class="w-8 h-8 rounded-full"></div>
                        <div class="content w-full">
                          <div class="user flex items-center justify-between">
                            <span class="named">{{items.account.name}} 回复 {{items.quote.name}}</span>
                            <span class="timed">{{useTimeago(items.created)}} - {{useTimeago(items.updated)}}</span>
                          </div>
                          <div class="rich">
                            <template v-for="(block,index) in items.content" :key="index">
                              <span v-if="block.type == 'text'">{{block.text}}</span>
                            </template>
                          </div>
                          <div class="feedback flex gap-2 items-center">
                            <div>
                              <div class="i-tdesign:thumb-up-2"></div> <span>{{ items.liked }}</span>
                            </div>
                            <div>
                              <div class="i-tdesign:chat-bubble-1"></div> 
                            </div>
                            <div @click="onReply(items)">
                              <span> 回复 </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    
                    <div class="loadreply cursor-pointer" @click="loadReply(item)" v-if="item.reply_count - (item.replys.length || 0) > 0">加载 余下{{item.reply_count - (item.replys.length || 0)}} 条回复 </div>
                    
                  </div>
                </div>
              </div>
            </template>
            <!-- 评论数据 -->
            <template v-if="reviews.data.length == 0">
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
          <div class="avatar">
            <img :src="useImage(stateProfile.avatar,'80')" class="w-8 h-8 rounded-full">
          </div>
          <div class="content b-1 b-gray-200 w-full relative">
            <div class="flex gap-2 items-center justify-between my-1">
              <div class="max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                <span>
                  {{ stateProfile.name }} 
                </span>
              </div>
              <div class="">
                <span class="color-blue-500" v-if="!comment">发表点评</span>
                <span class="color-blue-500" v-else-if="stateProfile.uuid == comment.account?.uuid">编辑点评</span>
                <span class="color-blue-500" v-else>回复评论</span>
              </div>
            </div>
            <form action="" @submit.prevent="onSubmit" @reset.prevent="onReset">
              <div class="textarea">
                <textarea class="w-full h-full p-2 min-h-12 rounded-md " name="content" v-model="content" rows="4" placeholder="每个作品仅能发表一个点评 48小时内可编辑" required></textarea>
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
        <div class="w-full h-full absolute flex items-center justify-center top-0 backdrop-blur-sm border border-gray-500 rounded-lg" v-if="!stateProfile.uuid">
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
const stateProfile = storeProfile();
const props = defineProps(['mode','code']);
const state = reactive({
  // 元数据
  info:{
    total:0,
  },
  err:200,msg:'',data:{},
  cursor:0,
  limit:10,
  // 评论数据
  reviews:{
    err:200,msg:'',
    data:[],
    cursor:{
      next_cursor:''
    }
  },
  mask:false,
  
  parmas:{
    content:''
  },
  content:'',
  sticker:[],
  // 评论数据
  discuss:{
    cursor: {

    },
    data:[],
  },
  // 评论内容
  comment:null,
  method:'review',
  parmas:{
    content:[],
  }
}),{err,msg,data,mode,code,info,profile,reviews,comment,content} = toRefs(state);
// 加载评论元数据
const loadInfo = ()=>{
  let {mode,code} = props;
  apiFetch('discuss/info',{mode:mode,code:code}).then(result=>{
    state.info = result;
    result.total && loadReviews();
    console.log(result)
    loadReviews();
    loadMine();
  });
}
// 加载点评
const loadMine = ()=>{
  let {mode,code} = props;
  apiFetch('discuss/mine',{mode:mode,code:code}).then(result=>{
    result.account = stateProfile;
    state.comment = result
    onReview()
  }).catch(err=>{
    console.log(err.message)
  });
}
// 获取评论 - 分页 
const loadReviews = (isfirst=false)=>{
  isfirst && (state.reviews.data = [],state.reviews.cursor.next_cursor = '');
  let {mode,code} = props;
  let {next_cursor} = state.reviews.cursor
  apiFetch('discuss/review',{
    mode:mode,code:code,
    cursor:next_cursor,limit:10
  }).then(({data,...cursor})=>{
    state.reviews.cursor = cursor;
    data.forEach(is=>{
      let Findex = state.reviews.data.findIndex(it=>it.uuid == is.uuid);
      is.cursor = {};is.replys = []; // 回复预设
      Findex == -1 && state.reviews.data.push(is);
    });
  }).catch(err=>{
    useMessage().error(err.message)
  });
}
// 获取回复 - 分页
const loadReply = (item)=>{
  let {uuid,cursor} = item;
  console.log(item)
  apiFetch('discuss/reply',{review:uuid,cursor:cursor?.next_cursor}).then(({data,...cursor})=>{
    item.cursor = cursor;
    data.forEach(is=>{
      let Findex = item.replys.findIndex(it=>it.uuid == is.uuid);
      Findex == -1 && item.replys.push(is);
    })
  })
}
/**
 * 发表评论
 * atReview: type mode content signatrue 
 * atReply: review:uuid content signature
 */
const onReview = ()=>{
  let {mode,code} = props;
  state.method ='review';
  state.params = {
    mode:mode,
    code:code,
  };
  state.content = '';
}
const onReply = (item)=>{
  state.method ='reply';
  state.params = {
    review:item.uuid,
    quote:item.account.uuid,
  };
  state.comment = item;
  state.content = '';
  console.log(item)
}


// 发表评论 mode atReview atReply
const onSubmit = ()=>{
  let {method,params,content} = state;
  let contents = [
    {
      type:'text',
      text:content
    }
  ]
  const form = {...params,...{type:method,content:contents}}
  console.log(666666666666666666666,form)
  // 发布评论
  apiFetch(`discuss/create`,form).then(result=>{
    let find = state.reviews.data.find(is=>is.uuid == result.uuid);
    find ? find = result : loadReply(state.comment,true);
  });
}
// 登录
const onLogin = ()=>{

}

onMounted(()=>{
  console.log(999,stateProfile)
  loadInfo();
});

</script>

<style lang="scss">

</style>