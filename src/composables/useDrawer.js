import YouDrawer from '@components/YouDrawer.vue'
import {createApp} from 'vue'
/**
 * 函数式抽屉组件
 **/
let drawerApp = null,el = null;
export function useDrawer(option={}){
    if (drawerApp) {
        el.remove();
        drawerApp.unmount();
        drawerApp = null;
    }
    // 单例模式
    return new Promise((resolve,reject)=>{
        el = document.createElement('div');el.className = 'y-drawer-container';
        option.onConfirm = ()=>{
            console.log('onConfirm')
            el.remove();
            drawerApp.unmount();resolve()
        }
        option.onCancel = ()=>{
            console.log('取消')
            el.remove();
            drawerApp.unmount();reject()
        }
        let app = createApp(YouDrawer,option);
        drawerApp = markRaw(app);
        document.body.appendChild(el);drawerApp.mount(el);
    });
}