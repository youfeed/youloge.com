/**
 * 用户状态持久化
 * 
 **/
export default defineStore('profile',{ 
    state:()=>{
        const savedData = localStorage.getItem('profile');
        const initial = {
            user: 'unknown',
            name: 'No Login',
            expire:0,
            avatar:'FjGW8UMGZ8LKvSrIlo7bZvge6Fr1',
            mail:'u******n@youloge.com'
        }
        return savedData ? JSON.parse(savedData) : initial;
    },
    actions:{
        logout(){
            console.log('logout',this)
        }
    }
});