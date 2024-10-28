import { nextTick } from "vue"


export default {
  name:'ripple',
  mounted(el, binding){ // , vnode, prevVnode
    el.style.position = 'relative';
    el.style.overflow = 'hidden'
    el.addEventListener('pointerdown', (e) => {
      // console.log(e)
      let ripple = document.createElement('div')
      ripple.className = 'y-ripple'
      // ripple.style = `position: absolute;transform: translate(-50%,-50%);  pointer-events: none; overflow: hidden;background: currentColor; border-radius: 50%;`;
      ripple.style = `
        position: absolute;
        transform: translate(-50%, -50%);
        pointer-events: none;
        background: currentColor;;
        border-radius: inherit;
        width: 4px;
        height: 4px;
        opacity: .5;
      `;
      ripple.style.top =  `${e.offsetY}px`;
      ripple.style.left =  `${e.offsetX}px`;
      el.appendChild(ripple) 
      //
      nextTick(()=>{
        ripple.animate([
          {width: '50%', height:'100%', opacity: .3},
          {width: '400%', height:'400%', opacity: .1},
        ],
        {
          iterations: 1,
          duration: 300,
          easing:'ease-out',
        })
      })
      setTimeout(() => {
        ripple.remove()
      },200)
    })
  },
  unmounted(el){
    // console.log('unmounted',el)

    // el.removeEventListener('pointerdown');
  }
}
