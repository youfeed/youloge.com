export default async (needLogin=false)=>{
  try {
      const {expire=0,...profile} = useStorage('profile'),timed = new Date().getTime() / 1000 >> 0;
      if(needLogin && expire < timed){
        let profiled = await usePlus('login',{});
        useStorage('profile',profiled);
        return profiled
      }
      return expire > timed ? (profile.expire = expire,profile) : {};
    } catch (error) {
      return {}
    }
  }
  