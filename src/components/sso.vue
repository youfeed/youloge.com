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

      <div>
        <div class="formitem">
          <div class="field">
            <input if="email" type="email" v-model="pass" required autocomplete="off" :class="passCls">
            <label for="email" :title="lang('email')" :data-title="lang('email')"></label>
          </div>
        </div>
      </div>
      
      <div>
        <div class="formitem">
          <div class="field">
            <input type="text" v-model="word" required autocomplete="off" :class="wordCls">
            <label for="code" :title="lang('otpcode')" :data-title="lang('otpcode')"></label>
            <div :class="codeCls" @click="onCode">{{msg}}</div>
          </div>
        </div>
      </div>
      
      <div>
        <div class="formitem">
          <div @click="onSubmit" :class="submCls" v-text="lang('confirm')"></div>
        </div>
      </div>
    </div>
    <div class="foot">
      <div class="source"><span>{{host}}</span></div>
      <a class="create" href="//youfeed.github.io/plus" target="_blank" v-text="version"></a>
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
  version:'0.0.8',
  hash:location.hash,
  referrer:document.referrer,
  uage:navigator.language.toLowerCase(),
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
const lang = (key)=>({
  email:['邮箱','Email'],
  title:['登录·注册','Log In Register'],
  newaccount:['使用新账户','Use New Account'],
  newlogin:['安全邮箱登录','Secure Email Login'],
  otpcode:['验证码','OTP Code'],
  confirm:['确认','Confirm'],
  afresh:['重新获取','Try Again']
}[key][+!state.uage.startsWith('zh')]);
onMounted(()=>{
  window.self === window.top ? location.href ='/' : SendMessage('ready',{msg:'youloge.sso is ready'});
  // 接收初始参数
  const {referrer,hash,ukey} = state;
  // window.addEventListener('message',({origin,data,source})=>{
  window.onmessage = ({origin,data,source})=>{
    console.log(hash,data)
    let {method,params} = data[hash] || {};
    if(referrer.startsWith(origin) && method && ukey == ''){
      let work = {
        'init':()=>{
          params.ukey.length < 64 && SendMessage('error',{msg:'Ukey undefined'});
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
  onFetch('register',{mail:state.pass}).then(({data})=>{
    let {random,access,expire} = data,second = 120
    let timer = setInterval(()=>{
      state.sign = access
      state.msg = `${random}(-${--second})`
      if(second < 0){
        state.sign = ''
        state.msg = lang('afresh')
        clearTimeout(timer)
      }
    },1000)
  })
}
// 获取长期Token
const onSubmit = ()=>{
  console.log('state',state)
  onFetch('verify',{access:state.sign,code:state.word}).then((res)=>{
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
  let {uuid,jwtoken} = event
  onFetch('sign',{uuid:uuid,jwtoken:jwtoken}).then(res=>{
    let json = Object.assign(markRaw({}),event,res.data);//delete json.wallet;
    res.err == 0 ? SendMessage('success',json) : SendMessage('error',{msg:res.msg});
  })
}
// 同步资料 - jwtoken
const onSync = ()=>{
  state.account = getStorage('account');
  let params = [], times = new Date().getTime() / 1000 >> 0;
  state.account.map(({uuid,jwtoken,expire})=>{
    if((expire - times) < 3600){
      params.push({uuid:uuid,jwtoken:jwtoken})
    }
  });
  let [...isEmpty] = params
  console.log('sync',params,isEmpty)
  isEmpty && onBatch('sync',params).then(res=>{
    console.log(res)
    // res.err == 0 ? (setStorage('account',res.data),state.account=res.data) : SendMessage('error',{msg:res.msg})
  });
}
// 发起请求 params [] 批量 {} 单条
const onFetch = (method,params={})=>{
  state.mask = true;
  return new Promise((resolve)=>{
    fetch('https://api.youloge.com/login',{method:'post',headers:{ukey:state.ukey,lang:state.lang,"Content-Type": "application/json"},body:JSON.stringify({method:method,params:params})}).then(r=>r.json()).then(res=>{
      resolve(res);res.err !== 0 && SendMessage('warn',{msg:res.msg})
    }).catch(err=>{
      SendMessage('error',{msg:'网络网关错误',err:err});
    }).finally(()=>{
      state.mask = false;
    })
  })
}
// 关闭弹窗
const onClose = ()=>SendMessage('error',{msg:'用户主动取消登录'})
// SendMessage
const SendMessage = (method,params={})=>{
  let {hash,referrer} = state;
  window.parent.postMessage({ [hash]:{method:method,params:params} }, referrer)
}
const {msg,host,mode,pass,word,close,account,version} = toRefs(state)
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