/**
 * 用户状态持久化
 * init reload distroy render
 **/
export default defineStore('profile',()=>{
    const draft = {
        uuid:'',
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
    const login = (profile)=>{
        useStorage('profile',profile);
        reload();
    }
    const logout = ()=>{
        localStorage.setItem('profile','{}');
        $reset();
        location.reload();
        console.log('logout',state)
    }
    const reload = ()=>{
        const profile = useStorage('profile');
        const {access_token,expire} = profile;
        access_token && expire > (Date.now() / 1000 >> 0) ? Object.assign(state,profile) : false;
    }
    reload();
    return {...toRefs(state),login,logout,$reset};
});