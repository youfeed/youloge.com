export const usePlus = (traget,options={})=>{
  const {APIKEY,NOTIFY} = useConfig('youloge'),HASH = `#${crypto.randomUUID()}`;
  options.apikey = APIKEY;options.notify = NOTIFY;
  const URL = `https://open.youloge.com/${traget}${HASH}`;
  const EVENTS = {[HASH]:{resolve:null,reject:null,iframe:null,fragme:null}};
  const onCreate = ({selector,istyle,fstyle})=>{
    const fragme = document.createElement('div');
    fragme.title = 'Youloge.dialog';
    const iframe = document.createElement('iframe');
    iframe.src = URL;iframe.name = HASH;
    fragme.style = fstyle ? fstyle : 'position: fixed; top: 0;left: 0;height: 100%; width: 100%; background: transparent; z-index: 2147483647; backdrop-filter: blur(2px);'
    iframe.style = istyle ? istyle : `border: 0; background: transparent; width: 100%; height: 100%;box-shadow: 0 0 1px #999;`;
    fragme.appendChild(iframe);
    (document.querySelector(selector) || document.body).appendChild(fragme);
    EVENTS['fragme'] = fragme;
  };onCreate(options);
  const onDestroy = ()=>{
    EVENTS['fragme'].remove();EVENTS[HASH] = null;
    window.removeEventListener('message',onMessage);
  }
  const onMessage = ({origin,data,source})=>{
    const [keys] = Object.keys(data),{method,params} = data[keys] || {};
    const {resolve,reject,event,modal,iframe} = EVENTS[keys];
    if(method && URL.startsWith(origin) && keys === HASH){
      const work = {
        'oninit':()=>source.postMessage({[keys]:{method:'onload',params:options}},origin),
        'success':()=>{onDestroy();resolve && resolve.call(this,params)},
        'error':()=>{onDestroy();reject && reject.call(this,params)},
        'resize':()=>{},
      };
      work[method] ? work[method]() : (event && event.call(this,params));
    }
  };window.addEventListener('message',onMessage,{capture:true});
  const promise = new Promise((resolve, reject) => (EVENTS[HASH].resolve = resolve,EVENTS[HASH].reject = reject));
  promise.emit = event => {
    EVENTS[HASH].event = event
    return promise; 
  };
  return promise;
}
export const useAuth = ()=>{
  try {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}')
    const {expire} = profile,timed = new Date().getTime() / 1000 >> 0;
    return expire > timed ? profile : false;
  } catch (error) {
    return false
  }
}
export const apiFetch = (pathname,body={})=>{
  const {APIURL, APIKEY} = useConfig('youloge');
  const url = new URL(APIURL || '/');url.pathname = pathname
  return fetch(url.href,{
    method: 'POST',
    headers: { 'Authorization': `Youloge-API ${APIKEY}`,'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
}
export const vipFetch = (pathname,body)=>{
  const {VIPURL} = useConfig('youloge'),{signature} = useAuth();
  const url = new URL(VIPURL || '/');url.pathname = pathname
  return fetch(url.href,{
    method: 'POST',
    headers: { 'Authorization': `Youloge-VIP ${signature}`,'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
}

export const useConfig = (key,val=false)=>{
  let Storage = JSON.parse(sessionStorage.getItem(key) || {})
  return val ? sessionStorage.setItem(key,JSON.stringify({...Storage,...val}))  : Storage; 
}
export const useStorage = (key,val=false)=>{
  let Storage = JSON.parse(localStorage.getItem(key) || {})
  return val ? localStorage.setItem(key,JSON.stringify({...Storage,...val}))  : Storage; 
}