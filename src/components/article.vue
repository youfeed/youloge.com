<template>
  <div>
    <y-header aria="文章" aside="true"></y-header>
    <main class="article">
      <y-row>
        <y-col :span="12" sm="24" md="12" class="left">
          <div>文章标题</div>
          <!-- <y-rich :data="detail"></y-rich> -->
          <div v-html="detail" class="y-rich"></div>
        </y-col>
      </y-row>
    </main>
    <y-footer></y-footer>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, reactive, toRefs } from "vue";
const useFetch = inject('useFetch')
const state = reactive({ 
  uuid: "",
  title:'',
  description:'',
  profile:{},
  keyword:['开心','专业'],
  view:'',
  feed:[
    {
      uuid:'uuid',
      thum:'thum',
      title:'title',
      views:'123456',
      duration:'12354',
    }
  ],
  //
  detail:''
});
onMounted(()=>{
  let query = new URL(location.href).searchParams,uuid = query.get('s') || '';
  state.uuid = uuid;
  getInfo();
})
const getInfo = ()=>{
  useFetch().api('article','info',{uuid:state.uuid});
  getDetail();
  console.log(state.uuid)
}
// const _image = ({type,children,text})=>{
//   return type ? children.forEach(item=>{`_${type(item)}`}) : text
// }
const _render = ({type,children})=>{
  return type ? children.forEach(item=>{_render(item)}) : text
}

// 驼峰转换下划线 name.replace(/([A-Z])/g,"-$1").toLowerCase();
const html = computed(()=>{
  let json = state.detail;
  
  return json.map(item=>toRender(item)).join('');
})
const getDetail = ()=>{
  
  fetch('https://cdn.youloge.com/2.md?md2html/1#1').then(r=>r.text()).then(res=>{
    // state.detail = res.map(item=>toRender(item)).join('');
    state.detail = res
    highLight()
    console.log(res)
  })
  // https://cdn.youloge.com/T45LKrKrqJkv7UNf2gKD76RvJ8
}
const highLight = ()=>{
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/highlight.js/11.4.0/styles/dark.min.css";
  document.head.appendChild(link);
  // https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/??highlight.js/11.4.0/styles/dark.min.css
  const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/??highlight.js/11.4.0/highlight.min.js,highlightjs-line-numbers.js/2.8.0/highlightjs-line-numbers.min.js';
    script.onload = function(){
      hljs.highlightAll();
      hljs.initHighlightingOnLoad()
      hljs.initLineNumbersOnLoad()
      console.log(hljs)
    }
    document.body.append(script)
}
const {uuid,title,description,view,profile,keyword,feed,detail} = toRefs(state)
</script>

<style lang="scss">
.y-rich{
  font-weight: 400;
  line-height: 1.8;
  margin-bottom: 20px;
  word-break: break-word;
  position: relative;
  font-family: Georgia,Times New Roman,Times,Songti SC,serif;
  p{
    margin-bottom: 20px;
    word-break: break-word;
  }
  ul{
    list-style-type: disc;
    word-break: break-word;
    margin: 0 0 20px 20px;
  }
  blockquote{
    padding: 20px;
    background-color: #fafafa;
    border-left: 6px solid #e6e6e6;
    word-break: break-word;
    font-size: 16px;
    font-weight: normal;
    line-height: 30px;
    margin: 0 0 20px;
  }
  pres{
    position: relative;
    padding-left: 3.8em;
    counter-reset: linenumber;

    word-wrap: normal;
    word-break: break-all;
    white-space: pre;
    overflow-x: scroll;
    overscroll-behavior-x: contain;
    margin-top: 0;
    margin-bottom: 20px;
    border-radius: 4px;
    z-index: 0;
    padding: 1em;
    line-height: 1.5;
    color: #ccc;
    background: #2d2d2d;

    font-family: Consolas,Monaco,"Andale Mono","Ubuntu Mono",monospace;
    font-size: 12px;
    code{
      position: relative;
      white-space: inherit;
      overflow: hidden;
      padding: 0;
      background-color: transparent;
      color: inherit;
      white-space: pre;
      vertical-align: unset;
      counter-increment: linenumber;
      &:before {
        content: counter(linenumber);
        // content: '01.\A 02.\A 03.';
        position: absolute;
      }
    }
  }
  img{
    max-width: 100%;
  }
}
</style>