export default (pathname,body)=>{
    const {VIPURL} = useConfig('youloge'),{signature} = useAuth();
    const url = new URL(VIPURL || '/');url.pathname = pathname
    return fetch(url.href,{
      method: 'POST',
      headers: { 'Authorization': `Youloge-VIP ${signature}`,'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  }
  