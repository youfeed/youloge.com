/**
 * 侧栏菜单状态持久化
 * @author Micateam@20250603
 **/
export default defineStore('menu', {
    state: () => {
        const init = {
            active: {},
            list: [
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
        }
        return init;
    },
    actions:{
        // 异步加载数据
        load(){
            fetch('ss').then(res=>{
                if(res.ok){
                    init.active = {name:'用户管理'};
                    // res.json().then(data=>{
                    //     console.log('11111111111111111menu',data)
                    // })
                }
            })
        },
        change(path){
            let find = this.list.find(item=>item.path==path);
            this.active = find;
            console.log('change',this)
        }
    },
    persist:{
        storage:localStorage,
        key:'menu'
    }
})