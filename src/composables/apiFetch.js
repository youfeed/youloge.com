/**
 * 增加超时 
 * API接口请求
 **/
export default (pathname,body={},timeout=5000)=>{
    const {APIURL, APIKEY} = useConfig('youloge'),access_token = useAuth()?.access_token;
    const url = new URL(APIURL || '/');url.pathname = pathname;
    const headers = new Headers();
    headers.append('Organization',APIKEY);
    headers.append('Authorization',access_token);
    headers.append('Content-Type',`application/json`);
    body.id = crypto.randomUUID();
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
        }).then(res=>res.json()).then(({error,result})=>{
            if(error && error.code === 401){
                // 务必清楚本地Token 否则陷入无限循环
                useStorage('profile',{expire:0});
                location.reload();
                reject(error);
            }
            error ? reject(error) : resolve(result);
        }).catch(err=>reject(err))
    });
}
  