<template>
  <transition >
  <div :class="payment">
    <div class="head">
      <div class="title">收银台·Payment</div>
    </div>
    <div class="progress"><span class="rate"></span></div>

    <div class="money">
      <div class="total" v-text="onMoney"></div>
    </div>

    <div class="tips">1.选择支付账户 2.接收验证码 3.完成支付</div>
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
          <div class="amount">￥{{ item.wallet.amount }}</div>
        </div>
      </template>
      <div class="profile" @click="onMode('normal')">
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
        <div class="field">
          <input if="email" type="email" v-model="pass" required autocomplete="off" :class="passCls">
          <label for="email" title="邮箱" data-title="邮箱"></label>
        </div>
      </div>
      <div>
        <div class="field">
          <input type="text" v-model="word" required autocomplete="off" :class="wordCls">
          <label for="code" title="验证码" data-title="验证码"></label>
          <div :class="codeCls" @click="onCode">{{msg}}</div>
        </div>
      </div>
      <div>
        <div class="formitem">
          <div @click="onSubmit" :class="submCls">确认</div>
        </div>
      </div>
    </div>

    <div class="body" v-show="mode=='password'">
      <div class="password" @click="onClern">
        <div class="coded" v-text="onPassword"></div>
        <div class="clern">点击此处重置验证码</div>
      </div>
      <div class="calc">
        <div @click="onCalc(1)">1</div>
        <div @click="onCalc(2)">2</div>
        <div @click="onCalc(3)">3</div>
        <div @click="onCalc(4)">4</div>
        <div @click="onCalc(5)">5</div>
        <div @click="onCalc(6)">6</div>
        <div @click="onCalc(7)">7</div>
        <div @click="onCalc(8)">8</div>
        <div @click="onCalc(9)">9</div>
        <div @click="onCalc(0)">0</div>
      </div>
    </div>

    <div class="body" v-show="mode=='deposit'">
      <div class="back" @click="reFresh">返回·刷新余额</div>
      <div class="deposit">
        <div class="left">
          <img :src="qrcode" class="qrcode" :style="{filter: 'blur('+blur+'px)'}"/>
        </div>
        <div class="right">
          <div class="amount"><label for="deposit-number">金额：</label><input type="number" id="deposit-number" v-model="deposit" @focus="onFocusDeposit" @blur="onBlurDeposit" placeholder="0.01 - 3000元"></div>
          <div class="account"><label>账户：</label><input type="mail" placeholder="" readonly value="11247005@qq.com"></div>
          <div class="support">支持微信·支付宝扫码</div>
        </div>
      </div>
    </div>
    <div class="foot">
      <a class="about" href="//youfeed.github.io/payment" target="_blank">关于支付</a>
      <div class="source">来源:<span>{{host}}</span></div>
    </div>
    <div class="close" @click="onClose" v-show="close">
      <svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>
    </div>
  </div>
</transition>
</template>

<script setup>
import {reactive,onMounted, toRefs,computed} from 'vue'

const state = reactive({
  ukey:'',
  msg:'获取验证码',
  mask:false,
  mode:'quick',// quick normal password success fail deposit
  host:'未知',

  deposit:'10.00',
  blur:0,

  rand:'MisU',
  code:[],

  local:'', // 卖家
  money:'0.00', // 金额

  pass:'',
  word:'',
  sign:'',
  close:true,
  account:[],
  selected:{
    payment:{}
  },
  paysign:{}
})

