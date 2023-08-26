<template>
  <div :class="sso">
    <div class="head">
      <div class="title" v-text="lang('title')"></div>
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
          <div class="name" style="color:#03a9f4" v-text="lang('newaccount')"></div>
          <div class="mail" v-text="lang('newlogin')"></div>
        </div>
      </div>
    </div>

    <div class="body" v-show="mode=='normal'">
      <form @submit.prevent="onSubmit">
        <div>
          <div class="field">
            <input id="mail" type="email" v-model="toggled.mail" required autocomplete="off">
            <label for="mail" :title="lang('email')" data-title="✔"></label>
            <button class="getcode" @click="onCode" v-text="lang('otpcode')"></button>
          </div>
        </div>
        
        <div>
          <div class="field">
            <input id="code" type="text" v-model="toggled.code" required autocomplete="off" pattern="[abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}" minlength="5" maxlength="5">
            <label for="code" :title="lang('otpcode')+'-'+toggled?.random" data-title="✔"></label>
          </div>
        </div>
        
        <div>
          <input class="sso-submit" type="submit" :value="lang('confirm')">
          <input class="sso-cancel" type="reset"  :value="lang('reset')">
        </div>
      </form>
    </div>

    <div class="foot">
      <div class="source"><span>{{host}}</span></div>
      <a class="create" href="//youfeed.github.io/ui/plus" target="_blank" v-text="version"></a>
    </div>
    <div class="close" @click="onClose" v-show="close">
      <svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
    </div>
  </div>
</template>

<script setup>
/**
 * 相同Ukey 直接快捷登录
 * 其他Ukey 免输入邮箱->验证码->登录
 */
import { computed, markRaw, onMounted, reactive, toRefs } from "vue";
const state = reactive({
  name:'youloge.sso',
  version:'1.1.3',
  hash:location.hash,
  referrer:document.referrer,
  uage:navigator.language.toLowerCase(),
  ukey:'',
  mask:false,

  account:[], // 本地缓存账户
  // 选中账户
  toggled:{
    uuid:'',
    random:'',
    access:'',
    secret:'',
    expire:'',
    mail:'',
    code:'',
    created:'',
    updated:''
  },
  mode:'quick',// quick normal
  host:'未知',
  close:true
});
const lang = (key)=>({
  email:['邮箱','Email'],
  title:['登录·注册','Log In Register'],
  newaccount:['使用新账户','Use New Account'],
  newlogin:['安全邮箱登录','Secure Email Login'],
  otpcode:['获取验证码','OTP Code'],
  confirm:['确认','Confirm'],
  reset:['重置','Reset'],
  afresh:['重新获取','Try Again']
}[key][+!state.uage.startsWith('zh')]);
onMounted(()=>{
  // 接收初始参数
  const {referrer,hash,ukey} = state;
  window.onmessage = ({origin,data,source})=>{
    let {method,params} = data[hash] || {};
    if(referrer.startsWith(origin) && method && ukey == ''){
      let work = {
        'init':()=>{
          params.ukey.length < 64 && SendMessage('error',{msg:'Ukey undefined'});
          state.host = new URL(origin).hostname;
          state.ukey = params.ukey;
          state.close = params.close;
          onRefresh();
        }
      };
      work[method] ? work[method]() : console.log('not method');
    }
  }
  // 禁止本地
  window.self === window.top ? location.href ='/' : SendMessage('ready',{msg:'youloge.sso is ready'});
})
const getStorage = (key)=>JSON.parse(localStorage.getItem(key) || '[]');
const setStorage = (key,val=[])=>localStorage.setItem(key,JSON.stringify(val));
const sso = computed(()=>['sso',{'mask':state.mask}])
// 关联账户
const onToggle = ()=>{
  state.mode = 'normal'
}
// 获取验证码
const onCode = ()=>{
  let {mail} = state.toggled
  state.sign = true
  onFetch('code',{mail:mail}).then((data)=>{
    state.toggled.access = data.access
    state.toggled.random = data.random
  }).catch((err)=>{
    // 弹窗提示错误
    alert(err)
  })
}
// 验证验证码
const onSubmit = ()=>{
  let {access,code} = state.toggled;
  onFetch('verify',{access:access,code:code}).then((data)=>{
    let {uuid,secret,expire} = data;
    state.toggled.secret = secret;
    state.toggled.expire = expire;
    // 保存账户
    let index = state.account.findIndex(item=>item.uuid == uuid);
    index == -1 ? state.account.unshift(data) : state.account[index] = data;
    setStorage('account',state.account);
    // 直接授权
    onAuthorize();
  }).catch((err)=>{})
}
// 快捷登录 - 
const onQuick = (event)=>{
  Object.assign(state.toggled,event);
  // 尝试授权签名
  onAuthorize();
}
// 刷新登录 - refresh
const onRefresh = ()=>{
  state.account = getStorage('account');
  let params = state.account.map(({secret})=>({secret:secret}));
  params.length && onFetch('refresh',params).then(data=>{
    state.account = data.filter(item=>item.uuid);
    setStorage('account',state.account);
  });
}
// 授权签名
const onAuthorize = ()=>{
  let {uuid,secret} = state.toggled;
  onFetch('authorize',{secret:secret}).then(({signature,expire})=>{
    let account = state.account.find(item=>item.uuid == uuid);
    account.expire = expire;
    account.signature = signature;
    SendMessage('success',Object.assign(markRaw({}),account));
  }).catch((err)=>{
    // 失败请求验证码
    onToggle();
  })
}
// 发起请求 params [] 批量 {} 单条
const onFetch = (method,params={})=>(state.mask = true,new Promise((resolve,reject)=>{
  fetch('https://api.youloge.com/login',{
    method:'post',
    headers:{ukey:state.ukey,lang:state.lang,"Content-Type": "application/json"},
    body:JSON.stringify({method:method,params:params})
  }).then(r=>r.json()).then(({err,msg,data})=>{
    err == 200 ? resolve(data) : reject(msg);
  }).catch(err=>{
    reject(err);
  }).finally(()=>{
    state.mask = false;
  })
}))
// 关闭弹窗
const onClose = ()=>SendMessage('error',{msg:'用户主动取消登录'})
// SendMessage
const SendMessage = (method,params={})=>{
  let {hash,referrer} = state;
  window.parent.postMessage({ [hash]:{method:method,params:params} }, referrer);
}
const {msg,host,mode,close,account,version,toggled} = toRefs(state)
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
        padding: 2px;
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
      text-align: center;
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
    input#mail:valid ~ .getcode{
      display: block;
      color: blue;
    }
    input#mail{
      letter-spacing: .1em;
      font-size: 14px;
      text-transform: lowercase;
    }
    input#code{
      letter-spacing: 2em;
      font-weight: 800;
      font-size: 18px;
      text-transform: uppercase;
    }
    .getcode{
      position: absolute;
      right: 0;
      top: 0;
      color: #2196F3;
      border: 0;
      padding: 5px;
      background: transparent;
      cursor: pointer;
      display: none;
      height: 100%;
    }
    input[type='submit'],input[type='reset']{
      width: 100%;
      height: 40px;
      background: #09F;
      color: #fff;
      border: 1px solid #03A9F4;
      border-radius: 3px;
      margin-top: 20px;
      cursor: pointer;
      &:hover{
        opacity: .7;
      }
    }
    input[type='reset']{
      background: #eee;
      color: #333;
      border: 1px solid #03A9F4;
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