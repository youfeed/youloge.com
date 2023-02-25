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
            <span>时间</span>
            <span>mp4</span>
          </div>
          <div class="item">
            <span>时间</span>
            <span>{{created}}</span>
          </div>
          <div class="item">
            <span>售价</span>
            <span>{{cost}}</span>
          </div>
        </div>
        <div class="foot">
          <button v-login="download">立即下载</button>
          <div class="tip">支付成功后 24小时内可无限制下载</div>
        </div>
      </div>
    </main>
    <y-footer></y-footer>
  </div>
</template>

<script setup>
import { inject,reactive,toRefs } from 'vue';
const useFetch = inject('useFetch')
const data = reactive({
  uuid:'2333',
  title:'sadawf',
  description:'adawdaf',
  mime:'265',
  size:'265',
  cost:'12',
  created:'16156'
})
useFetch.api('document',{uuid:'PHT7MtdGcbKd1AG4yxgs3Dd71qV1L'}).then(res=>{
  console.log(res)
})

const download = ()=>{
  console.log('quxiaz')
}

const {uuid,title,description,mime,size,cost,created} = toRefs(data)
console.log(useFetch)
</script>

<style lang="scss">
.document{
  max-width: 600px;
  margin: 40px auto;
  .box{
    box-shadow: 0px 0px 4px #9e9e9e;
    padding: 5px;
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