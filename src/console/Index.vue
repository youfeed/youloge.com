<template>
    <div class="max-w-7xl mx-auto p-4">
        <div class="profile flex items-center mb-4 relative bg-light p-2 rounded-sm">
            <div class="hover:scale-90 cursor-pointer" @click="chooseAvatar">
                <img :src="useImage(profile.avatar, '80')" alt="avatar" class="rounded-full w-12 h-12 border" />
            </div>
            <div class="ml-2">
                <div class="text-sm font-bold flex items-center">
                    <div class="flex items-center ">
                        <div class="name">{{ profile.name }} </div>
                        <div class="flex items-center cursor-pointer" @click="changeName">
                            <YouIcon name="tdesign:edit"  color="#2196F3"/>
                        </div>
                    </div>
                    <div class="flex items-center" >
                        <div class="user max-w-40 truncate">@{{ profile.user }} </div>
                        <span class="flex items-center cursor-pointer" @click="changeUser">
                            <YouIcon name="tdesign:edit" color="#2196F3"  />
                        </span>
                    </div>
                </div>
                <div class="text-sm text-gray-400">{{ profile.uuid }} · {{ profile.mail }}</div>
            </div>
            <div class="absolute right-1 top-1 text-sm text-blue-500 cursor-pointer">V</div>
        </div>
        <!-- FEED -->
        <div class="feed">
            <div>
                <div class="text-sm font-bold flex items-center">
                    <div class="name">Feed</div>
                </div>
            </div>
            <div class="grid col-span-4 grid-cols-3 gap-2">
                <div class="rounded-xl border bg-card text-card-foreground shadow @container/card">
                    <div class="flex flex-col space-y-1.5 p-6 relative">
                        <div class="text-sm text-muted-foreground">Total Revenue</div>
                        <div class="tracking-tight @[250px]/card:text-3xl text-2xl font-semibold tabular-nums">$1,250.00
                        </div>
                        <div class="absolute right-4 top-4">
                            <div
                                class="items-center border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground flex gap-1 rounded-lg text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-trending-up size-3">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                                    <polyline points="16 7 22 7 22 13"></polyline>
                                </svg>+12.5%
                            </div>
                        </div>
                    </div>
                    <div class="flex p-6 pt-0 flex-col items-start gap-1 text-sm">
                        <div class="line-clamp-1 flex gap-2 font-medium">Trending up this month <svg
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-trending-up size-4">
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                                <polyline points="16 7 22 7 22 13"></polyline>
                            </svg></div>
                        <div class="text-muted-foreground">Visitors for the last 6 months</div>
                    </div>
                </div>
                <div class="rounded-xl border bg-card text-card-foreground shadow @container/card">
                    <div class="flex flex-col space-y-1.5 p-6 relative">
                        <div class="text-sm text-muted-foreground">Total Revenue</div>
                        <div class="tracking-tight @[250px]/card:text-3xl text-2xl font-semibold tabular-nums">$1,250.00
                        </div>
                        <div class="absolute right-4 top-4">
                            <div
                                class="items-center border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground flex gap-1 rounded-lg text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-trending-up size-3">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                                    <polyline points="16 7 22 7 22 13"></polyline>
                                </svg>+12.5%
                            </div>
                        </div>
                    </div>
                    <div class="flex p-6 pt-0 flex-col items-start gap-1 text-sm">
                        <div class="line-clamp-1 flex gap-2 font-medium">Trending up this month <svg
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-trending-up size-4">
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                                <polyline points="16 7 22 7 22 13"></polyline>
                            </svg></div>
                        <div class="text-muted-foreground">Visitors for the last 6 months</div>
                    </div>
                </div>
                <div class="rounded-xl border bg-card text-card-foreground shadow @container/card">
                    <div class="flex flex-col space-y-1.5 p-6 relative">
                        <div class="text-sm text-muted-foreground">Total Revenue</div>
                        <div class="tracking-tight @[250px]/card:text-3xl text-2xl font-semibold tabular-nums">$1,250.00
                        </div>
                        <div class="absolute right-4 top-4">
                            <div
                                class="items-center border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground flex gap-1 rounded-lg text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-trending-up size-3">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                                    <polyline points="16 7 22 7 22 13"></polyline>
                                </svg>+12.5%
                            </div>
                        </div>
                    </div>
                    <div class="flex p-6 pt-0 flex-col items-start gap-1 text-sm">
                        <div class="line-clamp-1 flex gap-2 font-medium">Trending up this month <svg
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-trending-up size-4">
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                                <polyline points="16 7 22 7 22 13"></polyline>
                            </svg></div>
                        <div class="text-muted-foreground">Visitors for the last 6 months</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 默认预览 -->
        <template v-if="mode == 'preview'">
            <div class="README mt-4 max-w-screen-md mx-a">
                <div class="flex justify-between items-center mb-4 h-5 p-1">
                    <div class="flex gap-2">
                        <div class="text-sm font-bold">README</div>
                        <div class="text-sm text-blue-500 cursor-pointer" @click="mode = 'editor'">
                            编辑</div>
                    </div>
                    <div>
                    </div>
                </div>
                <div class="p-4 bg-white">
                    <YouRich v-model="html"></YouRich>
                </div>
            </div>
        </template>
        <!-- 编辑个人说明 -->
        <template v-if="mode == 'editor'">
            <div class="README mt-4 max-w-screen-md mx-a">
                <div class="flex justify-between items-center mb-4 h-5 p-1">
                    <div class="flex gap-2">
                        <div class="text-sm font-bold">README</div>
                        <div class="text-sm text-blue-500 cursor-pointer" @click="mode = 'preview'">
                            预览</div>
                    </div>
                    <div>
                        <div v-if="mode == 'editor'" class="p-2 bg-blue-400 text-light-50 rounded cursor-pointer"
                            @click="saveReadme">保存编辑</div>
                    </div>
                </div>
                <div class="p-4 bg-white">
                    <YouEditor v-model="html"></YouEditor>
                </div>
            </div>
        </template>
        <div class="h-40"></div>
    </div>
