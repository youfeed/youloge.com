
/**
 * 
 * JS 原生表单验证
 * checkValidity()
 * reportValidity()
 */
import {isRef,isReactive} from 'vue'
const vCheck = {
    name: 'check',
    mounted(el, binding) {
        // 1. 校验入参：必须是响应式对象（ref/reactive）
        if (!isRef(binding.value) && !isReactive(binding.value)) {
            console.error('[v-check] 绑定的值必须是Vue响应式对象ref/reactive');
            return;
        }
        binding.value.dirty = true;
        binding.value.valid = el.checkValidity();
    },
    updated(el,binding) {
        binding.value.dirty = false;
        binding.value.reason = el.validity;
        binding.value.valid = el.checkValidity();
        console.log('updated',el.validity)
    }
}

export default vCheck;