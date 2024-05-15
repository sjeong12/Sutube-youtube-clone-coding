import { printLog } from './fileIO.js'

function log(action, target, msg) {
	const logMsg = {
		timestamp: getTimestamp(),
		action: action,
		target: target,
		contents: msg,
		uuid: getCookieUuid()
	};
	printLog(JSON.stringify(logMsg));
}


function setCookieUuid(){
	const uuid = self.crypto.randomUUID();
	const date = new Date();

  	date.setTime(date.getTime() + 48*60*60*1000);
    document.cookie=`uuid=${uuid}; expires=${date.toGMTString()}`;
	return uuid;
}

function getCookieUuid(){
    if(document.cookie){
        const cookie=document.cookie.split('uuid=');
        if(cookie.length >= 2){
            const uuid=cookie[1].split(';');
            return uuid[0];
        }
    }
    return setCookieUuid();
}

function getTimestamp() {
	const now = new Date();
	const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(4, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export { log };