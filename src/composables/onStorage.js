export default (key,func)=>{
    try {
        window.addEventListener('storage',(e)=>{
            e.key === key && func(JSON.parse(e.newValue))
        })
    } catch (error) {
        return {}
    }
}