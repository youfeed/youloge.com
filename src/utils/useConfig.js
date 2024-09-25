export default (key,val=false)=>{
    let Storage = JSON.parse(sessionStorage.getItem(key) || {})
    return val ? sessionStorage.setItem(key,JSON.stringify({...Storage,...val}))  : Storage; 
  }