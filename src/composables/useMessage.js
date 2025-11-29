import yMessage from '@components/YouMessage.vue'
import { createApp } from 'vue'

// 创建消息容器，确保它有足够的z-index
let messageContainer = null;

const ensureMessageContainer = () => {
    if (!messageContainer) {
        messageContainer = createApp(yMessage).mount(document.createDocumentFragment());
        console.log(messageContainer)
        document.body.appendChild(messageContainer.$el);
    }
    return messageContainer;
}

export function useMessage(options = { duration: 3000, target: 'body' }) {
    const Vm = ensureMessageContainer();
    // 兼容一下 y-setup组件
    const onCreate = (type, content) => {
        let topLayer = document.querySelector('dialog#top-layer:open')
        if (topLayer) {
            options.target = topLayer;
        }
        options.type = type;
        options.content = content;
        let uuid = Vm.create(options);
        return {
            uuid: uuid,
            close: () => {
                Vm.close(uuid)
            },
            destroy: () => {
                Vm.destroy()
            }
        };
    }
    const success = (content) => onCreate('success', content);
    const warning = (content) => onCreate('warning', content);
    const error = (content) => onCreate('error', content);
    const info = (content) => onCreate('info', content);
    return { success, warning, error, info }
}