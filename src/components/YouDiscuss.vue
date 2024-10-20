<template>
  <div :class="cls">
    
    <div class="head flex items-center justify-between h-10" @click="onExpand">
      <div class="text-lg"> {{count}} 条点评</div>
      <div> <div class="i-tdesign:format-horizontal-align-center"></div> </div>
    </div>
    
    <div class="body max-h-screen-sm overflow-y-auto">
      
      <template v-for="item in data" :key="item.uuid">
        <div class="review flex gap-2  my-4">
          <div class="avatar"><img :src="useImage(item.account.avatar,'80')" class="w-8 h-8 rounded-full"></div>
          <div class="content w-full">
            <div class="user">
              <span class="named">{{item.account.name}}@({{ item.account.user }})</span>
              <span class="timed">{{useTimeago(item.created)}} - {{useTimeago(item.updated)}}</span>
            </div>
            <div class="rich">{{item.content}}</div>
            <div class="feedback flex gap-2 items-center">
              <div>
                <div class="i-tdesign:thumb-up-2"></div> <span>{{ item.liked }}</span>
              </div>
              <div>
                <div class="i-tdesign:chat-bubble-1"></div> <span>{{ item.reply }} </span>
              </div>
              <div @click="atReview(item)">
                回复
              </div>
            </div>
            <div class="replys  my-2" v-if="item.reply > 0">
              
              <template v-for="items in item.data" :key="items.uuid">
                <div class="reply flex gap-2 my-2">
                  <div class="avatar"><img :src="useImage(items.account.avatar,'80')" class="w-8 h-8 rounded-full"></div>
                  <div class="content">
                    <div class="user">
                      <span class="named">{{items.account.name}}@({{ items.account.user }})</span>
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
              
              <div class="loadreply" @click="loadReply(item)" v-if="(item.count || item.reply) - (item?.data?.length || 0) > 0">加载 余下{{(item.count || item.reply) - (item?.data?.length || 0)}} 条回复 </div>
              
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
        <div class="content b-1 b-gray-200 w-full relative">
          <div class="">
            <div v-if="method=='dianping'">发表点评：每个作品仅能发表一个点评 48小时内可编辑</div>
            <div v-if="method=='edit'">编辑点评：每个作品仅能发表一个点评 48小时内可编辑</div>
            <div v-if="method=='review'">回复<span class="color-blue-500">@{{toggled.account.user}}</span>：<span class="">{{toggled.content}}</span></div>
            <div v-if="method=='quote'">引用<span class="color-blue-500">@{{toggled.account.user}}</span>：<span>{{toggled.content}}</span></div>
          </div>
          <form action="" @submit.prevent="onSubmit" @reset.prevent="onReset">
            <div class="textarea">
              <textarea class="w-full h-full p-2 min-h-12 rounded-md " name="content" v-model="content" cols="40" rows="4" placeholder="每个作品仅能发表一个点评 48小时内可编辑"></textarea>
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
  content:'',
  method:'dianping',
  toggled:{},
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
}),{err,msg,data,count,profile,content,method,toggled} = toRefs(state);
// 
// const cls = computed(()=>['discuss',{'mask':state.mask}])
// 开始提取数据
const loadInit = ()=>{
  let {type,mode} = state;
  let {signature} = useAuth();
  console.log(type,mode,100,signature)

  if(signature){
    apiFetch('discuss/info',{type:type,mode:mode,signature:signature}).then(({err,msg,data})=>{
      if(err == 200){
        state.method = 'edit'
        state.content = data.content
      }else{
        state.method = 'dianping'
      }
    });
  };
}
onMounted(()=>{
  state.type = props.type;
  state.mode = props.mode;
  state.profile = useAuth();
  console.log(state.profile,useAuth())
  //
  loadInit();
  loadReview(true);
});
// 获取评论 - 分页 
const loadReview = (isfirst=false)=>{
  let {type,mode,cursor,limit} = state;
  apiFetch('discuss/review',{type:type,mode:mode,cursor:cursor,limit:limit}).then(res=>{
    isfirst ? Object.assign(state,res) : state.data.push(...res.data);
  })
}
// 获取回复 - 分页
const loadReply = (item,isfirst=false)=>{
  let {err,uuid,cursor,limit} = item;
  apiFetch('discuss/reply',{review:uuid,cursor:cursor || false}).then(res=>{
    err ? item.data.push(...res.data) : Object.assign(item,res);
  })
}
// 处理点评模式
const onMode = (item,mode)=>{
  
}
/**
 * 发表评论
 * atReview: type mode content signatrue 
 * atReply: review:uuid content signature
 * atQuote: review:uuid quote content signature
 */
const atReview = (item)=>{
  state.method ='review'
  state.toggled = item;
  state.content = '';
  console.log(item)

}
const atQuote = (item)=>{
  state.method ='quote';
  state.toggled = item;
  state.content = '';
}
// 发表评论 mode atReview atReply atQuote
const onSubmit = ()=>{
  let {type,mode,content} = state;
  let {signature} = useAuth();
  
  apiFetch('discuss/onreview',{type,mode,content,signature}).then(res=>{
    console.log(res)
    // err ? item.data.push(...res.data) : Object.assign(item,res);
  })
}
</script>

<style lang="scss">

</style>