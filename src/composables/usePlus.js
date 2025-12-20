/**
 * @param {string} traget 
 * @param {object} options 
 * @returns 
 * @description 
 * Youloge.Plus
 * 打开登录 人机 支付 付款 收款 购物车等组件
 */
export default (traget, options = {}) => {
  const { APIKEY, NOTIFY } = useConfig('youloge'), HASH = `#${crypto.randomUUID()}`;
  options.apikey = APIKEY; options.notify = NOTIFY;
  const URL = `https://open.youloge.com/${traget}.html${HASH}`;
  const EVENTS = { [HASH]: { resolve: null, reject: null, iframe: null, fragme: null } };
  const PROMISE = new Promise((resolve, reject) => (EVENTS[HASH].resolve = resolve, EVENTS[HASH].reject = reject));
  PROMISE.emit = event => (EVENTS[HASH].event = event, PROMISE);
  const onCreate = ({ selector, istyle, fstyle }) => {
    const fragme = document.createElement('div');
    fragme.title = 'Youloge.dialog';
    const iframe = document.createElement('iframe');
    iframe.src = URL; iframe.name = HASH;
    fragme.style = fstyle ? fstyle : 'position: fixed; top: 0;left: 0;height: 100%; width: 100%; background: transparent; z-index: 2147483647; backdrop-filter: blur(2px);'
    iframe.style = istyle ? istyle : `border: 0; background: transparent; width: 100%; height: 100%;box-shadow: 0 0 1px #999;`;
    fragme.appendChild(iframe);
    (document.querySelector(selector) || document.body).appendChild(fragme);
    EVENTS['fragme'] = fragme;
  }; onCreate(options);
  const onDestroy = () => {
    EVENTS['fragme'].remove(); EVENTS[HASH] = null;
    window.removeEventListener('message', onMessage);
  };
  const preCheck = () => {
    fetch(URL, { method: 'HEAD' }).then(({ status }) => {
      status === 200 || (EVENTS[HASH].reject('Youloge.Plus.URL is not available'), onDestroy())
    })
  }; preCheck();
  const onMessage = ({ origin, data, source }) => {
    const [keys] = Object.keys(data), { method, params } = data[keys] || {};
    if (method && URL.startsWith(origin) && keys === HASH) {
      const { resolve, reject, event } = EVENTS[HASH];
      const work = {
        'oninit': () => source.postMessage({ [keys]: { method: 'onload', params: options } }, origin),
        'success': () => { onDestroy(); resolve && resolve.call(this, params) },
        'error': () => { onDestroy(); reject && reject.call(this, params) },
        'resize': () => { },
      };
      work[method] ? work[method]() : (event && event.call(this, params));
    }
  }; window.addEventListener('message', onMessage, { capture: true });
  return PROMISE;
}
