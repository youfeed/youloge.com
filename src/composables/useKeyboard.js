import YouKeyboard from '@components/YouKeyboard.vue'
/**
 * 
 * 虚拟键盘输入
 */
let dialogApp = null,el = null;
export default function useKeyboard(option={}) {
    option.visible = true;
    if (dialogApp) {
        el.remove();
        dialogApp.unmount();
        dialogApp = null;
    }
    // 单例模式
    return new Promise((resolve,reject)=>{
        el = document.createElement('div');el.className = 'y-dialog-container';
        option.onConfirm = (code)=>{
            el.remove();
            dialogApp.unmount();resolve(code)
        }
        option.onCancel = ()=>{
            el.remove();
            dialogApp.unmount();reject()
        }
        let app = createApp(YouKeyboard,option);
        app.directive('dom',vDom); // 绑定指令
        dialogApp = markRaw(app);
        document.body.appendChild(el);dialogApp.mount(el);
    });
}