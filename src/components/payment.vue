<template>
  <transition>
  <div :class="payment">
    <div class="head">
      <div class="title" v-text="lang('title')"></div>
    </div>
    <div class="progress"><span class="rate"></span></div>

    <div class="money" title="&1.00 RGB = ￥1.00 CNY">
      <div class="total">
        <span style="font-size: .6em;">&</span>
        <span v-text="onMoney" style="font-size: 1.8em;"></span>
        <span style="font-size: .8em;"> RGB</span>
      </div>
    </div>

    <div class="tips" v-text="lang('tips')"></div>

    <div class="body" v-show="mode=='quick'">
      <template v-for="item in account" :key="item.uuid">
        <div class="profile" @click="onQuick(item)">
          <div class="avatar">
            <img src="//img.youloge.com/FjjHFE7RwJqfjiwM9aqL4G53kPv3!80">
          </div>
          <div class="account">
            <div class="name">{{item.name}}</div>
            <div class="mail">{{item.mail}}</div>
          </div>
        </div>
      </template>
      <div class="profile" @click="onMode('normal')">
        <div class="avatar">
          <img src="//img.youloge.com/FjjHFE7RwJqfjiwM9aqL4G53kPv3!80">
        </div>
        <div class="account ">
          <div class="name" style="color:#03a9f4" v-text="lang('newlogin')"></div>
          <div class="mail">安全邮箱支付</div>
        </div>
      </div>
    </div>

    <div class="body" v-show="mode=='normal'">
      <form class="y-form-payment" @submit.prevent="onSubmit" @reset="onReset">
        <div class="form-item">
          <input id="email" type="email" v-model="profile.mail" required autocomplete="off" :readOnly='false'>
          <label for="email" title="安全邮箱" data-title="✔"></label>
          <div class="form-item-svg" @click="onCode">
            <svg t="1691552252830" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17602" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30">
              <path d="M747.830303 287.030303H276.169697a51.510303 51.510303 0 0 0-33.82303 12.722424l-1.706667 1.086061a49.18303 49.18303 0 0 0-15.515152 35.684848v350.487273a50.734545 50.734545 0 0 0 51.2 49.958788H747.830303a50.734545 50.734545 0 0 0 51.2-49.958788V336.989091a50.734545 50.734545 0 0 0-51.2-49.958788z m-471.660606 20.014545h471.660606a31.030303 31.030303 0 0 1 11.791515 2.327273L512 550.94303 263.757576 309.527273a31.030303 31.030303 0 0 1 12.412121-2.482425z m-31.030303 379.966061V336.989091a29.013333 29.013333 0 0 1 3.723636-13.963636l192.077576 187.112727L248.242424 698.181818a29.168485 29.168485 0 0 1-2.792727-11.170909z m502.690909 29.944243H276.169697a31.030303 31.030303 0 0 1-14.584242-3.723637l193.784242-188.974545 46.545455 45.149091a10.084848 10.084848 0 0 0 19.393939 0l46.545454-45.149091L762.104242 713.69697a31.030303 31.030303 0 0 1-14.273939 3.258182z m31.030303-29.944243a29.168485 29.168485 0 0 1-3.10303 11.170909L582.593939 510.138182l192.077576-187.267879a29.013333 29.013333 0 0 1 3.878788 14.273939z" p-id="17603"></path>
              <path d="M512 15.515152A496.484848 496.484848 0 1 1 15.515152 512 496.484848 496.484848 0 0 1 512 15.515152m0-15.515152a512 512 0 1 0 512 512A512 512 0 0 0 512 0z" p-id="17604"></path>
            </svg>
          </div>
        </div>
        <div class="form-item">
          <input id="code" type="text" v-model="profile.code" required pattern="[abcdefghjklmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}" minlength="6" maxlength="6" autocomplete="off" :class="passCls">
          <label for="code" title="支付码-AWC" data-title="✔"></label>
        </div>
        <div class="form-button">
          <button type="submit">支付</button>
          <button type="reset">返回</button>
        </div>
      </form>

    </div>

    <div class="body" v-show="mode=='deposit'">
      <div class="deposit">
        <div class="left">
          <img :src="qrcode" class="qrcode" :style="{filter: 'blur('+blur+'px)'}"/>
        </div>
        <div class="right">
          <div class="amount"><label for="deposit-number">金额：</label><input type="number" id="deposit-number" v-model="deposit" @focus="onFocusDeposit" @blur="onBlurDeposit" placeholder="0.01 - 3000元"></div>
          <div class="account"><label>账户：</label><input type="mail" readonly :value="profile?.mail"></div>
          <div class="support">支持微信·支付宝扫码</div>
        </div>
      </div>
      <div class="back" @click="mode = 'quick'">返回</div>
    </div>
    <div class="foot">
      <div class="source"><span>{{host}}</span></div>
      <a class="about" href="//youfeed.github.io/plus" target="_blank" v-text="version"></a>
    </div>
    <div class="close" @click="onClose" v-show="close">
      <svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
    </div>
  </div>
