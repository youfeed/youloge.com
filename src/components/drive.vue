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
            <span>{{sized}}</span>
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
            <span>资源外链</span>
            <span class="copylink">点击复制外链</span>
          </div>
        </div>
        <div class="foot">
          <div class="down">
            <div class="left">
              <img :src="qrcode">
              <a href="javascript:;" v-login="shareing" class="share">获得推广外链</a>
            </div>
            <div class="right">
              <div class="cost">￥ <em>{{cost}}</em> 元(24小时下载权限)</div>
              <div class="load" v-login="download">
                <div>立即下载(无限速)</div>
                <p>有效期内重复点击下载不收费</p>
              </div>
            </div>
          </div>
          <div class="rule">
            <ul>
              <li>文件标识：{{ uuid }}</li>
              <li>来源标识：{{ owner }}</li>
              <li>哈希标识：{{ etag }}</li>
              <li>·</li>
              <li>但行好事 莫问前程</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
    <y-footer></y-footer>
  </div>
</template>

<script setup>
import { computed, inject,onMounted,reactive,ref,toRefs } from 'vue';
const useFetch = inject('useFetch'), useDialog = inject('useDialog'),useMessage = inject('useMessage');
const usePayment = inject('usePayment');
let state = reactive({
  uuid:'',
  title:'',
  description:'',
  ext:'',
  mime:'',
  etag:'',
  size:'',
  cost:'',
  owner:'',
  created:'',
  updated:'',
  record:{},
  downsign:null
})

onMounted(()=>{
  let {uuid} = document.querySelector('#app').dataset;
  uuid ? useFetch().api('drive',{uuid:uuid}).then(({err,msg,data})=>{
    err == 0 ? Object.assign(state, data): useMessage().warning(msg)
  }) : useDialog({title:'云文件过期或失效',content:'当前文件无法提供'}).alert().then()
})
const sized = computed(()=>`${(state.size / 1024 / 1024).toFixed(2)} Mb`)
// 二维码
const qrcode = computed(()=>{
  let data = encodeURIComponent(`https://youloge.com/${state.uuid}?share=none`)
  return `https://qun.qq.com/qrcode/index?data=${data}`
})
// 复制外链
const onCopy = ()=>{
  let {uuid,title,mime,created} = state;
  return [`文件：${title}`,`大小：${sized.value}`,`类型：${mime}`,`时间：${created}`,`地址：youloge.com/${uuid}`].join('\r\n');
}
// 创建下载
const createURL = ()=>{
  let {downsign,title,ext} = state,attname = `${title}.${ext}`;
  useDialog({title:'下载文件',content:`大小：${sized.value} - 24小时无限制下载`}).alert().then(res=>{
    var ele = document.createElement('a');
    ele.download = attname;
    ele.style.display = 'none';
    ele.href = `${downsign}&attname=${attname}`;
    document.body.appendChild(ele);
    ele.click();
    document.body.removeChild(ele);
  }).catch(err=>{
    useMessage().warning('关闭下载')
  })
}
// 推广分享
const shareing = ()=>{  
  useMessage().warning('推广分享内测中')
}
// 获取下载
const download = ()=>{
  let {uuid,downsign} = state;
  downsign == null ? useFetch({mask:true}).vip('drive_within',{uuid:uuid}).then(res=>{
    res.err == 0 ? (state.downsign = res.data,createURL()) : (useMessage().warning(res.msg),onPayment());
  }) : createURL()
}
// 调起支付
const onPayment = ()=>{
  let {cost,uuid} = state
  usePayment({
    local:uuid, // 商品ID
    money:cost, // 金额
  }).pay().then(res=>{
    onEnter(res)
    console.log('res',res)
  }).catch(err=>{
    console.log('err',err)
    useMessage().warning(err.msg)
  });
}
// 确认支付
const onEnter = (data)=>{
  useFetch({mask:true}).vip('drive_payment',data).then(res=>{
    res.err == 0 ? (state.downsign = res.data,createURL())  : useMessage().warning(res.msg);
  })
}
const {uuid,title,description,ext,mime,etag,size,cost,owner,created,updated} = toRefs(state)
</script>

<style lang="scss">
.document{
  max-width: 600px;
  margin: 40px auto;
  font-family: math;
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
    margin: 10px 0;
    .item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      border-bottom: 1px dotted #999;
      &::after{
        border: 1px solid #333;
      }
      .copylink{
        cursor: pointer;
        color: #70a3ff;
        user-select: none;
      }
    }
  }
  .foot{
    padding: 20px 10px;
    background: #eee;
    border-radius: 5px;
    .down{
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .left{
        background: #fff;
        padding-bottom: 10px;
        text-align: center;
        .share{
          display: block;
          color: blue;
          text-decoration: none;
        }
      }
      .right{
        .cost{
          color: #FF5722;
          em{
            font-size: 24px;
            font-style: normal;
            color: #f00;
          }
        }
        .load{
          background: #0080ff;
          padding: 5px 10px;
          margin-top: 10px;
          border-radius: 5px;
          text-align: center;
          color: #fff;
          cursor: pointer;
          user-select: none;
          div{
            font-weight: 600;
            font-size: 18px;
          }
          p{
            font-size: 12px;
            color: #eee;
          }
          &:hover{
            opacity: .7;
          }
        }
      }
      .left{

        img{
          height: 100px;
        }
      }
    }
    .rule{
      ul{
        list-style: none;
        font-family: monospace;
        margin-top: 20px;
        color: #999;
        text-align: center;
        list-style: none;
      }
    }
  }
}
</style>