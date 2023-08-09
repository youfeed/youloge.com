<template>
  <div class="welcome">
    <div class="platform">
      <div>开放平台入口<sup>th</sup></div>
    </div>
    <div class="topic">
      <div class="logo">
        <y-icon type="loge"></y-icon>
        Youloge<sup>杰克布达</sup>
      </div>
      <div class="log">
        <div>V0.12 新增云盘  2022-12-13</div>
        <div>V0.12 新增云盘  2022-12-13</div>
        <div>V0.12 新增云盘  2022-12-13</div>
        <div>V0.12 新增云盘  2022-12-13</div>
        <div>升级日志</div>
      </div>
      <div class="link">
        <y-link class="box">
          <y-icon type="loge"></y-icon>
          <span>云盘</span>
        </y-link>
        <y-link class="box">
          <y-icon type="loge"></y-icon>
          <span>视频</span>
        </y-link>
        <y-link class="box">
          <y-icon type="loge"></y-icon>
          <span>文章</span>
        </y-link>
        <y-link class="box">
          <y-icon type="loge"></y-icon>
          <span>购物</span>
        </y-link>
        <y-link class="box">
          <y-icon type="loge"></y-icon>
          <span>聊天</span>
        </y-link>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>
<script setup>
import { inject, onMounted, reactive, toRefs } from 'vue'
const useFetch = inject('useFetch')
const usePayment = inject('usePayment')
console.log(0,usePayment.version)
const state = reactive({
  uuid:'',
  data:{
    cost:''
  }, 
  name:'',
  mime:'',
  size:'',
  cost:'',
})
onMounted(()=>{
  let uuid = location.pathname.substr(1)
  state.uuid = uuid
  console.log(uuid)
  usePayment().pay({local:'5',money:'0.01'}).then(res=>{
    console.log(111,res)
  }).catch(e=>{
    console.log(2222,e)
  })
  useFetch({mask:true}).api('document',{uuid:uuid}).then(res=>{
    state.data = res.data
  })
})
const onDown = ()=>{
  let {uuid} = state;
  useFetch().vip('document_download',{uuid:uuid}).then(res=>{
    console.log(res)
  })
  console.log('onDown')
}
const onHello = ()=>{
  console.log('onHello')
}

const {uuid,name,mime,size,data} = toRefs(state)
</script>
<style lang="scss">
.welcome{
  position: relative;
  overflow: hidden;
  padding: 152px 0 112px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  color: #f5f5f5;
  .mask{
    background-color: #2aae67;
    position: absolute;
    height: 100%;
    bottom: 0;
    width: 150%;
    z-index: -1;
    border-radius: 0 0 50% 50%;
  }
  .platform{
    position: absolute;
    color: #e5e5e5;
    top: 10px;
    right: 10px;
    font-size: 18px;
    font-weight: 700;
  }
  .logo{
    font-size: 40px;
    margin: 20px 0;
    padding: 20px 0;
    border-bottom: 1px solid #ababab;
    sup{
      font-size: 12px;
    }
  }
  .log{
    margin: 40px 0;
  }
  .link{
    display: grid;
    gap: 10px;
    font-size: 16px;
    grid-template-columns: repeat(3, 33.33%);
    a{
      border-radius: 50%;
      background: #ffffff12;
      width: 120px;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    i{
      font-size: 30px;
    }
  }
}
</style>
