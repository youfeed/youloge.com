export const apiFetch = (path,body={})=>{
  return fetch(`https://api.youloge.com/${path}`,{
    method: 'POST',
    headers: {
      'Authorization': `Youloge-API jWm6lKGBL6fOZ-eK9qzcPKpeC8j9qrHCMoFn9ZOx1H1OQDIV2yhDbUlg3gshuRWd-bJYUtIWl6BMHoOe-b5qRg`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res=>res.json())
}

export const onStorage = (key)=>{
  return localStorage.getItem(key) || {}
}