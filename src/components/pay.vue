<template>
  <div class="y-payment">
    <div class="head">
      <div class="title">支付金额</div>
      <div class="money">￥ {{money}}</div>
    </div>

    <div class="body">
      <div>No.{{uuid}}</div>
    </div>
    
    <div class="foot">
      <button @click="onRetry"> 重新尝试支付 </button>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, toRefs } from 'vue';
const state = reactive({
  money:'0.00',
  code:'',
  state:'',
  uuid:'',
  config:[], // 多渠道
  payment:{}
})
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
  WeixinJSBridge && WeixinJSBridge.invoke('getBrandWCPayRequest',{...payment})
  console.log('onRetry',payment)


}
// 微信支付
const onWeixin = ()=>{
  let {code,uuid,money} = state;
  let enURI = encodeURIComponent(location.href);
  let uri = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx87a7ba6752f6be0b&redirect_uri=${enURI}&response_type=code&scope=snsapi_base&state=weixin#wechat_redirect`
  code || (location.href = uri);
  code && onFetch('codepay',{appid:'wx87a7ba6752f6be0b',uuid:uuid,money:money,code:code}).then(payment=>{
    state.payment = payment
    WeixinJSBridge.invoke('getBrandWCPayRequest',{...payment},function(res){
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
  console.log('auth_code',auth_code)
  alert(JSON.stringify([auth_code]))
  auth_code && onFetch('codepay',{appid:'2017101909382003',uuid:uuid,money:money,code:auth_code}).then(payment=>{
    state.payment = payment
    AlipayJSBridge.call('tradePay',{...payment},function(res){
      console.log(res)
    })
  });
  // AlipayJSBridge.call("tradePay", {})
  console.log(e)
}
// 初始监听
onMounted(()=>{
  console.log('v1.1')
  let {code,auth_code,u,m} = onQuery();
  state.code = code;state.auth_code = auth_code;state.uuid = u;state.money = m;

  document.addEventListener('AlipayJSBridgeReady', onAlipay, false);
  document.addEventListener('WeixinJSBridgeReady', onWeixin, false);
})
const {uuid,code,money,uri} = toRefs(state)
</script>
<style lang="scss">
*{margin: 0;padding: 0;}
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
}
</style>