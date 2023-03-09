<template>
  <div :class="['y-payment',{'mask':!payment}]">
    <div class="head">
      <div class="title">支付金额</div>
      <div class="money" v-text="onMoney"></div>
    </div>

    <div class="body">
      <div>No.{{uuid}}</div>
    </div>
    
    <div class="foot">
      <button @click="onRetry"> 重新尝试支付 </button>
    </div>
    <div class="version">{{ version }}</div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue';
const state = reactive({
  version:'V 1.08',
  money:0,
  code:'',
  state:'',
  uuid:'',
  config:[], // 多渠道
  payment:null
})
const onMoney = computed(()=>`￥ - ${state.money.toFixed(2)}`)
// 微信支付宝直接支付 银行卡支付不在这里
const onQuery = ()=>{
  let query = {};new URL(location.href).searchParams.forEach((value, key)=>{
    query[key] = value
  });return query
}
const onFetch = (method='',params={})=>{
  let body = {method:method,params:params};
  return fetch('https://api.youloge.com',{method:'post',body:JSON.stringify(body)}).then(r=>r.json()).then(r=>{ return r; }).catch(e=>{ return e; })
}
// 重新尝试支付
const onRetry = ()=>{
  let {uuid,number,code,payment} = state;
  WeixinJSBridge && WeixinJSBridge.invoke('getBrandWCPayRequest',{...payment},function({err_msg}){
    err_msg == 'get_brand_wcpay_request:ok' && onClose()
  })
  AlipayJSBridge && AlipayJSBridge.call('tradePay',{...payment},function({resultCode}){
    resultCode == '9000' && onClose()
  })
  console.log('onRetry',payment)
}
// 微信支付
const onWeixin = ()=>{
  let {code,uuid,money} = state;
  let enURI = encodeURIComponent(location.href);
  let uri = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx87a7ba6752f6be0b&redirect_uri=${enURI}&response_type=code&scope=snsapi_base&state=weixin#wechat_redirect`
  code || (location.href = uri);
  code && onFetch('codepay',{appid:'wx87a7ba6752f6be0b',uuid:uuid,money:money,code:code}).then(payment=>{
    state.payment = payment;history.pushState({},null,'/');
    WeixinJSBridge.invoke('getBrandWCPayRequest',{...payment},function({err_msg}){
      err_msg == 'get_brand_wcpay_request:ok' && onClose()
      console.log(res)
    })
  });
} 
// 支付宝支付
const onAlipay = (e)=>{
  let {auth_code,uuid,money} = state;
  
  let enURI = encodeURIComponent(location.href);
  let uri = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017101909382003&scope=auth_base&redirect_uri=${enURI}&state=alipay#alipay_redirect`
  auth_code || (location.href = uri);
  auth_code && onFetch('codepay',{appid:'2017101909382003',uuid:uuid,money:money,code:auth_code}).then(payment=>{
    state.payment = payment;history.pushState({},null,'/');
    AlipayJSBridge.call('tradePay',{...payment},function({resultCode}){
      resultCode == '9000' && onClose()
      console.log(resultCode)
    })
  });
}

// 统一关闭
const onClose = ()=>{
  WeixinJSBridge && WeixinJSBridge.invoke('closeWindow');
  AlipayJSBridge && AlipayJSBridge.call('popWindow');
}
// 初始监听
onMounted(()=>{
  let {code,auth_code,u,m} = onQuery();
  state.code = code;state.auth_code = auth_code;state.uuid = u;state.money = m;
  (typeof WeixinJSBridge == "undefined" && typeof WeixinJSBridge == "undefined") && (location.href = '/');
  document.addEventListener('AlipayJSBridgeReady', onAlipay, false);
  document.addEventListener('WeixinJSBridgeReady', onWeixin, false);
})
const {uuid,code,money,version,payment} = toRefs(state)
</script>
<style lang="scss">
*{margin: 0;padding: 0;}
.mask{
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
}
.y-payment{
  max-width: 400px;
  margin: 0 auto;
  .head{
    text-align: center;
    margin-top: 20px;
    .title{
      color: #333;
    }
    .money{
      font-size: 22px;
      margin: 10px 0;
    }
  }
  .body{
    color: #707070;
    text-align: center;
    margin: 20px 0;
  }
  .foot{
    text-align: center;
    margin-top: 30px;
    button{
      outline: 0;
      border: 0;
      padding: 10px 30px;
      background: #4caf50;
      color: #fff;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .version{
    position: fixed;
    bottom: 10px;
    left: 10px;
    color: #aaa;
    font-size: 12px;
  }
}
</style>