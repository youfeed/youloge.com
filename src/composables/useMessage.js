import yMessage from '@components/YouMessage.vue'
import {createApp} from 'vue'
export function useMessage(duration=3000){
    let Vm = createApp(yMessage).mount(document.createDocumentFragment());
    Vm.$el.className = 'y-message-container'
    document.body.appendChild(Vm.$el);
  const showMessage = (message,type) => {
    Vm.onPush(type,message,duration);
  }
  return {
    success: (message) => showMessage(message, 'success'),
    warning: (message) => showMessage(message, 'warning'),
    error: (message) => showMessage(message, 'error'),
    info: (message) => showMessage(message, 'info')
  }
}