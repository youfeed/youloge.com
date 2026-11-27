/**
 * 本地图标:构建期收集 assets/icons 下的 SVG,返回可直接用于 <i> 的样式
 * 采用 mask 方式渲染,颜色继承文字色(currentColor)
 */
const modules = import.meta.glob('/src/assets/icons/*.svg', { eager: true, query: '?url', import: 'default' });
// 图标名 -> 本地资源 URL
const icons = Object.fromEntries(Object.entries(modules).map(([path, url]) => [path.split('/').pop().replace('.svg', ''), url]));

export default function useIcon(name, size = 16, color = 'currentColor') {
    const key = name.replace(':', '-');
    const url = icons[key];
    if (!url) {
        console.warn(`本地图标不存在: ${name}`);
        return {};
    }
    // data URL 中的单引号需转义,否则 CSS 会丢弃整个 mask-image 声明
    const safeUrl = url.replace(/'/g, '%27');
    return {
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        verticalAlign: 'middle',
        backgroundColor: color,
        WebkitMaskImage: `url(${safeUrl})`,
        maskImage: `url(${safeUrl})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
    };
}
