export default ()=>{
    try {
      const profile = JSON.parse(localStorage.getItem('profile') || '{}')
      const {expire} = profile,timed = new Date().getTime() / 1000 >> 0;
      return expire > timed ? profile : false;
    } catch (error) {
      return false
    }
  }
  