</transition>
</template>
<!-- 验证码采用 3+5 模式 -->
<!-- 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'.split('').sort(() => Math.random() - 0.5).splice(-5).join('') -->
<script setup>
import {reactive,onMounted, toRefs,computed, nextTick} from 'vue'
const state = reactive({
  version:'0.2.3',
  uage:navigator.language.toLowerCase(),
  name:'youloge.payment',
  hash:location.hash,
  referrer:document.referrer,

  profile:{}, // 活跃信息
  account:[], // 

  ukey:'',
  local:'', // 卖家
  money:'0.00', // 金额

  mode:'quick',// quick normal success fail deposit
  alpha:'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  captcha:[0,1,2,3,4,5,6,7,8],
  msg:'获取验证码',
  mask:false,
  host:'未知',

  deposit:'10.00',
  blur:0,

  rand:'',
  code:[],

  pass:'',
  word:'',
  sign:'',
  close:true,
  selected:{},
  paysign:{random:''}
})
const lang = (key)=>({
  title:['收银台','Payment'],
  email:['邮箱','Email'],
  tips:['选择支付账户 + 补全支付码 = 完成支付','Select Account + Pay Code = Complete'],

  newlogin:['使用新账户','Use New Account'],
  otpcode:['验证码','OTP Code'],
  confirm:['确认','Confirm'],
  afresh:['重新获取','Try Again']
}[key][+!state.uage.startsWith('zh')]);
onMounted(()=>{
  window.self === window.top ? location.href ='/' : postMessage('ready',{msg:'youloge.payment is ready'});
  // 初始参数
  const {referrer,hash,ukey} = state;state.account = getStorage('account');
  window.onmessage = ({origin,data})=>{
    let {method,params} = data[hash] || {};
    if(referrer.startsWith(origin) && method && ukey == ''){
      let work = {
        'init':()=>{
          params.ukey.length < 64 && postMessage('fail',{msg:'Ukey undefined'})
          params.local == '' && postMessage('fail',{msg:'缺少local参数'});
          params.money <= 0 && postMessage('fail',{msg:'缺少money参数'});
          state.host = new URL(origin).hostname;
          state.ukey = params.ukey;
          state.close = params.close;
          state.local = params.local;
          state.money = params.money;
        }
      };
      work[method] ? work[method]() : console.log('not method');
    }
  }
})

const onMoney = computed(()=>`${Number(state.money || 0).toFixed(2)}`)
const payment = computed(()=>['y-payment',{'mask':state.mask}])
const passCls = computed(()=>['field',{'stop':state.sign !== ''}])
const submCls = computed(()=>['submit',{'stop':!((/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).exec(state.pass))}])

const qrcode = computed(()=>{
  let {deposit,blur,selected} = state, money = blur == 0 ? deposit : '10.00';
  let data = encodeURIComponent(`https://open.youloge.com/pay?u=${selected.uuid}&m=${money}`);
  return `https://qun.qq.com/qrcode/index?data=${data}`
})

