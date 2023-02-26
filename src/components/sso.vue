<template>
  <div class="sso">
    <div class="head">
      <div class="title">登录·注册</div>
      <div class="source">快捷登录:<span>{{host}}</span></div>
      <div class="close" @click="onClose">x</div>
    </div>

    <div class="quick" v-show="mode=='quick'">
      <div>
        <div>
          <div>头像 昵称 邮箱 </div>
        </div>
      </div>
    </div>

    <div class="body">

      <div>
        <div class="formitem">
          <div class="field">
            <input type="email" v-model="pass" required autocomplete="off" :class="passCls" list="mailist">
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
      <div>关联账户</div>
    </div>
    <datalist id="mailist">
      <block v-for="(item,index) in onOption" v-bind:key="index">
        <option :value="item.value" :data-suffix="item"></option>
      </block>
    </datalist>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, toRefs } from "vue";

const state = reactive({
  ak:'',
  msg:'获取验证码',
  mode:'normal',// quick
  host:'',
  local:[],
  pass:'',
  word:'',
  sign:'',
  mailist:['@qq.com','@gmail.com','@163.com','@126.com','@live.com','@icloud.com','@outlook.com'],
})
onMounted(()=>{
  let account = localStorage.getItem('account');
  if(account == null){
    state.mode = 'normal'
  }
  // 批量同步 uuid：token

  console.log(account)
  // if(){}
  // authorized
  // 接收初始参数
  window.addEventListener('message',event=>{
    let {origin,data} = event,{name,ak} = data
    if(name === 'youloge.sso'){
      let {hostname} =  new URL(origin);
      state.host = hostname;state.ak = ak;
      console.log(2334,event)
    }
  },false)
})
const onFetch = (method,params)=>{
  return fetch('//api.youloge.com',{method:'post',body:JSON.stringify({method:method,params:params})}).then(r=>r.json()).then(res=>{
    return res
  }) 
}
const passCls = computed(()=>{
  return ['field',{'stop':state.sign !== ''}]
})
const codeCls = computed(()=>{
  return ['next',{'stop':!((/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).exec(state.pass) && state.sign == '')}]
})
const wordCls = computed(()=>{
  return ['field',{'stop':state.sign == ''}]
})
const submCls = computed(()=>{
  return ['submit',{'stop':!(state.word.length == 6 && state.sign !== '')}]
})
const onOption = computed(()=>{
  let {pass} = state,[prefix] = pass.split('@');
  return state.mailist.map(is=>{
    return {value:`${prefix}${is}`,suffix:is}
  })
})
// 快捷登录
const onQuick = ()=>{

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
  console.log('onCode')
}
const onSubmit = ()=>{
  onFetch('login',{pass:state.sign,word:state.word}).then(res=>{
    let {err,msg} = res;
    if(err == 300){
      state.hint = msg
      state.word = ''
    }else{
      let {access,expire} = res.data
      localStorage.setItem('token',access)
      localStorage.setItem('expire',expire)
      props.onClose()
      props.onSuccess()
    }
  })
}

// 授权签名 - 统一返回
const onSign = ()=>{
  postMessage('success',{uuid:'uuid'})
}
const onClose = ()=>{
  postMessage('close',{msg:'用户主动取消登录'})
}
// postMessage
const postMessage = (emit,data)=>{
  window.parent.postMessage({
    emit:emit,
    data
  }, '*')
}
const {msg,host,mode,pass,word,local,mailist} = toRefs(state)
</script>

<style lang="scss">
*{margin: 0;padding: 0;}
.grecaptcha-badge{visibility: hidden;}
.sso{
  padding: 10px;
  .stop{
    opacity: .5;
    pointer-events: none;
  }
  .head{
    position: relative;
    .title{
      color: #202124;
      font-size: 24px;
      font-weight: 400;
    }
    .source{
      border-top: 1px solid #bfb8b8;
      text-align: center;
      padding: 10px 0;
      span{
        color: #fff;
        background: #318f34;
        border-radius: 4px;
        padding: 0px 4px;
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
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 1px #333;
      line-height: 30px;
      vertical-align: middle;
      border-radius: 50%;
      transform: rotate(-90deg);
    }
  }
  .body{
    .next{position: absolute;top: 10px;right: 10px;color: #2E77E5;font-size: 12px; padding: 5px;}
    .label-before,
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
    }
  }
}
</style>