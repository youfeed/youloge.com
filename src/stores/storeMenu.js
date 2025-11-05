/**
 * 侧栏菜单状态持久化
 * @author Micateam@20250603
 **/
export default defineStore('menu', ()=>{
    const stateProfile = storeProfile()
    const state = reactive({
        active:{},
        list:[
            {
                name: '用户管理',
                icon: 'UserOutlined',
                path:'/',
                meta:{
                    title:'用户管理',
                    icon:'UserOutlined'
                }
            }
        ],
        // 订阅列表
        subscribe:[]
    });

    
    const change = (path)=>{
        let find = state.list.find(item=>item.path==path);
        if(find){
            state.active = find;
        }
        console.log('change',state)
    }
    //
    const load = ()=>{
        let {uuid} = stateProfile;
        fetch(`https://cdn.youloge.com/subscribe/${uuid}`).then(r=>r.json()).then(res=>{
            console.log(res)
            state.subscribe = res.result;
        }).catch(err=>{
            state.subscribe = []
        });
    };load();
    onMounted(()=>{
        console.log('onMounted',state)
    })
    return {...toRefs(state),load,change}
})