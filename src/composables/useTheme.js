/**
 * 主题切换
 * @param {String} theme 'dark' | 'light' 主题名称
 * theme = 'dark' 深色
 * theme = 'light' 浅色
 * @author Micateam@20250603
 **/
export default (theme='light') => {
    // let status = theme || localStorage.theme || 'light';
    document.documentElement.classList.toggle("dark",localStorage.theme === "dark" ||(!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches));
}