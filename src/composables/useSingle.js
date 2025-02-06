/*
* 单例模式
* import { useSingle } from './useSingle'
* const instance = useSingle(ClassName)
* export default new instance()
*/
export default function useSingle(className) {
    let instance = null;
    const proxy = new Proxy(className,{
        construct(target,args){
            if(!instance){
                instance = Reflect.construct(target,args)
            }
            return instance
        }
    });
    className.prototype.constructor = proxy;
    return proxy;
}