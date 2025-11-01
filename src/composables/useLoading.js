import yLoading from '@components/YouLoading.vue'
import { createApp } from 'vue'
/**
 * 单例模式
 **/
let singleton = {
    count: 0, // 引用计数器
    timers: [], // 自动关闭定时器ID列表
    app:null,
    vm:null,
    el:null,
};
export function useLoading(options={}){
    // 
    const initInstance  = ()=>{
        if (singleton.el) return // 已初始化则直接返回
        // 创建DOM容器
        const el = document.createElement('div')
        el.className = 'y-loading-container'
        document.body.appendChild(el);
        // 创建Vue实例并挂载组件
        const app = createApp(yLoading, {
            message: '加载中...', // 默认提示文本
        });
        const vm = app.mount(el);
        // 存储单例信息
        singleton.app = app
        singleton.vm = vm
        singleton.el = el
    };
    //
    initInstance();
    // 
    let uuid = singleton.vm.create(options)
    console.log('uuid',uuid)

    // 当前loading的关闭函数
    const onRemove = ()=>{
        console.log('uuid2',uuid)
        singleton.vm.remove(uuid)
    };
    // 
    return { 
        hide:()=>{
            onRemove()
        },
        close:()=>{
            onRemove()
        }
    }
}