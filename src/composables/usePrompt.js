import YouPrompt from '@components/YouPrompt.vue'
/**
 * 组件调用 YouPrompt 适用于有交互的弹窗 
 * 函数调用 usePrompt() → 设 option.visible = true → 子组件挂载 → onMounted 触发 → PromptRef.showModal() → 弹窗显示
 **/
let promptApp = null,el = null;
export function usePrompt(option={}){
    option.visible = true;
    if (promptApp) {
        el.remove();
        promptApp.unmount();
        promptApp = null;
    }
    // 单例模式
    return new Promise((resolve,reject)=>{
        el = document.createElement('div');el.className = 'y-dialog-container';
        option.onConfirm = (result)=>{
            el.remove();
            promptApp.unmount();resolve(result)
        }
        option.onCancel = ()=>{
            el.remove();
            promptApp.unmount();reject()
        }
        let app = createApp(YouPrompt,option);
        app.directive('dom',vDom); // 绑定指令
        promptApp = markRaw(app);
        document.body.appendChild(el);promptApp.mount(el);
    });
}