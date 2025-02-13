import YouMaterial from '@/components/YouMaterial.vue'
import {createApp} from 'vue'
let dialogApp = null,el = null;
export function useMaterial(options){
    return new Promise((resolve,reject)=>{
        el = document.createElement('div');el.className = 'y-material-container';
        if (dialogApp) {
            el.remove();
            dialogApp.unmount();
            dialogApp = null;
        }
        options.onConfirm = (item)=>{
            console.log('onConfirm');
            el.remove();dialogApp.unmount();resolve(item);
        }
        options.onCancel = ()=>{
            console.log('onCancel');
            el.remove();dialogApp.unmount();reject();
        }
        let app = createApp(YouMaterial,options);
        dialogApp = markRaw(app);
        document.body.appendChild(el);dialogApp.mount(el);
    });
}