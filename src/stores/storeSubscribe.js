import { computed } from "vue";
import apiBatch from "../composables/apiBatch";

/**
 * 订阅列表持久化
 * @author Micateam@20250603
 **/

// 定义状态常量
const SUBSCRIBE_STATUS = {
    NOT_SUBSCRIBED: 0,      // 未关注
    SUBSCRIBED: 1,         // 已关注
    LOADING: -1             // 正在加载
};

export default defineStore('subscribe', () => {
    const stateProfile = storeProfile();
    const state = reactive({
        uuid: stateProfile.uuid,
        active: {},
        // 关注用户列表
        account: [],
        // 视频收藏列表
        video: [],
        // 云盘订阅列表
        drive: [],
        // 同步状态 - 记录正在进行同步的订阅
        syncStatus: {},
        status: 0, // 0-默认加载中 1-加载完成
        created: Date.now().toLocaleString(),
        updated: Date.now().toLocaleString(),
    });
    // 统计订阅
    const stat = computed(() => {
        return {
            account: state.account.length,
            video: state.video.length,
            drive: state.drive.length
        };
    });
    // 过滤查询 - 返回一个响应式的判断是否关注或者订阅 9-已关注，1-未关注，-1-正在加载
    const filter = computed(() => {
        return (type, uuid) => {
            console.log('filter', type, uuid);
            // 检查下载是否完成
            if (state.status === 0) return SUBSCRIBE_STATUS.LOADING;
            // 检查是否正在同步
            const syncKey = `${type}_${uuid}`;
            if (state.syncStatus[syncKey] === true) {
                return SUBSCRIBE_STATUS.LOADING; // -1 正在加载
            }

            // 检查是否已订阅
            const result = state[type].find(item => item.uuid == uuid);
            return result ? SUBSCRIBE_STATUS.SUBSCRIBED : SUBSCRIBE_STATUS.NOT_SUBSCRIBED;
        };
    });
    // API同步函数 全量同步
    const syncWithServer = (type, uuid) => {
        return new Promise((resolve) => {
            // 设置同步状态为加载中
            const syncKey = `${type}_${uuid}`;
            state.syncStatus[syncKey] = true;
            state.updated = Date.now().toLocaleString(); // 更新时间
            // 73行：保存当前状态为JSON文件（使用Blob）
            let text = JSON.stringify({
                id: crypto.randomUUID(),
                result: state,
            });
            let blob = new Blob([text], { type: 'application/json' });
            const form = new FormData();
            form.append('file', blob, 'subscribe.json');
            form.append('key', stateProfile.uuid);

            // 同步接口
            apiFetch(`account/subscribe`, { size: blob.size }).then(res => {
                form.append('token', res.token);
                // 模拟API调用
                fetch('https://upload.qiniup.com', {
                    method: 'POST',
                    body: form
                })
                    .then(response => {
                        if (response.ok) {
                            resolve(true);
                        } else {
                            throw new Error('API同步失败');
                        }
                    })
                    .catch(error => {
                        console.error(`${type} 同步失败:`, error);
                        resolve(false);
                    }).finally(() => {
                        state.syncStatus[syncKey] = false;
                        delete state.syncStatus[syncKey];
                        console.log('finally', state.syncStatus)
                    });
                //
            })
        });
    };

    // 切换状态 - 会触发API同步操作
    const toggle = computed(() => {
        return (type, uuid) => {
            const list = state[type];
            const index = list.findIndex(item => item.uuid == uuid);
            // 更新本地
            index == -1 ? list.push({ uuid }) : list.splice(index, 1);
            // 全量同步
            return syncWithServer(type, uuid);
        };
    });
    // 关注/订阅方法 - follow 方法用于添加订阅
    const follow = computed(() => {
        return (type, uuid) => {
            // 根据类型选择对应的列表
            const list = state[type];
            const index = list.findIndex(item => item.uuid == uuid);
            index == -1 ? list.push({ uuid }) : null;
            // 执行API同步操作
            return syncWithServer(type, uuid);
        };
    });
    // 收藏方法 - collect 方法用于添加收藏
    const collect = computed(() => {
         return (type, uuid) => {
            // 根据类型选择对应的列表
            const list = state[type];
            const index = list.findIndex(item => item.uuid == uuid);
            index == -1 ? list.push({ uuid }) : null;
            // 执行API同步操作
            return syncWithServer(type, uuid);
        };
    })
    // 取消订阅 - cancel 用于取消订阅
    const cancel = (type, uuid) => {
        const list = state[type];
        const index = list.findIndex(item => item.uuid == uuid);
        index == -1 ? null : list.splice(index, 1);
        // 执行API同步操作
        return syncWithServer(type, uuid);
    };

    // 更新订阅元数据 用于本地渲染列表
    const update = (type,offset=0,limit=10) => {
        const list = state[type];
        const slice = list.slice(offset,offset+limit);
        apiBatch(`${type}/info`,slice).then(res=>{
            res.forEach(({result}) => {
                if(result){
                    let find = list.find(item=>item.uuid==result.uuid); 
                    find && (find = result);
                    console.log('apiBatch.find',find);
                }
            });
        }).finally(()=>{
            syncWithServer(type, '0000');
        });
    };

    // 初始加载
    const load = () => {
        let { uuid } = stateProfile;
        fetch(`https://cdn.youloge.com/subscribe/${uuid}?t=${Date.now()}`).then(r => r.json()).then(res => {
            if (res.result) {
                let { account, drive, video, created, updated } = res.result;
                state.account = account;
                state.drive = drive;
                state.video = video;
                state.created = created;
                state.updated = updated;
                console.log(666666666, state);
            }
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            state.status = 1;
        });
    };
    // 初始加载
    load();
    // 
    onMounted(() => {
        console.log('subscribe', stateProfile);
    });

    return {
        ...toRefs(state),
        filter,
        follow,
        collect,
        toggle,
        cancel,
        update,
        SUBSCRIBE_STATUS
    };
});