/**
 * 订阅列表持久化
 * @author Micateam@20250603
 **/
export default defineStore('subscribe', ()=>{
    const stateProfile = storeProfile()
    const state = reactive({
        active:{},
        // 订阅列表
        list:[]
    });
    // 统计订阅
    const stat = ()=>{
        return {
            account:0,
            video:0,
            drive:0
        }
    }
    // 过滤查询
    const filter = (name,value)=>{
        let filter = state.list.filter(is=>is[name]==value);//.map();
        return filter;
    }
    // 新增订阅
    const create = ()=>{}
    // 取消订阅
    const cancel = ()=>{}
    // 初始加载
    const load = ()=>{
        let {uuid} = stateProfile;
        fetch(`https://cdn.youloge.com/subscribe/${uuid}`).then(r=>r.json()).then(res=>{
            console.log(res)
            state.list = res.result;
        }).catch(err=>{
            state.list = []
        });
    };load();
    onMounted(()=>{
        console.log('onMounted',state)
    })
    return {...toRefs(state),filter}
})