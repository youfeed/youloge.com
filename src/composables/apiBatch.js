/**
 * 增加超时 
 * 批量请求：不做权限判断 返回resolve
 **/
export default (pathname,params=[],timeout=5000)=>{
    const {APIURL, APIKEY} = useConfig('youloge'),access_token = useAuth()?.access_token;
    const url = new URL(APIURL || '/');url.pathname = pathname;
    const headers = new Headers();
    headers.append('Organization',APIKEY);
    headers.append('Authorization',access_token);
    headers.append('Content-Type',`application/json`);
    //
    return new Promise((resolve,reject)=>{
        if(!Array.isArray(params)) reject({err:408,msg:'参数需要数组'});
        const controller = new AbortController();
        const signal = controller.signal;
        const body = params.map(is=>(is.id=crypto.randomUUID(),is));
        setTimeout(()=>{
            controller.abort();reject({err:408,msg:'请求超时'});
        },timeout);
        fetch(url.href,{
            method: 'POST',
            headers: headers,
            signal:signal,
            body: JSON.stringify(body),
        }).then(res=>res.json()).then(res=>{
            resolve(res);
        }).catch(err=>reject(err))
    });
}
  