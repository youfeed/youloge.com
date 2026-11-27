<template>
    <!-- 账户设置:账户信息 / 隐私 / 语言 / 退出登录 -->
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="mx-auto max-w-3xl space-y-6 px-4 sm:px-6">
            <!-- 未登录引导 -->
            <section v-if="!isLogin" class="rounded-lg border border-gray-200 bg-white p-6 text-center">
                <p class="text-sm text-gray-500">登录后即可管理账户信息与隐私设置。</p>
                <button type="button"
                    class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    @click="onLogin">登录</button>
            </section>
            <template v-else>
                <!-- 账户信息 -->
                <section class="rounded-lg border border-gray-200 bg-white">
                    <div class="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
                        <i :style="useIcon('mdi-light:account', 20)" class="shrink-0"></i>
                        <h1 class="text-base font-bold text-gray-900">账户信息</h1>
                    </div>
                    <div class="flex items-start gap-4 px-6 py-5">
                        <img :src="useImage(stateProfile.avatar, '80')" alt="avatar" title="点击更换头像"
                            class="h-16 w-16 shrink-0 cursor-pointer rounded-full border border-gray-200 object-cover transition-transform hover:scale-95"
                            @click="changeAvatar" />
                        <div class="min-w-0 flex-1 space-y-3">
                            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <span class="text-lg font-semibold text-gray-900">{{ stateProfile.name }}</span>
                                <button type="button" class="text-xs text-blue-600 hover:text-blue-700"
                                    @click="changeName">修改昵称</button>
                            </div>
                            <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                <span class="text-gray-400">别称</span>
                                <span class="font-medium">@{{ stateProfile.user }}</span>
                                <button type="button" class="text-xs text-blue-600 hover:text-blue-700"
                                    @click="changeUser">修改</button>
                            </div>
                            <div class="truncate text-xs text-gray-400">UUID：{{ stateProfile.uuid }}</div>
                            <div class="text-sm text-gray-600">邮箱：{{ stateProfile.mail || '未绑定' }}</div>
                        </div>
                    </div>
                </section>
                <!-- 隐私设置 -->
                <section class="rounded-lg border border-gray-200 bg-white">
                    <div class="border-b border-gray-100 px-6 py-4">
                        <h2 class="text-base font-bold text-gray-900">隐私设置</h2>
                        <p class="mt-1 text-xs text-gray-500">控制公开范围与互动权限，设置仅保存在当前浏览器。</p>
                    </div>
                    <div class="divide-y divide-gray-100">
                        <div v-for="item in privacyOptions" :key="item.key"
                            class="flex items-center justify-between gap-4 px-6 py-4">
                            <div class="min-w-0">
                                <div class="text-sm font-medium text-gray-900">{{ item.label }}</div>
                                <div class="mt-1 text-xs text-gray-500">{{ item.desc }}</div>
                            </div>
                            <button type="button" role="switch" :aria-checked="privacy[item.key]"
                                class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
                                :class="privacy[item.key] ? 'bg-blue-600' : 'bg-gray-300'"
                                @click="togglePrivacy(item.key)">
                                <span
                                    class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                    :class="privacy[item.key] ? 'translate-x-5' : 'translate-x-0'"></span>
                            </button>
                        </div>
                    </div>
                </section>
                <!-- 语言设置 -->
                <section class="rounded-lg border border-gray-200 bg-white">
                    <div class="border-b border-gray-100 px-6 py-4">
                        <h2 class="text-base font-bold text-gray-900">语言</h2>
                    </div>
                    <div class="flex items-center justify-between gap-4 px-6 py-5">
                        <div class="min-w-0">
                            <div class="text-sm font-medium text-gray-900">界面语言</div>
                            <div class="mt-1 text-xs text-gray-500">跟随系统会按浏览器语言判断。</div>
                        </div>
                        <select v-model="language"
                            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            @change="onLanguageChange">
                            <option v-for="item in languageOptions" :key="item.value" :value="item.value">
                                {{ item.label }}
                            </option>
                        </select>
                    </div>
                </section>
                <!-- 退出登录 -->
                <section class="rounded-lg border border-gray-200 bg-white">
                    <div class="border-b border-gray-100 px-6 py-4">
                        <h2 class="text-base font-bold text-gray-900">退出登录</h2>
                    </div>
                    <div class="flex items-center justify-between gap-4 px-6 py-5">
                        <div class="min-w-0">
                            <div class="text-sm font-medium text-gray-900">退出当前账号</div>
                            <div class="mt-1 text-xs text-gray-500">退出后需要重新登录才能使用账户功能。</div>
                        </div>
                        <button type="button"
                            class="inline-flex shrink-0 items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            @click="onLogout">
                            <i :style="useIcon('mdi:login', 18)" class="rotate-180"></i>
                            <span>退出登录</span>
                        </button>
                    </div>
                </section>
            </template>
        </div>
    </div>