const onFocusDeposit = ()=>{
  state.blur = 5;
}
const onBlurDeposit = ()=>{
  let money = Math.max('0.01',state.deposit).toFixed(2);
  state.blur = 0;
  state.deposit = money;
}
const getStorage = (key,init='[]')=>JSON.parse(localStorage.getItem(key) || init);
const setStorage = (key,val=[])=>localStorage.setItem(key,JSON.stringify(val));
// 支付码
const payInput = (e)=>[...state.captcha].splice(-5).every(a=>a && state.alpha.indexOf(a) > -1) && onPayment();
const payFocus = (e)=>e.target.dataset.key > 3 && e.target.select();
const payDown = (e)=>{
  console.log(state.alpha,e.key)
  if(e.key ==='Backspace' || state.alpha.indexOf(e.key.toUpperCase()) > -1){
    e.key ==='Backspace' ? e.target.dataset.key == 4 ? e.target.focus() : setTimeout(()=>{e.target.previousSibling.focus()},50) : setTimeout(()=>{e.target.nextSibling?.focus()},50);
  }else{
    e.preventDefault()
  }
}
// 随机打乱
// const onShuffle = (set=true)=>{
//   let captcha = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'.split('').sort(() => Math.random() - 0.5).splice(-9);captcha[3] = '-'
//   state.captcha = captcha;
// }
// 支付验证码
const onCode = ()=>{
  let {profile:{mail},local,money} = state
  console.log(mail,local,money)
  state.sign = true
  onFetch('wallet','code',{mail:mail,local:local,money:money}).then(({err,msg,data})=>{
    Object.assign(state.profile,data)
    console.log(state.profile)
    // let {random,signer} = res.data,second = 120
    // let timer = setInterval(()=>{
    //   state.sign = signer
    //   state.msg = `${random}(${--second}s)`
    //   if(second < 0){
    //     state.sign = ''
    //     state.msg = '重新获取'
    //     clearTimeout(timer)
    //   }
    // },1000)
  })
}
// 验证支付
const onSubmit = ()=>{
  let {profile:{code,random,signer}} = state;
  onFetch('wallet','verify',{code:code,random:random,signer:signer}).then(({err,msg,data})=>{
    console.log('verify',err,msg,data)
  })
  return false;
}
// 快捷支付 - 邮件 - 验证余额 - 余额不足充值
const onQuick = (item)=>{
  let {mail} = item,{local,money} = state;state.selected = item;
  onFetch('wallet','code',{mail:mail,local:local,money:money}).then(({err,msg,data})=>{
    const action = {
      '200':()=>{
        state.paysign = data
        onMode('password')
      },
      '302':()=>{
        onMode('deposit')
      }
    };
    action[err] ? action[err]() : postMessage('fail',{msg:msg});
  })
}
// 确认支付
const onPayment = ()=>{
  console.log('onPayment')
  let {paysign,code} = state,{signer} = paysign;
  onFetch('wallet','verify',{code:code.join(''),signer:signer}).then(({err,msg,data})=>{
    const action = {
      '200':()=>{
        postMessage('success',data)
      },
      '302':()=>{
        onMode('deposit')
      }
    };
    action[err] ? action[err]() : postMessage('fail',{msg:msg});
  })
}
// 刷新余额
const reFresh = ()=>{
  state.mode = 'quick';onSync();
}
const onClern = ()=>{
  state.code = []
}
// 验证支付
const onCalc = (n)=>{
  state.code.push(n);
  state.code.length == 6 && onPayment()
}
// apiFetch
const onFetch = (path,method,params)=>{
  state.mask = true;return fetch(`https://api.youloge.com/${path}`,{method:'post',headers:{ukey:state.ukey,lang:state.uage,"Content-Type": "application/json"},body:JSON.stringify({method:method,params:params})}).then(r=>r.json()).catch(err=>{
    postMessage('fail',{msg:'网络网关错误',err:err})
  }).finally(()=>{state.mask = false})
};
// 更换模式
const onMode = (mode)=>state.mode = mode;
const onClose = ()=>postMessage('close',{msg:'用户主动关闭支付'});
// postMessage
const postMessage = (method,params)=>{
  let {hash,referrer} = state
  window.parent.postMessage({ [hash]:{method:method,params:params} }, referrer)
}
const {profile,pass,word,code,sign,msg,host,mode,close,deposit,blur,paysign,account,selected,captcha,refPay,version} = toRefs(state)
</script>
<style lang="scss">
*{margin:0;padding: 0;box-sizing: border-box;}
.grecaptcha-badge{visibility: hidden;}
.stop{opacity: .5;pointer-events: none;}
.y-payment{
  position: relative;
  height: 100vh;
  background: #fffffff2;
  backdrop-filter: blur(4px);
  user-select: none;
  display: flex;
  flex-direction: column;
  .tips{
    color: #9e9e9e;
    font-size: 12px;
    text-align: center;
    margin: 5px;
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
  .money{
    background: #2196f3;
    padding: 10px;
    text-align: center;
    color: #fff;
    font-size: 22px;
  }
  .head{
    padding-left: 10px;
    padding-top: 10px;
    .title{
      color: #2e2e2e;
      font-size: 24px;
      font-weight: 400;
      margin-bottom: 10px
    }
  }
  .body{
    padding: 10px;
    flex: 1;
    overflow-y: scroll;
    background: #fff;
    .back{
      margin: 10px;
      background: #09F;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      color: #fff;
      cursor: pointer;
      border-radius: 5px;
    }
    .deposit{
      display: flex;
      height: 140px;
      .qrcode{
        width: 140px;
        height: 140px;
      }
      .right{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        .amount{
          border: 1px solid #eee;
          border-radius: 5px;
          &:hover{
            border: 1px solid #29e90f;
          }
        }
        .amount,.account{
          display: flex;
          align-items: center;
          word-break: keep-all;
          padding: 5px;
          height: 30px;
          label{
            color: #666;
          }
          input{
            width:100%;
            border: 0;
            outline: 0;
            color: #4caf50;
          }
        }
        .support{
          font-size: 14px;
          color: #444;
        }
      }
    }
    // 
    .profile{
      display: flex;
      align-items: center;
      border: 1px solid #eee;
      height: 70px;
      border-radius: 5px;
      margin: 5px 0;
      cursor: pointer;
      position: relative;
      &:hover{
        background: #fff;
      }
      .avatar{
        width: 70px;
        height: 70px;
        img{
          max-width: 100%;
        }
      }
      .mail{
        color: #999;
        font-size: 14px;
      }
      .name{
        color: #222;
        font-size: 16px;
      }
    }
  }
  .foot{
    font-size: 12px;
    position: sticky;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    .about{
      cursor: pointer;
      color: #03a9f4;
      text-decoration: none;
    }
    .source{
      color: #4caf50;
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
  }
}
form.y-form-payment {

  .form-item{
    position: relative;
    margin-bottom: 10px;
    input:valid + label::before,
    input:focus + label::before {
      line-height: 20px;
      font-size: 14px;
      top: -10px;
      background: #fff;
      padding: 0 6px;
      left: 9px;
    }
    input {
      text-align: center;
      width: 100%;
      line-height: 43px;
      padding: 0 15px;
      box-sizing: border-box;
      font-size: 14px;
      color: #222;
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    input[type='email']{
      text-transform: lowercase;
      letter-spacing: 0.2em;
    }
    input[type='text']{
      text-transform: uppercase; 
      letter-spacing: 1.0em;
    }
    input:focus {
      outline: 0;
      border-color: blue;
    }
    input:valid + label::before {
      content: attr(data-title);
    }
    input:focus + label::before {
      color: blue;
    }
    label::before {
      content: attr(title);
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 15px;
      line-height: 43px;
      font-size: 14px;
      color: #777;
      transition: 300ms all;
    }
    .form-item-svg{
      position: absolute;
      top: 0px;
      right: 0px;
      width: 52px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
  .form-button{
    display: flex;
    align-items: center;
    justify-items: center;
    flex-direction: column;
    button{
      margin: 10px;
      background: #09F;
      height: 40px;
      color: #fff;
      border-radius: 5px;
      width: 80%;
      border: 1px solid #09f;
      cursor: pointer;
    }
    button[type='submit']{
      background: #09F;
      color: #fff;
    }
    button[type='reset']{
      background: #fff;
      color: #09F;
    }
  }
}
.mask{
  opacity: 0.7;
  pointer-events: none;
  user-select: none;
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
.v-enter-active,.v-leave-active {
  transition: opacity 2.5s ease;
}
.v-enter-from,.v-leave-to {
  opacity: 0;
}
</style>