import YouDialog from '@components/YouDialog.vue'
import {createApp} from 'vue'
/**
 * 
 **/
let dialogApp = null,el = null;
export function useDialog(option={}){
    if (dialogApp) {
        el.remove();
        dialogApp.unmount();
        dialogApp = null;
    }
    // 单例模式
    return new Promise((resolve,reject)=>{
        el = document.createElement('div');el.className = 'y-dialog-container';
        option.onConfirm = ()=>{
            console.log('onConfirm')
            el.remove();
            dialogApp.unmount();resolve()
        }
        option.onCancel = ()=>{
            console.log('取消')
            el.remove();
            dialogApp.unmount();reject()
        }
        let app = createApp(YouDialog,option);
        dialogApp = markRaw(app);
        document.body.appendChild(el);dialogApp.mount(el);
    });
}