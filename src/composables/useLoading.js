import yLoading from '@components/YouLoading.vue'
import { createApp } from 'vue'

export function useLoading(){
    let App = createApp(yLoading);
    let Vm = App.mount(document.createDocumentFragment());
    Vm.$el.className = 'y-loading-container'
    document.body.appendChild(Vm.$el);
    const show = ()=>{
        Vm.toggle();
        setTimeout(() => { hide(); },3000);
    }
    const hide = ()=>{
        Vm.toggle();
        App.unmount();
    }
    return {
        show:()=>show(),
        hide:()=>hide()
    }
}