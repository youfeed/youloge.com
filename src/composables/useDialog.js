import YouDialog from '@components/YouDialog.vue'
import {createApp} from 'vue'
export function useDialog(){
    let Vm = createApp(YouDialog).mount(document.createDocumentFragment());
    Vm.$el.className = 'y-dialog-container'
    document.body.appendChild(Vm.$el);
  const showDialog = (option) => {
    Vm.onOpen(option);
  }
  const closeDialog = (option) => {
    Vm.onClose(option);
  }
  return {
    open: (option) => showDialog(option),
    close: (option) => closeDialog(option),
  }
}