</template>

<script setup>
const props = defineProps(['params']), emit = defineEmits(['jump']);
const state = reactive({
    profile: {},
    mode: "preview",
    html: '',prismKey:0,
}), { profile, mode, html,prismKey } = toRefs(state);
//

// 获得用户介绍
const getReadme = () => {
    let { uuid } = state.profile;
    let t = Date.now();
    fetch(`https://cdn.youloge.com/readme/${uuid}?t=${t}`).then(r => {
        if (r.ok) {
            return r.text();
        };
        throw new Error();
    }).then(html => {
        state.html = html;
        state.prismKey += 1;
    }).catch(err => {
        console.log(333)
    })
}
// 保存介绍
const saveReadme = () => {
    let load = useLoading()
    let { uuid } = state.profile;
    let bolb = new Blob([state.html], { type: 'text/html' });
    apiFetch('account/readme', { size: bolb.size }).then(res => {
        let form = new FormData();
        form.append('key', uuid);
        form.append('file', bolb, `${uuid}.html`);
        // 上传文档
        fetch(res.url, { method: 'POST', body: form }).then(r => r.json()).then(req => {
            state.mode = 'preview'
            useMessage().success('保存成功');
        }).catch(err => {
            useMessage().error('保存失败');
        }).finally(() => {
            load.close();
        });
        // onUpload(res.data.upload,bolb)
    }).catch(err => {
        load.close();
        useMessage().error(err.message);
    })
}
// 更换头像
const chooseAvatar = () => {
    useMaterial({ type: 'image', limit: 1 }).then(([item]) => {
        apiFetch('account/avatar', { avatar: item.etag }).then(res => {
            state.profile.avatar = item.etag;
            useMessage().success('保存成功');
            useStorage('profile', { avatar: item.etag });
        }).catch(err=>{
            useMessage().error(err.message);
        });
    })
}
// 修改别称
const changeUser = ()=>{
    let {user} = state.profile;
    var userInput = prompt("修改别称(字母+数字组合)", user);
    if(userInput){
        apiFetch('account/user', { user: userInput }).then(res => {
            state.profile.user = userInput
            useMessage().success('修改成功');
            useStorage('profile', { user: userInput });
        }).catch(err=>{
            useMessage().error(err.message);
        });
    }
}
// 修改昵称
const changeName = () => {
    let {name} = state.profile;
    var nameInput = prompt("修改昵称(2-12个字)", name);
    if(nameInput){
        apiFetch('account/name', { name: nameInput }).then(res => {
            state.profile.name = nameInput
            useMessage().success('修改成功');
            useStorage('profile', { name: nameInput });
        }).catch(err=>{
            useMessage().error(err.message);
        });
    }
}
//
onMounted(() => {
    state.profile = useAuth();
    const profile = useAuth();
    // console.log('profile',profile)
    getReadme();
});
</script>

<style></style>