export default function(props,name,emit){
    return computed({
        get(){
            return new Proxy(props[name],{
                set(target,key,value){
                    emit(`update:${name}`,{...target,[key]:value});
                    return true
                }
            })
        },
        set(value){
            emit(`update:${name}`,value)
        }
    })
}