/**
 * 侧栏菜单状态持久化
 * @author Micateam@20250603
 **/
export default defineStore('menu', ()=>{
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
        ]
    });
    const load = ()=>{
        fetch('ss').then(res=>{
            if(res.ok){
                state.active = {name:'用户管理'};
                console.log('defineStoredefineStoredefineStoredefineStoredefineStore',state)
            }
        })
    }
    const change = (path)=>{
        let find = state.list.find(item=>item.path==path);
        if(find){
            state.active = find;

        }
        console.log('change',state)
    }
    load();
    onMounted(()=>{
        console.log('onMounted',state)
    })
    return {...toRefs(state),load,change}
})