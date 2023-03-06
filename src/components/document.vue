<template>
  <div>
    <y-header aria="云盘" aside="true"></y-header>
    <main class="document">
      <div class="box">
        <div class="head">
          <span>文件名：xxxxxxxxxxxx<sub>MP4</sub></span></div>
        <div class="body">
          <div class="item">
            <span>类型</span>
            <span>mime</span>
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
          <div class="item" v-copy>
            <span>复制外链</span>
            <span title="登录状态下:默认复制推广外链">点击复制外链</span>
          </div>
        </div>
        <div class="foot">
          <div class="down">
            <div class="left" title="随机售价:最低仅需0.01元即可下载">
              <img src="https://qun.qq.com/qrcode/index?data=https://www.youloge.com/j22bBcXUBGHd1y2BQsfCG2RTgoPoh?cost=0.01">
              <p>固定售价:{{cost}}</p>
              <p>随机售价:{{cost}}</p>
            </div>
            <div class="right">
              <button v-login="download">登录下载</button>
              <button v-login="download">临时下载</button>
            </div>
          </div>
          <div class="tip">支付成功后 24小时内可无限制下载<br>临时下载可凭订单号在下载中心重复下载</div>
        </div>
      </div>
    </main>
    <y-footer></y-footer>
  </div>
</template>

<script setup>
import { inject,onMounted,reactive,toRefs } from 'vue';
const useFetch = inject('useFetch'), useDialog = inject('useDialog'),useLoading = inject('useLoading');
console.log()
const data = reactive({
  uuid:'2333',
  title:'sadawf',
  description:'adawdaf',
  mime:'265',
  size:'265',
  cost:'12',
  created:'16156',
  updated:'16156',
})
onMounted(()=>{
  console.log(RAWDATA)
  // useLoading().show()
})
useFetch().api('document',{uuid:'PHT7MtdGcbKd1AG4yxgs3Dd71qV1L'}).then(res=>{
  console.log(res)
})
console.log('useDialog',useLoading())
const download = ()=>{
  // useDialog({title:'支付确认',content:'您需要支付 0.01 元'}).alert()
  // useDialog({title:'余额不足',content:'前往个人中心-钱包 充值'}).confirm()
  useDialog({title:'随机支付',content:'支付任意金额即可下载'}).prompt({type:'number',placeholder:'0.01~5000'})
  console.log('quxiaz')
}

const {uuid,title,description,mime,size,cost,created} = toRefs(data)
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