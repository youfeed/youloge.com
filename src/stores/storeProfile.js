/**
 * 用户状态持久化
 * init reload distroy render
 **/
export default defineStore('profile',()=>{
    const draft = {
        user: 'unknown',
        name: 'No Login',
        expire:0,
        avatar:'FqTI4_efMPTwFs2LFBL0pEGFsl8K',
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
        location.reload();
        // state.user = 'unknown';
        console.log('logout',state)
    }
    const reload = ()=>{
        const savedData = localStorage.getItem('profile');
        savedData && (Object.assign(state,JSON.parse(savedData)));
    }
    reload();
    return {...toRefs(state),logged,logout,$reset};
});