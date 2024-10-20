
export default (pathname,body={},Authenticate=false)=>{
    const {APIURL, APIKEY} = useConfig('youloge');
    const url = new URL(APIURL || '/');url.pathname = pathname;
    const headers = new Headers();
    headers.append('Content-Type',`application/json`);
    headers.append('Authorization',`Youloge-API ${APIKEY}`);
    if(Authenticate) headers.append('Authenticate',`Youloge-2SIGN ${useAuth()?.signature}`);

    return fetch(url.href,{
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    }).then(res=>res.json());
  }
  