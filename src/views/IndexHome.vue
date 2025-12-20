<template>
    <!-- 导航栏 -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo -->
                <div class="flex items-center">
                    <a href="#" class="flex items-center space-x-2">
                        <svg class="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.161 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z">
                            </path>
                        </svg>
                        <span class="text-xl font-bold text-secondary">Youloge</span>
                    </a>
                </div>

                <!-- 主导航 - 桌面端 -->
                <nav class="hidden md:flex items-center space-x-8">
                    <router-link to="video" class="text-gray-600 hover:text-primary transition-colors">视频</router-link>
                    <router-link to="article"
                        class="text-gray-600 hover:text-primary transition-colors">新闻</router-link>
                    <router-link to="goods" class="text-gray-600 hover:text-primary transition-colors">购物</router-link>
                    <router-link to="drive" class="text-gray-600 hover:text-primary transition-colors">网盘</router-link>
                </nav>

                <!-- 登录/注册按钮 -->
                <div class="flex items-center space-x-4">
                    <a href="javascript:;" @click="onLogin"
                        class="hidden md:block text-gray-100 bg-gray-800 px-2  py-3 hover:bg-gray-600 rounded-sm hover:text-gray-200 transition-colors">登录·注册</a>
                    <!-- 移动端菜单按钮 -->
                    <a href="javascript:;" @click="onLogin" class="md:hidden text-gray-600 ">
                        <YouIcon name="mdi-light:menu" size="40" color="gray"></YouIcon>
                    </a>
                </div>
            </div>
        </div>
    </header>
    <main class="">
        <!-- 英雄区域 -->
        <section class="bg-gradient-to-b from-neutral to-white py-16 md:py-24">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="max-w-4xl mx-auto text-center">
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary mb-6 leading-tight">
                        为开发者打造的<br class="md:hidden">基建服务平台
                    </h1>
                    <p class="text-xl text-gray-600 mb-8 text-balance" @click="onCaptcha">
                        快速、零权限、零成本
                    </p>
                    <!-- 快速统计 -->
                    <div class="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-500">
                        <div><span class="font-semibold text-secondary">100M+</span> 注册用户</div>
                        <div><span class="font-semibold text-secondary">40M+</span> 专栏文章</div>
                        <div><span class="font-semibold text-secondary">190+</span> 音视频电影</div>
                        <div><span class="font-semibold text-secondary">190+</span> 分享资源</div>
                    </div>
                </div>
            </div>
        </section>
        <!-- 特性展示 -->
        <section id="features" class="py-16 md:py-24">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold text-secondary mb-4">为什么选择 Youloge?</h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                        接口免费、资源共享、开源可控、完整权限
                    </p>
                </div>
            </div>
            <!-- 宫格卡片 -->
            <div class="grid md:grid-cols-2 gap-8 px-4">
                <!-- 特性卡片 1 -->
                <div class="bg-white p-8 rounded-lg border border-gray-200 card-hover">
                    <div class="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-6">
                        <YouIcon name="carbon:code" size="40" color="primary"></YouIcon>
                    </div>
                    <h3 class="text-xl font-semibold mb-3 text-secondary">
                        <a href="https://s.apifox.cn/7302e0d5-18da-4730-adc5-4b532b346923" target="_blank">API接口&#8594;</a>
                    </h3>
                    <p class="text-gray-600">
                        开放所有接口、服务API请求方式
                    </p>
                </div>
                <!-- 特性卡片 2 -->
                <div class="bg-white p-8 rounded-lg border border-gray-200 card-hover">
                    <div class="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-6">
                        <YouIcon name="carbon:mac-command" size="40" color="primary"></YouIcon>
                    </div>
                    <h3 class="text-xl font-semibold mb-3 text-secondary">
                        <a href="https://docs.youloge.com/" target="_blank">
                            文档中心&#8594;
                        </a>
                    </h3>
                    <p class="text-gray-600">
                        平台配套组件服务
                    </p>
                </div>
                <!-- 特性卡片 4 -->
            </div>
        </section>
        <!-- 行动召唤 -->

    </main>
    <footer class=" border-0 border-solid border-t-1 border-gray-300 w-full">
        <div class="mt-2 text-center text-gray-500">
            <a href="https://beian.miit.gov.cn/" class="text-gray no-underline">
                <p>ICP备案/许可证号：皖ICP备19004549号</p>
            </a>
            <p>皖公安备 34112402000344</p>
        </div>
    </footer>
