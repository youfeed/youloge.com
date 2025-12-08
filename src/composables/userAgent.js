/**
 * 浏览器环境检测 Composable
 * 功能：检测浏览器类型、操作系统、小程序环境
 */

export default () => {
    const ua = navigator.userAgent.toLowerCase();
    
    // 基础系统判断
    const isIOS = /iphone|ipad|ipod|ios/.test(ua);
    const isAndroid = /android/.test(ua);
    const isPC = !isIOS && !isAndroid; // 非移动端即为PC
    
    // 浏览器检测
    const browser = {
        // 内置浏览器（App内嵌WebView）
        isWeChat: /micromessenger/.test(ua),
        isAlipay: /alipayclient/.test(ua),
        isDouyin: /toutiao|douyin/.test(ua),
        isQQ: /qqbrowser/.test(ua),
        
        // 主流浏览器
        isChrome: /chrome/.test(ua) && !/edge|opr/.test(ua),
        isSafari: /safari/.test(ua) && !/chrome/.test(ua),
        isEdge: /edge/.test(ua),
        isFirefox: /firefox/.test(ua),
        isIE: /trident/.test(ua),
    };
    
    // 小程序环境检测
    const miniprogram = {
        isWeChat: false,
        isAlipay: false,
        isDouyin: false,
    };
    
    // 微信小程序检测
    if (browser.isWeChat) {
        miniprogram.isWeChat = 
            /miniprogram/i.test(ua) || 
            (window && window.__wxjs_environment === 'miniprogram');
    }
    
    // 支付宝小程序检测
    if (browser.isAlipay) {
        miniprogram.isAlipay = /miniprogram/i.test(ua) || !!(window.my?.getEnv);
    }
    
    // 抖音小程序检测
    if (browser.isDouyin) {
        miniprogram.isDouyin = /lite/i.test(ua) || !!(window.tt?.getEnv);
    }
    
    // 获取客户端类型（简化版）
    const getClientType = () => {
        if (miniprogram.isWeChat) return 'wechat-miniprogram';
        if (miniprogram.isAlipay) return 'alipay-miniprogram';
        if (miniprogram.isDouyin) return 'douyin-miniprogram';
        if (browser.isWeChat) return 'wechat';
        if (browser.isAlipay) return 'alipay';
        if (browser.isDouyin) return 'douyin';
        if (isPC) return 'pc-browser';
        return 'mobile-browser';
    };
    
    // 微信环境提示使用默认浏览器
    const showBrowserTip = () => {
        if (browser.isWeChat && !miniprogram.isWeChat) {
            const tipElement = document.createElement('div');
            tipElement.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    color: white;
                    padding: 20px;
                ">
                    <div style="
                        background-color: white;
                        border-radius: 8px;
                        padding: 20px;
                        max-width: 80%;
                        text-align: center;
                    ">
                        <p style="color: #333; margin-bottom: 15px;">
                            为了更好的体验，请在右上角选择"在浏览器中打开"
                        </p>
                        <div style="
                            width: 60px;
                            height: 60px;
                            border: 2px dashed #aaa;
                            border-radius: 50%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin: 0 auto 15px;
                        ">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M10 6V8H5V19H16V14H18V6H10Z" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18 10L21 7L18 4" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <button style="
                            background-color: #07c160;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            padding: 8px 15px;
                            cursor: pointer;
                        ">我知道了</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(tipElement);
            
            // 添加点击事件关闭提示
            tipElement.querySelector('button').addEventListener('click', () => {
                document.body.removeChild(tipElement);
            });
            
            // 5秒后自动关闭
            setTimeout(() => {
                if (document.body.contains(tipElement)) {
                    document.body.removeChild(tipElement);
                }
            }, 5000);
            
            return true;
        }
        return false;
    };
    
    return {
        // 系统类型
        isIOS,
        isAndroid,
        isPC,
        
        // 浏览器类型
        ...browser,
        
        // 小程序环境
        ...miniprogram,
        
        // 方法
        getClientType,
        showBrowserTip
    };
};