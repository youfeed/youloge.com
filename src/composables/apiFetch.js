
export default (pathname,body={})=>{
    const {APIURL, APIKEY} = useConfig('youloge');
    const url = new URL(APIURL || '/');url.pathname = pathname
    return fetch(url.href,{
      method: 'POST',
      headers: { 'Authorization': `Youloge-API ${APIKEY}`,'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(res=>res.json());
  }
  