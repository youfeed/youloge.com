export default async (pathname,body)=>{
    const {VIPURL} = useConfig('youloge'),{signature} = useStorage('profile');
    const url = new URL(VIPURL || '/');url.pathname = pathname;
    
    if(signature == undefined){
      let profiled = await usePlus('login',{});
      useStorage('profile',profiled);
      return fetch(url.href,{
        method: 'POST',
        headers: { 'Authorization': `Youloge-VIP ${profiled.signature}`,'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    }
    return fetch(url.href,{
      method: 'POST',
      headers: { 'Authorization': `Youloge-VIP ${signature}`,'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  }
  