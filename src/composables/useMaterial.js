import YouMaterial from '@/components/YouMaterial.vue'
import {createApp} from 'vue'
export function useMaterial(options){
    return new Promise((resolve,reject)=>{
        const onConfirm = (item)=>{
            console.log('onConfirm');
            onDestroy();
            resolve(item);
        }
        const onCancel = ()=>{
            console.log('onCancel');
            onDestroy();
            reject();
        }
        const container = document.createElement('div');
        container.className = 'y-material-container z-9999';document.body.appendChild(container);
        const app = createApp(YouMaterial,{...options,onConfirm:onConfirm,onCancel:onCancel});
        app.mount(container);
        const onDestroy = () => {
            app.unmount();
            container.remove();
        };
    });
}