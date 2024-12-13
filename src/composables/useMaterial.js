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
        const app = createApp(YouMaterial,{...options,onConfirm:onConfirm,onCancel:onCancel});
        const Vm =  app.mount(document.createDocumentFragment());
        Vm.$el.className = 'y-material-container';document.body.appendChild(Vm.$el);Vm.$el.style.zIndex = 9999;
        const onDestroy = () => {
            app.unmount();
        };
    });
}