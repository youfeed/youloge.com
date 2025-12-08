/**
 * 登录指令
 * */
export default {
    name:'login',
    mounted(el, binding){
        const stateProfile = storeProfile();
        let {arg,value,modifiers} = binding,app = null,instance = null;
        let eventName = arg||'click';
        // 处理函数
        const eventHandle = (e)=>{
            e.stopPropagation(); // 可选：阻止事件冒泡
            let {uuid} = useAuth();
            console.log(200,uuid,useAuth());
            uuid ? value() : usePlus('login').then(profile=>{
                stateProfile.login(profile);
                value();
            }).catch(err=>{
                console.log(err)
                useMessage().error(err.message)
            });
        }
        el._eventName = eventName;
        el._eventFunc = eventHandle;
        el.addEventListener(eventName,eventHandle);
    },
    unmounted(el){
        const {_eventName,_eventFunc} = el;
        el.removeEventListener(_eventName,_eventFunc)
    }
}