<template>
  <div :class="sso">
    <div class="head">
      <div class="title">登录·注册</div>
    </div>

    <div class="progress"><span class="rate"></span></div>

    <div class="quick" v-show="mode=='quick'">
      <template v-for="item in account" :key="item.uuid">
        <div class="profile" @click="onQuick(item)">
          <div class="avatar">
            <img :src="'//img.youloge.com/'+item.avatar+'!80'">
          </div>
          <div class="account">
            <div class="name">{{item.name}}</div>
            <div class="mail">{{item.mail}}</div>
          </div>
        </div>
      </template>
      <div class="profile" @click="onToggle">
        <div class="avatar">
          <img src="//img.youloge.com/FjjHFE7RwJqfjiwM9aqL4G53kPv3!80">
        </div>
        <div class="account ">
          <div class="name" style="color:#03a9f4">使用新账户</div>
          <div class="mail">安全邮箱登录</div>
        </div>
      </div>
    </div>

    <div class="body" v-show="mode=='normal'">

      <div>
        <div class="formitem">
          <div class="field">
            <input if="email" type="email" v-model="pass" required autocomplete="off" :class="passCls">
            <label for="email" title="邮箱" data-title="邮箱"></label>
          </div>
        </div>
      </div>
      
      <div>
        <div class="formitem">
          <div class="field">
            <input type="text" v-model="word" required autocomplete="off" :class="wordCls">
            <label for="code" title="验证码" data-title="验证码"></label>
            <div :class="codeCls" @click="onCode">{{msg}}</div>
          </div>
        </div>
      </div>
      
      <div>
        <div class="formitem">
          <div @click="onSubmit" :class="submCls">确认</div>
        </div>
      </div>
    </div>
    <div class="foot">
      <a class="create" href="//youfeed.github.io/sso" target="_blank">关于账户</a>
      <div class="source">来源:<span>{{host}}</span></div>
    </div>
    <div class="close" @click="onClose" v-show="close">
      <svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
    </div>
  </div>
</template>

<script setup>
import { computed, markRaw, onMounted, reactive, toRefs } from "vue";

const state = reactive({
  name:'youloge.sso',
  hash:location.hash,
  referrer:document.referrer,
  ukey:'',
  msg:'获取验证码',
  mask:false,

  mode:'quick',// quick normal
  host:'未知',
  account:[],
  pass:'',
  word:'',
  sign:'',
  close:true
})

onMounted(()=>{
  window.self === window.top ? location.href ='/' : postMessage('ready',{msg:'youloge.sso is ready'});
  // 接收初始参数
  const {referrer,hash,ukey} = state;
  window.onmessage = ({origin,data})=>{
    let {method,params} = data[hash] || {};
    if(referrer.startsWith(origin) && method && ukey == ''){
      let work = {
        'init':()=>{
          params.ukey.length < 64 && postMessage('fail',{msg:'Ukey undefined'});
          state.host = new URL(origin).hostname;
          state.ukey = params.ukey;
          state.close = params.close;
          onSync();
        }
      };
      work[method] ? work[method]() : console.log('not method');
    }
  }
})
const getStorage = (key)=>JSON.parse(localStorage.getItem(key) || '[]');
const setStorage = (key,val=[])=>localStorage.setItem(key,JSON.stringify(val));
const sso = computed(()=>['sso',{'mask':state.mask}])
const passCls = computed(()=>['field',{'stop':state.sign !== ''}])
const codeCls = computed(()=>['next',{'stop':!((/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).exec(state.pass) && state.sign == '')}])
const wordCls = computed(()=>['field',{'stop':state.sign == ''}])
const submCls = computed(()=>['submit',{'stop':!(state.word.length == 6 && state.sign !== '')}])

