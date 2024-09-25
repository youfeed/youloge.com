<template>
  <div :class="cls">
    <div class="head" @click="onExpand">
      <div>{{discuss.review}} 条评论 · {{discuss.chosen}} 条精选</div>
      <div>&#x2599;</div>
    </div>
    <div class="head">
      <div>1,958 条评论 · 17 条精选</div>
      <div>
        <img class="avatar" src="https://open.youloge.com/sticker/default/default!0">
        <span>&#x02A00;</span>
      </div>
    </div>
    <div class="body">
      <template v-for="item in review" :key="item.uuid">
        <div class="review">
          <div class="avatar"><img src="https://open.youloge.com/sticker/default/default!0"></div>
          <div class="content">
            <div class="user"><span class="named">nick</span><span class="timed">12分钟钱</span></div>
            <div class="rich">评论内容---</div>
            <template v-for="items in item.reply" :key="items.uuid">
              <div class="reply">
                <div class="avatar"><img src="https://open.youloge.com/sticker/default/default!0"></div>
                <div class="content">
                  <div class="user"><span class="named">nick</span><span class="timed">12分钟钱</span></div>
                  <div class="rich">@2222 emoji 评论内容---</div>
                </div>
              </div>
            </template>
            <div class="loadreply" @click="onReply">{{item.replys}} 条回复</div>
          </div>
        </div>
      </template>
      <div class="load" v-show="next">加载评论 2596 - 259F</div>
    </div>
    <div class="foot">
      <div class="collapse">
        <div class="avatar"><img src="https://open.youloge.com/sticker/default/default!0"></div>
        <div class="content">
          <div class="textarea">
            <div class="rich" contenteditable></div>
            <div class="counter">12/140</div>
          </div>
          
          <div class="navbar">
            <div class="emoji">
              <ul class="nav">
                <li><img src="https://open.youloge.com/sticker/default/default!50"></li>
                <li><img src="https://open.youloge.com/sticker/default/default!50"></li>
                <li><img src="https://open.youloge.com/sticker/default/default!50"></li>
              </ul>
            </div>
            <div class="button">
              <div class="cancel">取消</div>
              <div class="submit">评论</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, toRefs } from "vue"
const props = defineProps(['mode','uuid'])

const state = reactive({
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
}),{discuss} = toRefs(state)
// 
const cls = computed(()=>['discuss',{'mask':state.mask}])
onMounted(()=>{
  state.mode = props.mode
  state.uuid = props.uuid
  //
  onInit()
})
// 发起请求
const onFetch = (method,params)=>{
  state.mask = true;
  return fetch('https://api.youloge.com',{method:'post',headers:{ukey:state.ukey},body:JSON.stringify({method:method,params:params})}).then(r=>r.json()).then(res=>{
    state.mask = false;return res
  }).catch(err=>{
    postMessage('fail',{msg:'网络网关错误',err:err})
  })
}
// 开始提取数据
const onInit = ()=>{
  onFetch('discuss',{uuid:state.uuid}).then(res=>{
    state.discuss = res.data
    // Object.assign(state,res.data)
    console.log(state)
  })
}
// 获取评论 - 分页
const onReview = ()=>{
  let {uuid} = state.discuss;
  onFetch('review',{uuid:uuid}).then(res=>{
    state.review = res.data
    console.log(res)
  })
}
// 获取回复 - 分页
const onReply = ()=>{
  let {uuid} = state.discuss;
  onFetch('reply',{uuid:uuid}).then(res=>{
    let index = state.review.findIndex(item=>item==uuid);
    state.review[index].reply.push(res.data)
    console.log(res)
  })
}
// 展开评论
const onExpand = ()=>{
  onReview()
  postMessage('expand',{msg:'Expand discuss'})
}
// postMessage
const postMessage = (method,params={})=>{
  let {hash,referrer} = state;
  window.parent.postMessage({ [hash]:{method:method,params:params} }, referrer)
}

</script>

<style lang="scss">

</style>