</template>
<script setup>
// 账户设置页:账户信息、隐私、语言与退出登录
const stateProfile = storeProfile();
const isLogin = computed(() => Boolean(stateProfile.uuid));
// 设置参数统一放在 state,页面变量通过 toRefs 解构
const state = reactive({
    language: 'zh-CN',
    privacy: {
        profilePublic: true,
        allowMessage: true,
        showEmail: false,
        searchIndex: true,
    },
});
const { language, privacy } = toRefs(state);
// 载入本地已保存的设置
const savedSetting = useStorage('setting') || {};
language.value = savedSetting.language ?? 'zh-CN';
privacy.value = { ...privacy.value, ...(savedSetting.privacy ?? {}) };
// 语言选项
const languageOptions = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'en-US', label: 'English' },
    { value: 'auto', label: '跟随系统' },
];
// 隐私选项
const privacyOptions = [
    { key: 'profilePublic', label: '公开个人资料', desc: '允许其他访客查看你的主页与公开内容。' },
    { key: 'allowMessage', label: '允许私信', desc: '允许其他用户向你发送私信。' },
    { key: 'showEmail', label: '展示邮箱', desc: '在个人主页展示你的邮箱地址。' },
    { key: 'searchIndex', label: '允许搜索引擎收录', desc: '允许搜索引擎收录你的公开内容。' },
];
// 语言写入本地设置并同步页面 lang 属性
watch(language, (val) => {
    useStorage('setting', { language: val });
    document.documentElement.lang = val === 'auto' ? (navigator.language || 'zh-CN') : val;
}, { immediate: true });
// 隐私设置写入本地设置
watch(privacy, (val) => {
    useStorage('setting', { privacy: { ...val } });
}, { deep: true });
// 切换隐私项
const togglePrivacy = (key) => {
    privacy.value[key] = !privacy.value[key];
    useMessage().success('设置已保存');
};
// 语言变更提示
const onLanguageChange = () => {
    useMessage().success('语言设置已保存');
};
// 更换头像
const changeAvatar = () => {
    useMaterial({ type: 'image', limit: 1 }).then(([item]) => {
        apiFetch('account/avatar', { avatar: item.etag }).then(() => {
            stateProfile.avatar = item.etag;
            useStorage('profile', { avatar: item.etag });
            useMessage().success('保存成功');
        }).catch(err => {
            useMessage().error(err.message);
        });
    });
};
// 修改别称
const changeUser = () => {
    usePrompt({
        title: '修改别称',
        placeholder: '字母+数字组合',
        name: 'user',
        pattern: '[A-Za-z0-9]{2,12}'
    }).then(({ user }) => {
        apiFetch('account/user', { user }).then(() => {
            stateProfile.user = user;
            useStorage('profile', { user });
            useMessage().success('修改成功');
        }).catch(err => {
            useMessage().error(err.message);
        });
    }).catch(() => {
        useMessage().info('取消输入');
    });
};
// 修改昵称
const changeName = () => {
    usePrompt({
        title: '修改昵称',
        placeholder: '2-12个字',
        name: 'name',
        pattern: '.{2,12}'
    }).then(({ name }) => {
        apiFetch('account/name', { name }).then(() => {
            stateProfile.name = name;
            useStorage('profile', { name });
            useMessage().success('修改成功');
        }).catch(err => {
            useMessage().error(err.message);
        });
    }).catch(() => {
        useMessage().info('取消输入');
    });
};
// 登录
const youPlus = YouPlus();
const onLogin = () => {
    youPlus.useLogin().then(profile => {
        stateProfile.login(profile);
    }).catch(err => {
        useMessage().warning(err?.msg ?? '登录失败');
    });
};
// 退出登录
const onLogout = () => {
    stateProfile.logout();
};
</script>
