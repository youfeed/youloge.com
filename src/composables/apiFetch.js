/**
 * 增加超时 
 * 批量请求：不做权限判断 返回resolve
 **/
export default (pathname,body={},timeout=5000)=>{
    const {APIURL, APIKEY} = useConfig('youloge'),access_token = useAuth()?.access_token;
    const url = new URL(APIURL || '/');url.pathname = pathname;
    const headers = new Headers();
    headers.append('Organization',APIKEY);
    headers.append('Authorization',access_token);
    headers.append('Content-Type',`application/json`);
    //
    return new Promise((resolve,reject)=>{
        const controller = new AbortController();
        const signal = controller.signal;
        setTimeout(()=>{
            controller.abort();reject({err:408,msg:'请求超时'});
        },timeout);
        fetch(url.href,{
            method: 'POST',
            headers: headers,
            signal:signal,
            body: JSON.stringify(body),
        }).then(res=>res.json()).then(res=>{
            if(Array.isArray(res)){
                resolve(res);
            }else{
                if(res.err === 401) (location.reload(),reject(res));
                res.err === 200 ? resolve(res) : reject(res);

            }
        }).catch(err=>reject(err))
    });
}
  