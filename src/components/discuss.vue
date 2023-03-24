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
})
// 
const cls = computed(()=>['discuss',{'mask':state.mask}])
onMounted(()=>{
  // window.self === window.top ? location.href ='/' : onSync();
  onInit()
  // postMessage('ready',{msg:'youloge.discuss is ready'})
  const {referrer,hash,ukey} = state;
  window.onmessage = ({origin,data})=>{
    let {method,params} = data[hash] || {};
    if(referrer.startsWith(origin) && method && ukey == ''){
      let work = {
        'init':()=>{
          params.ukey.length < 64 && postMessage('fail',{msg:'Ukey undefined'})
          state.host = new URL(origin).hostname;state.ukey = params.ukey;state.close = params.close;
          onInit();
        }
      };
      work[method] ? work[method]() : console.log('not method');
    }
  }
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
const {discuss} = toRefs(state)
</script>

<style lang="scss">
*{margin: 0;padding: 0;box-sizing: border-box;}
.grecaptcha-badge{visibility: hidden;}
.discuss{
  position: relative;
  height: 100vh;
  background: #fffffff2;
  backdrop-filter: blur(4px);
  user-select: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .avatar{
    width: 2rem;
    height: 2rem;
  }
  .head{
    color: #6190e8;
    padding: 1em 5px;
    border-bottom: 1px solid #e9e9e9;
    font-size: 1em;
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .review,.reply{
    display: flex;
    margin-top: 0.5rem;
    .avatar{
      width: 2rem;
      height: 2rem;
      cursor: pointer;
      img{
        width: 100%;
      }
    }
    .content{
      flex: 1;
      margin-left: 1rem;
    }
    .named{
      font-size: 16px;
      color: #222;
    }
    .timed{
      margin-left: 0.5em;
      font-size: 12px;
      color: #666;
    }
    .loadreply{
      margin-top: 0.5rem;
      color: #2196F3;
      cursor: pointer;
    }
  }
  .body{
    flex:1;
    padding: 5px;
  }
  .foot{
    padding: 5px;
  }
  .collapse{
    display: flex;
    .avatar{
      width: 2rem;
      height: 2rem;
      cursor: pointer;
      img{
        width: 100%;
      }
    }
    .content{
      flex: 1;
      margin-left: 1rem;
      .textarea{
        background: #f2f2f2;
        min-height: 5rem;
        padding: 10px;
        border-radius: 5px;
        position: relative;
        .rich{
          overflow-y: scroll;
          min-height: 5rem;
          outline: 0;
          max-height: 8rem;
        }
        .counter{
          position: absolute;
          right: 5px;
          bottom: 5px;
          color: #888;
          font-size: 12px;
          pointer-events: none;
        }
        &:hover{
          border: 1px solid #2196F3;
        }
      }
    }
    .navbar{
      margin-top: .5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .emoji{
        flex: 1;
        ul{
          list-style: none;
          display: flex;
          flex-wrap: nowrap;
          gap: 5px;
          li{
            cursor: pointer;
            width: 1rem;
            height: 1rem;
            img{
              width: 100%;
            }
          }
        }
      }
      .button{
        display: flex;
        align-items: center;
        height: 2rem;
        gap: 10px;
        .submit{
          color: #eee;
          background-color: #6190e8;
        }
        .cancel{
          background-color: #fff;
          color: #6190e8;
        }
        div{
          padding: 4px 10px;
          box-shadow: 0 0 2px #000;
          font-size: 16px;
          border-radius: 5px;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          &:hover{
            opacity: .7;
          }
        }
      }
    }
  }
}
</style>