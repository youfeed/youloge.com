/**
 * 全屏独立加载异步路由
 * 用于非跳转加载页面
**/
import YouSetup from '@components/YouSetup.vue'
import { h, render } from 'vue'
// 动态加载路由

const routes = () => {
    const modules = import.meta.glob('@/console/*.vue');
    let components = {};
    // 路由文件
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    Object.entries(modules).forEach(([path, asyncModule]) => {
        const name = path.match(/\/console\/(.+?)\.vue/)?.[1];
        const capitalizeName = "setup" + name.split('.').map(is => capitalize(is)).join('');
        components[capitalizeName] = asyncModule;
    });
    return components;
}
export default function useSetup(name, element = null) {
    const { promise, resolve, reject } = Promise.withResolvers();
    const container = document.querySelector('y-setup-container') || (
        element = document.createElement('div'),
        element.className = 'y-setup-container',
        document.body.appendChild(element),
        element
    );
    // 
    document.body.style.overflow = 'hidden'
    const onDestroy = () => {
        container.remove();
        document.body.style.overflow = 'auto'
    }
    // inject 在非 use内部获取不到
    const route = routes()
    // 创建虚拟节点并渲染
    const vnode = h(YouSetup, {
        name: name,
        routes: route,
        ready: (data) => {
            console.log('ready', data)
            resolve({
                ...data,
                ...route,
                destroy: () => onDestroy()
            })
        },
        error: () => {
            reject()
        },
        destroy: () => onDestroy()
    });
    render(vnode, container);
    return promise;
}