
export default (pathname,body={},Authenticate=true)=>{
    const {APIURL, APIKEY} = useConfig('youloge');
    const url = new URL(APIURL || '/');url.pathname = pathname;
    const headers = new Headers();
    headers.append('Content-Type',`application/json`);
    headers.append('Youloge-Key',` ${APIKEY}`);
    if(Authenticate) headers.append('Youloge-Token',useAuth()?.access_token);

    return fetch(url.href,{
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    }).then(res=>res.json());
}
  