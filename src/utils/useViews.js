export default (num,suffix='views')=>{
    let nums = Number(num);
    let [base] = [
      [1,0,''],
      [1000,1,'K'],
      [1000000,2,'M'],
      [1000000000,2,'B'],
    ].map(([cur,spl,unit])=>{
      let curs = nums / cur;
      if(curs < 1000){
        return curs.toFixed(spl)+unit
      }
    }).filter(Boolean);
    return `${base} ${suffix}`;
  }
  