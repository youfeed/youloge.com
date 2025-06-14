<!-- 文章预览 -->
<template>
  <template v-if="err == 0">
    <div class="flex items-center justify-center h-screen-sm">
      <div class="i-line-md:loading-twotone-loop font-size-2xl  w-20 h-20 color-gray-400"></div>
    </div>
  </template>
  <template v-if="err == 200">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="navbar">navbar</div>
      <div class="article">
        <div class="title">
          <h1>{{ data.title }}</h1>
        </div>
        <div class="meta m-b-5">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4"><img :src="useImage(data.account.avatar,'80')" :alt="data.account.name" class="w-full h-full rounded-full" /></div>
            <div>
              <router-link :to="`/${data.account.user}`" class="no-underline color-blue-500">{{ data.account.name }}<span>@{{ data.account.user }}</span></router-link>
            </div>
            <div> · {{ data.created }}</div>
          </div>
        </div>
        <div class="RichText" v-html="html"></div>
        <div class="m-t-5">
          最后更新于:{{ data.updated }} - {{ data.view }} 次浏览
        </div>
        <div class="discuss m-t-10">
          <you-discuss mode="article" :code="params.uuid"></you-discuss>
        </div>
      </div>
    </div>
    <div class="asider">asider</div>
  </template>
  <template v-else>
    <div class="mx-auto px-4 py-16 flex-grow flex flex-col items-center justify-center">
      <h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold text-gray-800 mb-4 text-shadow">页面不见了</h1>
      <div class="font-size-2xl  w-80 h-40 color-gray-400">{{ msg }}</div>
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <a href="javascript:history.back()" class=" px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
           返回上一页
        </a>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-lg mx-auto">
        <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <i class="fa fa-lightbulb-o text-accent mr-2"></i> 您可以尝试以下操作:
        </h3>
        <ul class="text-gray-600 space-y-2 text-left">
          <li class="flex items-start">
            <i class="fa fa-check-circle text-secondary mt-1 mr-2"></i>
            <span>检查URL拼写是否正确</span>
          </li>
          <li class="flex items-start">
            <i class="fa fa-check-circle text-secondary mt-1 mr-2"></i>
            <span>使用网站导航查找所需内容</span>
          </li>
          <li class="flex items-start">
            <i class="fa fa-check-circle text-secondary mt-1 mr-2"></i>
            <span>刷新页面尝试重新加载</span>
          </li>
        </ul>
      </div>
    </div>
  </template>
</template>

<script setup>
const route = useRoute()
const state = reactive({
  uuid:'',
  err:0,
  msg:'',
  params:{},
  html:'',
  data:{},
  cursor:Number.MAX_SAFE_INTEGER,
  // 发布者信息
  anthor:{}
}),{uuid,err,msg,html,data,params} = toRefs(state);
// 获取数据
const getInfo = ()=>{
  let {uuid} = state.params;
  apiFetch('article/info',{uuid:uuid}).then(res=>{
    Object.assign(state,res);
    res.err == 200 && getRich();
  }).catch((err)=>{
    state.err = err.err;
    state.msg = err.msg;
  })
}
// 获取内容
const getRich = ()=>{
  let {rich} = state.data;
  fetch(rich).then(r=>r.text()).then(text=>{
    state.html = text;
  })
}
// 获取作者
const getAnthor = ()=>{
  let {uuid} = state.params; 
}
// 获取评论
const getComment = ()=>{
  let {uuid} = state.params; 
}

onMounted(()=>{
  state.params = route.params;
  console.log('onMounted',state.params);
  getInfo();
})
</script>

<style lang="scss">
.RichText {
  /* 基础重置 */
  body, h1, h2, h3, h4, h5, h6, p, blockquote, pre, dl, dd, ol, ul, figure, hr, fieldset, legend {
    margin: 0;
    padding: 0;
  }

  /* 文本对齐 */
  .text-left { text-align: left; }
  .text-center { text-align: center; }
  .text-right { text-align: right; }

  /* 列表 */
  ul, ol {
    margin: 1em 0;
    padding-left: 2em;
  }

  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }

  /* 表格 */
  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  /* 链接 */
  a {
    color: #007bff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  /* 图像 */
  img {
    max-width: 100%;
    height: auto;
  }

  /* 引用 */
  blockquote {
    border-left: 4px solid #ccc;
    padding: 1em;
    margin: 1em 0;
    background-color: #f9f9f9;
  }

  /* 段落 */
  p {
    margin: 1em 0;
    line-height: 1.6;
  }

  /* 标题 */
  h1, h2, h3, h4, h5, h6 {
    margin: 1em 0;
  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.17em;
  }

  h4 {
    font-size: 1em;
  }

  h5 {
    font-size: 0.83em;
  }

  h6 {
    font-size: 0.67em;
  }

  /* 代码块 */
  pre, code {
    font-family: monospace;
    background-color: #f4f4f4;
    padding: 0.5em;
    border-radius: 4px;
  }

  pre {
    overflow-x: auto;
  }
}
</style>