</template>
<script setup>
const { success, warning, error, info } = useMessage();
const useYouPlus = YouPlus({
    // debug: 'http://localhost:4173/'
});
console.log('captcha',useYouPlus)
const state = reactive({
    color: '#23ca92', hover: {},
    width: 0, height: 0,
    socket: null,
    pixels: [],
    canvas: null,
    ctx: null,
    isDragging: false,
    initialX: 0,
    initialY: 0,
    currentX: 0,
    currentY: 0,
    scale: 1,
    initialScale: 1,
    startX: 0,
    startY: 0,
    mouseX: 0,
    mouseY: 0,
}), { canvas, color, width, height, hover } = toRefs(state);
// 测试人机验证
const onCaptcha = ()=>{
    useYouPlus.useCaptcha().then(res=>{
        console.log(6666,res)
    })

}
const onLogin = () => {
    useYouPlus.useLogin().then(profile => {
        console.log(profile)
        useStorage('profile', profile);
        location.reload()
    }).catch(err => {
        console.log(err)
        warning(err.msg)
    });
};
// 验证公钥

onMounted(async () => {
  try {
    // 1. 公钥配置（已验证合规，无需修改）
    const spkiPem = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEpB+tjwLwqjah7+yANiIh8+mklWsD
/isdEN6ovVa2O77+OSG76XMbuL/gGEuzUw6nLQoCF8tfkaMdHIzlH4BVSw==
-----END PUBLIC KEY-----`;

    // 2. 待加密明文
    const plaintext = "这是一段需要加密的敏感文字：123456";

    // 3. 清理并解码公钥（逻辑不变）
    const pemClean = spkiPem
      .replace(/-----BEGIN PUBLIC KEY-----/, '')
      .replace(/-----END PUBLIC KEY-----/, '')
      .replace(/\s+/g, '');
    const uint8Array = new Uint8Array(atob(pemClean).split('').map(c => c.charCodeAt(0)));

    // 4. 导入公钥（严格按规范配置）
    const publicKey = await crypto.subtle.importKey(
      'spki',
      uint8Array.buffer,
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      [] // 公钥仅用于密钥交换，用途为空
    );
    console.log('✅ 公钥导入成功');

    // 5. 生成临时 ECDH 密钥对（用途仅 deriveBits）
    const tempKeyPair = await crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      false, // 不可提取，避免校验错误
      ['deriveBits'] // 用途：仅派生原始共享密钥（bits）
    );
    console.log('✅ 临时 ECDH 密钥对生成成功');

    // 🔥 核心修正 Step 1：ECDH 派生原始共享密钥（bits，所有浏览器支持）
    const sharedBits = await crypto.subtle.deriveBits(
      { name: 'ECDH', public: publicKey },
      tempKeyPair.privateKey,
      256 // 共享密钥长度：256位（与 P-256 曲线匹配）
    );
    console.log('✅ 原始共享密钥（bits）生成成功');

    // 🔥 核心修正 Step 2：将共享密钥（bits）导入为「原始密钥」（用于 HKDF 派生）
    const rawSharedKey = await crypto.subtle.importKey(
      'raw', // 密钥格式：原始二进制
      sharedBits,
      { name: 'HKDF' }, // 算法：HKDF（用于后续派生）
      false, // 不可提取
      ['deriveKey'] // 用途：仅用于派生 AES 密钥
    );
    console.log('✅ 原始共享密钥导入成功');

    // 🔥 核心修正 Step 3：HKDF 派生 AES-256-GCM 密钥（用途完全匹配）
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const info = new TextEncoder().encode('AES-GCM-Encryption-Context');
    const aesKey = await crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        salt: salt,
        info: info,
        hash: 'SHA-256'
      },
      rawSharedKey, // 导入后的原始共享密钥
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt'] // AES 密钥用途：加密+解密（完全匹配）
    );
    console.log('✅ AES-256-GCM 密钥生成成功');

    // 6. AES-GCM 加密明文（逻辑不变）
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 12字节 IV（推荐）

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      aesKey,
      data
    );

    // 7. 处理加密结果（后端解密必需）
    const encryptedArray = new Uint8Array(encrypted);
    const ciphertext = encryptedArray.slice(0, encryptedArray.length - 16);
    const authTag = encryptedArray.slice(encryptedArray.length - 16);
    const tempPublicKeyRaw = await crypto.subtle.exportKey('spki', tempKeyPair.publicKey);

    const encryptResult = {
      ciphertext: btoa(String.fromCharCode(...ciphertext)),
      iv: btoa(String.fromCharCode(...iv)),
      authTag: btoa(String.fromCharCode(...authTag)),
      tempPublicKey: btoa(String.fromCharCode(...new Uint8Array(tempPublicKeyRaw))),
      salt: btoa(String.fromCharCode(...salt))
    };

    console.log('🎉 加密完全成功！传递给后端的数据：', encryptResult);
    // 发送给后端：await axios.post('/api/decrypt', encryptResult);

  } catch (err) {
    console.error('❌ 加密流程失败：', err.message || err);
    console.error('❌ 错误详情：', err.stack);
  }
});
</script>

<style>
#container {
    overflow: hidden;
}

#canvas {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
    visibility: visible;
    image-rendering: pixelated;
    /* transform-origin: 0px 0px 0px; */
    box-shadow: 0px 0px 0px 8px #9C27B0
}
</style>