/**
 * 用户状态持久化
 * 
 **/
export default defineStore('profile',()=>{
    const draft = {
        user: 'unknown',
        name: 'No Login',
        expire:0,
        avatar:'FjGW8UMGZ8LKvSrIlo7bZvge6Fr1',
        mail:'u******n@youloge.com',
        access_token:'',
    }
    const state = reactive({...draft});
    const $reset = ()=>{
        Object.assign(state,draft)
    }
    const logged = ()=>{
        let {access_token,expire} = state;
        return  access_token && expire > (Date.now() / 1000 >> 0) ? state : false;
    }
    const logout = ()=>{
        // localStorage.removeItem('profile');
        $reset();
        // state.user = 'unknown';
        console.log('logout',state)
    }
    (()=>{
        const savedData = localStorage.getItem('profile');
        savedData && (Object.assign(state,JSON.parse(savedData)));
    })();
    return {...toRefs(state),logged,logout,$reset};
});