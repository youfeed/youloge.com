/**
 * 尺寸监听指令
 * 监听DOM元素尺寸变化，并在挂载时立即返回当前尺寸
 */
const map = new WeakMap();

// 创建ResizeObserver实例
const io = new ResizeObserver(entries => {
    for (const entry of entries) {
        const callbacks = map.get(entry.target);
        if (callbacks) {
            console.log('entry+++++++',entry)
            // 兼容不同浏览器的borderBoxSize格式
            let box;
            if (entry.borderBoxSize) {
                // 标准格式，取第一个元素
                box = Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize;
            } else {
                // 兼容旧浏览器，手动计算
                const rect = entry.target.getBoundingClientRect();
                box = {
                    inlineSize: rect.width,
                    blockSize: rect.height,
                    width: rect.width,
                    height: rect.height
                };
            }
            callbacks(box);
        }
    }
});

const vSize = {
    name: 'size',
    mounted(el, binding) {
        // 存储回调函数
        map.set(el, binding.value);
        
        // 开始监听尺寸变化
        io.observe(el);
        
        // 立即获取并返回当前尺寸
        const rect = el.getBoundingClientRect();
        const currentSize = {
            inlineSize: rect.width,
            blockSize: rect.height,
            width: rect.width,
            height: rect.height
        }
        binding.value(currentSize);
    },
    unmounted(el) {
        // 停止监听并清理
        io.unobserve(el);
        map.delete(el);
    }
};

export default vSize;