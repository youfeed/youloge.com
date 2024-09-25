export default (second)=>{
    let min = String(second / 60 >> 0).padStart(2,'0');
    let sec = String(second % 60 >> 0).padStart(2,'0');
    return  `${min}:${sec}`;
  }
  