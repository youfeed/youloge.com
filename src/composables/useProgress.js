/**
 * @description 路由切换顶部进度条（单例 DOM，无需组件挂载）
 * @author youloge
 */

const BAR_COLOR = 'linear-gradient(90deg, #6366f1, #a855f7, #22d3ee)';
const ERROR_COLOR = 'linear-gradient(90deg, #f43f5e, #fb7185)';

let bar = null;
let timers = [];

const clearTimers = () => {
    timers.forEach((timer) => clearTimeout(timer));
    timers = [];
};

const later = (callback, delay) => {
    timers.push(setTimeout(callback, delay));
};

const ensureBar = () => {
    if (bar || typeof document === 'undefined') {
        return bar;
    }
    const el = document.createElement('div');
    el.className = 'you-progress-bar';
    Object.assign(el.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        height: '3px',
        width: '0%',
        zIndex: '9999',
        pointerEvents: 'none',
        opacity: '0',
        background: BAR_COLOR,
        boxShadow: '0 0 8px rgba(99, 102, 241, 0.6)',
        transition: 'width 0.2s ease, opacity 0.25s ease',
    });
    document.body.appendChild(el);
    bar = el;
    return bar;
};

const setWidth = (value) => {
    if (!bar) {
        return;
    }
    bar.style.width = `${Math.min(100, Math.max(0, value))}%`;
};

const setColor = (color) => {
    if (!bar) {
        return;
    }
    bar.style.background = color;
};

const hide = (delay) => {
    later(() => {
        if (!bar) {
            return;
        }
        bar.style.opacity = '0';
    }, delay);
    later(() => {
        setWidth(0);
        setColor(BAR_COLOR);
    }, delay + 250);
};

/**
 * 进度条控制：start 开始、done 完成、error 异常
 */
const start = () => {
    clearTimers();
    const el = ensureBar();
    if (!el) {
        return;
    }
    setColor(BAR_COLOR);
    setWidth(8);
    el.style.opacity = '1';
    later(() => setWidth(35), 120);
    later(() => setWidth(65), 400);
    later(() => setWidth(85), 900);
};

const done = () => {
    clearTimers();
    if (!bar) {
        return;
    }
    setWidth(100);
    hide(200);
};

const error = () => {
    clearTimers();
    if (!bar) {
        return;
    }
    setColor(ERROR_COLOR);
    setWidth(100);
    hide(600);
};

function useProgress() {
    return { start, done, error };
}

// 兼容 useProgress.start() 的直接调用方式
useProgress.start = start;
useProgress.done = done;
useProgress.error = error;

export { useProgress };
