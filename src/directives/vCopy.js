const vCopy = {
  name:'copy',
  mounted(el, binding, vnode, prevVnode){
    el.style.cursor = 'pointer'
    let {arg,value} = binding;
    console.log(arg,binding)
    el.onclick = (e)=>{
      let {clientX,clientY} = e;
      let Fragment = document.createElement('div');
      let text = {
        'string':()=>value,
        'number':()=>value,
        'function':()=>value(),
        'undefined':()=>el.innerText,
        'boolean':()=>value ? el.innerHTML : el.textContent
      }[typeof value]();
      navigator.clipboard ? navigator.clipboard.writeText(text).then(res=>{
        addend('复制成功','#4caf50');
      }).catch(e=>{
        addend('复制失败','#ffc107');
      })
      : addend('不支持复制','#ff9800');
      const addend = (txt,color)=>{
        Fragment.textContent = txt
        Fragment.setAttribute('style',`color: ${color};position: fixed;left:${clientX}px;top:${clientY}px;transform:translate(-50%,-50%);user-select: none;`);
        Fragment.animate([
          { transform: "translateY(0px)" },
          { transform: "translateY(-100px)" },
        ],{
          duration: 1000,
          iterations: 1,
        })
        document.body.appendChild(Fragment)
        setTimeout(()=>{Fragment.remove()},1000)
      }
    }
  }
};
export default vCopy;