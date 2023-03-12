<template>
  <div>
    <y-header aria="云盘" aside="true"></y-header>
    <main class="document">
      <div class="box">
        <div class="head">
          <span>{{title}}<em>.{{ext}}</em></span></div>
        <div class="body">
          <div class="item">
            <span>类型</span>
            <span>{{mime}}</span>
          </div>
          <div class="item">
            <span>大小</span>
            <span>{{size}}</span>
          </div>
          <div class="item">
            <span>创建时间</span>
            <span>{{created}}</span>
          </div>
          <div class="item">
            <span>更新时间</span>
            <span>{{updated}}</span>
          </div>
          <div class="item" v-copy="onCopy">
            <span>复制外链</span>
            <span title="登录状态下:默认复制推广外链">点击复制外链</span>
          </div>
        </div>
        <div class="foot">
          <div class="down">
            <div class="left" title="用户通过你的推广外链下载可获得奖励">
              <img :src="qrcode">
              <p>文件二维码</p>
            </div>
            <div class="right">
              <button v-login="download">登录下载</button>
              <button v-login="download">临时下载</button>
            </div>
          </div>
          <div class="tip">支付成功后 24小时内可无限制重复下载<br>有效期内一个资源只会支付一次</div>
        </div>
      </div>
    </main>
    <y-footer></y-footer>
  </div>
</template>

<script setup>
import { computed, inject,onMounted,reactive,toRefs } from 'vue';
const useFetch = inject('useFetch'), useDialog = inject('useDialog'),useLoading = inject('useLoading');
console.log()
let state = reactive({
  uuid:'',
  title:'',
  description:'',
  ext:'',
  mime:'',
  etag:'',
  size:'',
  cost:'',
  created:'',
  updated:'',
})
const qrcode = computed(()=>{
  let data = encodeURIComponent(`https://youloge.com/${state.uuid}?share=none`)
  return `https://qun.qq.com/qrcode/index?data=${data}`
})
const onCopy = ()=>{
  let {uuid,title,size,mime,created} = state;
  let text = [`文件名：${title}`,`大小：${size}`,`类型：${mime}`,`创建时间：${created}`,`地址：youloge.com/${uuid}`];
  return text.join('\r\n');
}
onMounted(()=>{
  let {uuid} = document.querySelector('#app').dataset;state.uuid = uuid;
  uuid ? useFetch().api('drive',{uuid:uuid}).then(res=>{
    let {err,data} = res
    err == 0 ? Object.entries(data).forEach(([key,val])=>{
      state[key] = val
    }): console.log(res)
    console.log(state)
  }) : useDialog({title:'云文件过期或失效',content:'当前文件无法提供'}).alert().then()
})
// console.log('useDialog',useLoading())
const download = ()=>{
  // useDialog({title:'支付确认',content:'您需要支付 0.01 元'}).alert()
  // useDialog({title:'余额不足',content:'前往个人中心-钱包 充值'}).confirm()
  useDialog({title:'随机支付',content:'支付任意金额即可下载'}).prompt({type:'number',placeholder:'0.01~5000'})
  console.log('quxiaz')
}
const {uuid,title,description,ext,mime,etag,size,cost,created,updated} = toRefs(state)
</script>

<style lang="scss">
.document{
  max-width: 600px;
  margin: 40px auto;
  .box{
    box-shadow: 0px 0px 4px #9e9e9e;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
  }
  .head{
    text-align: center;
    font-size: 24px;
    height: 50px;
    border-bottom: 1px solid #999;
    em{
      color: #4caf50;
      text-transform: uppercase;
      font-style: normal;
    }
  }
  .body{
    display: inline;
    .item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      border-bottom: 1px dotted #999;
      &::after{
        border: 1px solid #333;
      }
    }
  }
  .foot{
    margin: 20px 0;
    text-align: center;
    .down{
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      height: 150px;
      .right{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        height: 100%;
      }
      .left{

        img{
          height: 120px;
        }
      }
    }
    button{
      border: 0;
      outline: 0;
      padding: 5px 8px;
      background: #4caf50;
      border-radius: 5px;
      font-size: 16px;
      color: #fff;
    }
    .tip{
      font-size: 12px;
      color: #999;
      margin-top: 16px;
    }
  }
}
</style>