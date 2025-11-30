import { ref } from "vue";
/**
 * 视口宽高
 * 
 */
const vw = ref(document.documentElement.clientWidth);
const vh = ref(document.documentElement.clientHeight);
export const useScreen = () => {
    window.addEventListener('resize', ()=>{
        vw.value = document.documentElement.clientWidth;
        vh.value = document.documentElement.clientHeight;
    });
    return { vw,vh };
};  