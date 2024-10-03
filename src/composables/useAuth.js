export default ()=>{
  try {
      const {expire=0,...profile} = useStorage('profile'),timed = new Date().getTime() / 1000 >> 0;
      return expire > timed ? (profile.expire = expire,profile) : {};
    } catch (error) {
      return {}
    }
  }
  