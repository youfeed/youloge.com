/**
 * 用户状态管理 Store
 * 功能：登录、登出、状态重置和自动刷新
 */

// 默认用户状态
const defaultProfile = {
    uuid: '',
    user: 'unknown',
    name: 'No Login',
    expire: 0,
    avatar: 'FqTI4_efMPTwFs2LFBL0pEGFsl8K',
    mail: 'u******n@youloge.com',
    access_token: ''
};

export default defineStore('profile', () => {
    const state = reactive({ ...defaultProfile });

    // 重置为默认状态
    const $reset = () => {
        Object.assign(state, defaultProfile);
    };

    // 登录并保存状态
    const login = (profile) => {
        if (!profile || !profile.access_token) {
            console.error('登录失败：无效的用户数据');
            return false;
        }
        
        useStorage('profile', profile);
        reload();
        return true;
    };

    // 登出并重置状态
    const logout = () => {
        localStorage.setItem('profile', '{}');
        $reset();
        window.location.reload();
        // 使用更友好的方式处理登出
        // window.location.href = '/login';
        console.log('用户已登出');
    };

    // 从存储加载状态
    const reload = () => {
        try {
            const profile = useStorage('profile') || {};
            const { access_token, expire } = profile;
            
            // 验证token是否有效
            const isValid = access_token && expire > (Date.now() / 1000);
            
            if (isValid) {
                Object.assign(state, profile);
                return true;
            } else if (access_token) {
                // token已过期，清除无效数据
                console.log('Token已过期，需要重新登录');
                logout();
            }
            
            return false;
        } catch (error) {
            console.error('加载用户状态失败:', error);
            return false;
        }
    };

    // 初始化 - 在 Store 定义时立即执行
    reload();
    
    // 设置页面可见性监听
    document.addEventListener('visibilitychange', () => {
        // 页面重新变为可见时，检查用户状态
        if (document.visibilityState === 'visible') {
            reload();
        }
    });

    return {
        ...toRefs(state),
        login,
        logout,
        $reset
    };
});