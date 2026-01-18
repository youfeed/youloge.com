/**
 * 在此元素之外的任意事件
 */
const vOutside = {
    name:'outside',
    mounted(el, binding){
        const args = binding.arg || 'click';
        const handler = (e) => {
            if (!el.contains(e.target)) {
                typeof binding.value === 'function' && binding.value();
            }
        };
        document.addEventListener(args, handler);
        el._vOutside = handler;
        el._vEventName = args;
    },
    unmounted(el){
        document.removeEventListener(el._vEventName, el._vOutside);
        delete el._vOutside;
        delete el._vEventName;
    }
}



export default vOutside