import { showAdPreVideo } from './ad.js'

const videoSource = document.querySelector(".video-source");

let playlist = readTextFile("./data/playlist.txt").split('\n');
let adlist = readTextFile("./data/ad.txt").split('\n');
videoSource.setAttribute('src', 'http://localhost:8080/src/video/video1.mp4');
video.load();

if(!localStorage.getItem('videoCnt')) localStorage.setItem("videoCnt", 0);
if(!localStorage.getItem('adPrevPlayCnt')) localStorage.setItem("adPrevPlayCnt", 0);

export function playNextVideo() {
	let videoCnt = localStorage.getItem("videoCnt");
	let prevAdCnt = localStorage.getItem("adPrevPlayCnt");

	if (videoCnt >= playlist.length)
		videoCnt = 0;
	videoSource.setAttribute('src', playlist[videoCnt]);
	showAdPreVideo (10000, adlist[prevAdCnt]);
	setTimeout(function () {
		video.load();
	}, 10000);
	localStorage.setItem("videoCnt", ++videoCnt);
	localStorage.setItem("adPrevPlayCnt", ++prevAdCnt);
	localStorage.setItem("adInPlayCnt", 0);
}

function readTextFile(filePath) {
	let result = null;
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", filePath, false);
	xmlhttp.send();
	if (xmlhttp.readyState == 4 && xmlhttp.status== 200 ) {
	  result = xmlhttp.responseText;
	}
	return result;
}
