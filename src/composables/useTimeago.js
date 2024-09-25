export default (date,i='zh')=>{
    let diff = (new Date() - new Date(date.replace(/-/gi,"/"))) / 1000 >> 0;
    let [key,sep,...lang] = {
      'zh':[0,'','前','后'],
      'en':[1,' ','ago','later'],
    }[i] || [0,'前','后'];
    let base = [
      [31536000,'年','Years'],
      [2592000,'个月','Month'],
      [604800,'周','Week'],
      [86400,'天','Day'],
      [3600,'小时','Hour'],
      [60,'分钟','Minute'],
      [1,'秒','Second'],
      [-1,'秒','Second'],
      [-60,'分钟','Minute'],
      [-3600,'小时','Hour'],
      [-86400,'天','Day'],
      [-604800,'周','Week'],
      [-2592000,'个月','Month'],
      [-31536000,'年','Years']
    ].map(([sec,...unit])=>{
      let cur = diff / sec >> 0;
      if(cur > 0){
        return [cur,unit[key]]
      }
    }).filter(Boolean);
    return (diff > 0 ? [...base.shift(),lang.shift()] : [...base.pop(),lang.pop()]).join(sep);
  }