// 关联账户
const onToggle = ()=>{
  state.mode = 'normal'
}
// 获取验证码
const onCode = ()=>{
  state.sign = true
  onFetch('register',{mail:state.pass}).then(res=>{
    let {random,signer} = res.data,second = 120
    let timer = setInterval(()=>{
      state.sign = signer
      state.msg = `${random}(${--second}s)`
      if(second < 0){
        state.sign = ''
        state.msg = '重新获取'
        clearTimeout(timer)
      }
    },1000)
  })
}
// 获取长期Token
const onSubmit = ()=>{
  onFetch('login',{pass:state.sign,word:state.word}).then(res=>{
    let {err,msg,data} = res;
    if(err == 0){
      state.mode = 'quick';
      let index = state.account.findIndex(item=>item.uuid == data.uuid);
      index == -1 ? state.account.unshift(data) : state.account[index] = data;
      setStorage('account',state.account);
    }else{
      state.hint = msg,state.word = '';
    }
  })
}
// 快捷登录 - 授权签名
const onQuick = (event)=>{
  let {uuid,signer} = event
  onFetch('sign',{uuid:uuid,signer:signer}).then(res=>{
    let json = Object.assign(markRaw({}),event,res.data);delete json.wallet;
    res.err == 0 ? postMessage('success',json) : postMessage('fail',{msg:res.msg});
  })
}
// 同步资料
const onSync = ()=>{
  state.account = getStorage('account');
  let params = state.account.map(item=>{
    return {'signer':item.signer,'wallet':false}
  });

  params.length > 0 && onFetch('sync',{account:params}).then(res=>{
    res.err == 0 ? (setStorage('account',res.data),state.account=res.data) : postMessage('fail',{msg:res.msg})
  });
}
// 发起请求
const onFetch = (method,params={})=>{
  state.mask = true;
  return fetch('https://api.youloge.com',{method:'post',headers:{ukey:state.ukey},body:JSON.stringify({method:method,params:params})}).then(r=>r.json()).then(res=>{
    state.mask = false;return res
  }).catch(err=>{
    postMessage('fail',{msg:'网络网关错误',err:err})
  })
}
// 关闭弹窗
const onClose = ()=>postMessage('close',{msg:'用户主动取消登录'})
// postMessage
const postMessage = (method,params={})=>{
  let {hash,referrer} = state;
  window.parent.postMessage({ [hash]:{method:method,params:params} }, referrer)
}
const {msg,host,mode,pass,word,close,account} = toRefs(state)
</script>

<style lang="scss">
*{margin: 0;padding: 0;}
.grecaptcha-badge{visibility: hidden;}
.sso{
  position: relative;
  height: 100vh;
  background: #fffffff2;
  backdrop-filter: blur(4px);
  user-select: none;
  display: flex;
  flex-direction: column;
  .stop{
    opacity: .5;
    pointer-events: none;
  }
  .head{
    padding-left: 10px;
    padding-top: 10px;
    .title{
      color: #2e2e2e;
      font-size: 24px;
      font-weight: 400;
      margin-bottom: 10px;
    }
  }
  .quick{
    flex: 1;
    overflow-y: scroll;
    .profile{
      cursor: pointer;
      display: flex;
      align-items: center;
      margin: 5px;
      border: 1px solid #ddd;
      border-radius: 5px;
      &:hover{
        background: #fff;
      }
      .avatar{
        width: 70px;
        height: 70px;
        border-radius: 50%;
        overflow: hidden;
        img{
          max-width: 100%;
        }
      }
      .account{
        margin-left: 10px;
        .name{
          font-size: 18px;
          color: #333;
        }
        .mail{
          margin-top: 5px;
          font-size: 14px;
          color: #999;
        }
      }
    }
  }
  .body{
    flex: 1;
    padding: 10px;
    .next{cursor: pointer;position: absolute;top: 10px;right: 10px;color: #2E77E5;font-size: 12px; padding: 5px;}
    .label::before,
    .field input:valid + label::before,
    .field input:focus + label::before {
      line-height: 20px;
      font-size: 12px;
      top: -10px;
      background: #fff;
      padding: 0 6px;
      left: 9px;
    }
    .field {
      position: relative;
      margin-bottom: 15px;
    }
    .field label::before {
      content: attr(title);
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 15px;
      line-height: 40px;
      font-size: 14px;
      color: #777;
      transition: 300ms all;
    }
    .field input {
      width: 100%;
      line-height: 40px;
      padding: 0 15px;
      box-sizing: border-box;
      font-size: 14px;
      color: #222;
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    .field input:focus {
      outline: 0;
      border-color: blue;
    }
    .field input:valid + label::before {
      content: attr(data-title);
    }
    .field input:focus + label::before {
      color: blue;
    }
    .submit{
      margin: 20px;
      background: #09F;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      color: #fff;
      cursor: pointer;
    }
  }
  .foot{
    font-size: 14px;
    position: sticky;
    bottom: 0;
    color: #03a9f4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    .create{
      cursor: pointer;
      color: #03a9f4;
      text-decoration: none;
    }
    .source{
      color: #4caf50;
    }
  }
  .progress{
    height: 4px;
    position: relative;
    margin-bottom: 10px;
    width: 100%;
    background: #2196f3;
    .rate{
      height: 4px;
      position: absolute;
    }
  }
  .close{
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    height: 30px;
    font-size: 30px;
    line-height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    &:hover{
      background: #f1f1f1;
    }
  }
}
.mask{
  opacity: 0.7;
  pointer-events: none;
  .rate{
    width:100% !important;
    animation:.5s keymask infinite;
  }
}
@keyframes keymask {

  0%{
    background: #00f;
    transform: scaleX(0%);
  }
  50% {
    background: #f00;
    transform: scaleX(50%);
  }
  75%{
    background:#ff0;
    transform: scaleX(75%);
  }
  100% {
    background:#f0f;
    transform: scaleX(100%);
  }
}
::-webkit-scrollbar {
  width: 5px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 5px;
}
</style>