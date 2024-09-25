export default (key,val=false)=>{
    let Storage = JSON.parse(localStorage.getItem(key) || '{}')
    return val ? localStorage.setItem(key,JSON.stringify({...Storage,...val}))  : Storage; 
}