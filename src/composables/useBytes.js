export default (bytes=0)=>{
    let units = ['B', 'KB', 'MB', 'GB', 'TB'],uniti = 0;
    while (bytes >= 1024 && ++uniti < units.length - 1) {
        bytes /= 1024;
    }
    return `${parseFloat(bytes.toFixed(2))} ${units[uniti]}`;
}