onMounted(()=>{
  window.self === window.top ? location.href = '/' : onSync();
  // 接收初始参数
  window.addEventListener('message',event=>{
    let {origin,data} = event,{ukey,name,close,local,money} = data
    if(name === 'youloge.payment'){
      let {hostname} =  new URL(origin);
      state.host = hostname;state.ukey = ukey;state.close = close;state.local = local,state.money = money;
    }
  },false)
})
const onMoney = computed(()=>`￥ - ${Number(state.money || 0).toFixed(2)}`)
const payment = computed(()=>['y-payment',{'mask':state.mask}])
const passCls = computed(()=>['field',{'stop':state.sign !== ''}])
const wordCls = computed(()=>['field',{'stop':state.sign == ''}])
const submCls = computed(()=>['submit',{'stop':!(state.word.length == 6 && state.sign !== '')}])
const codeCls = computed(()=>{
  return ['next',{'stop':!((/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).exec(state.pass) && state.sign == '')}]
})
const onPassword = computed(()=>{
  let {code,paysign} = state;
  return code.length == 0 ? `****** ${paysign.random || ''}` : code.join(' - ');
})
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
const getStorage = (key)=>{
  let item = localStorage.getItem(key);
  return item && JSON.parse(item)
}
const setStorage = (key,val)=>{
  localStorage.setItem(key,JSON.stringify(val));
}
// 快速登录
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
// 确认登录
const onSubmit = ()=>{
  onFetch('login',{pass:state.sign,word:state.word}).then(res=>{
    let {err,msg,data} = res;
    if(err == 0){
      state.mode = 'quick';
      let index = state.account.findIndex(item=>item.uuid == data.uuid);
      index == -1 ?   state.account.unshift(data) : state.account[index] = data;
      setStorage('account',state.account);
    }else{
      state.hint = msg,state.word = '';
    }
  })
}
// 快捷支付 - 邮件
const onQuick = (item)=>{
  let {signer,wallet} = item,{ukey,local,money,host} = state;state.selected = item;
  wallet.amount < money ? onMode('deposit') : onFetch('paycode',{ukey:ukey,local:local,money:money,signer:signer,host:host}).then(res=>{
    state.paysign = res.data;
    res.err == 0 ? onMode('password') : postMessage('fail',{data:res.msg});
  })
}
// 确认支付
const onPayment = ()=>{
  let {paysign,code} = state,{signer} = paysign;
  onFetch('payenter',{code:code.join(''),signer:signer}).then(res=>{
    res.err == 0 ? postMessage('success',{data:res.data}) : postMessage('fail',{data:res.msg});
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
// 同步资料
const onSync = ()=>{
  let params = (getStorage('account') || []).map(item=>{
    return {signer:item.signer,wallet:true}
  })
  params.length > 0 && onFetch('sync',params).then(res=>{
    let {data} = res;setStorage('account',data)
    state.account = data
  }).catch()
}
const onMode = (mode)=>{
  state.mode = mode;
}
const onFetch = (method,params)=>{
  state.mask = true;
  return fetch('https://api.youloge.com',{method:'post',body:JSON.stringify({method:method,params:params})}).then(r=>r.json()).then(res=>{
    state.mask = false;return res
  }).catch(err=>{
    postMessage('fail',{msg:'网络网关错误',err:err})
  })
}
const onClose = ()=>{
  postMessage('close',{msg:'用户主动关闭支付'})
}
// postMessage
const postMessage = (emit,data)=>{
  window.parent.postMessage({ emit:emit,data }, '*')
}
const {pass,word,code,sign,msg,host,mode,close,deposit,blur,paysign,account,selected} = toRefs(state)
</script>

<style lang="scss">
*{margin:0;padding: 0;box-sizing: border-box;}
.grecaptcha-badge{visibility: hidden;}
.stop{opacity: .5;pointer-events: none;}
.y-payment{
  position: relative;
  height: 100vh;
  background: #f1f1f1;
  user-select: none;
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
    height: 200px;
    overflow: scroll;
    background: #fff;
    .back{
      color: #1b82d3;
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
    .password{
      height: 40px;
      text-align: center;
      .coded{
        font-size: 20px;
        line-height: 20px;
      }
      .clern{
        font-size: 12px;
        color: #999;
      }
    }
    .calc{
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      height: 120px;
      gap: 5px;
      background: #f1f1f1;
      border-radius: 5px;
      padding: 5px;
      animation: .5s all;
      font-size: 26px;
      div{
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        cursor: pointer;
        border-radius: 5px;
        &:hover{
          background: #ccc;
          border-radius: 10px;
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
      .amount{
        color: #f44336;
        position: absolute;
        right: 5px;
        top: 5px;
      }
    }
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
      margin-bottom: 5px;
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
  }
  .foot{
    font-size: 12px;
    right: 10px;
    position: absolute;
    bottom: 10px;
    left: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
.v-enter-active,
.v-leave-active {
  transition: opacity 2.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>