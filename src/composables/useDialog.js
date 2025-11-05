import YouDialog from '@components/YouDialog.vue'
/**
 * 组件调用 YouDialog 适用于有交互的弹窗 
 * 函数调用 useDialog() → 设 option.visible = true → 子组件挂载 → onMounted 触发 → dialogRef.showModal() → 弹窗显示
 **/
let dialogApp = null,el = null;
export function useDialog(option={}){
    option.visible = true;
    if (dialogApp) {
        el.remove();
        dialogApp.unmount();
        dialogApp = null;
    }
    // 单例模式
    return new Promise((resolve,reject)=>{
        el = document.createElement('div');el.className = 'y-dialog-container';
        option.onConfirm = ()=>{
            el.remove();
            dialogApp.unmount();resolve()
        }
        option.onCancel = ()=>{
            el.remove();
            dialogApp.unmount();reject()
        }
        let app = createApp(YouDialog,option);
        app.directive('dom',vDom); // 绑定指令
        dialogApp = markRaw(app);
        document.body.appendChild(el);dialogApp.mount(el);
    });
}