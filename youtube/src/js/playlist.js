import { showAdPreVideo } from './ad.js'
import { setControllsState } from './video-controls.js'
import { readFile } from './fileIO.js'
import { log } from './logger.js'

const videoSource = document.querySelector(".video-source");
let videolist = null;
let adlist = null;

(async function () {
	const videolistTxt = await readFile("playlist.txt");
	const adlistTxt = await readFile("ad.txt");
	let videoCnt = localStorage.getItem("videoCnt");
	let prevAdCnt = localStorage.getItem("adPrevPlayCnt");

	videolist = !videolistTxt ? [] : videolistTxt.split('\n');
	adlist = !adlistTxt ? [] : adlistTxt.split('\n');
	if(!videoCnt) videoCnt = 0;
	if(!prevAdCnt) prevAdCnt = 0;

	videoSource.setAttribute('src', `/data/video/${videolist[videoCnt]}`);
	localStorage.setItem("videoCnt", ++videoCnt % videolist.length);
	localStorage.setItem("adPrevPlayCnt", ++prevAdCnt % adlist.length);
	video.load();
})();

export function playNextVideo() {
	let videoCnt = localStorage.getItem("videoCnt");
	let prevAdCnt = localStorage.getItem("adPrevPlayCnt");

	setControllsState('hidden');
	document.getElementById("playpause").setAttribute('data-state', 'play');
	videoSource.setAttribute('src', `/data/video/${videolist[videoCnt]}`);
	if (prevAdCnt < adlist.length)
		showAdPreVideo (10000,  adlist[prevAdCnt]);
	setTimeout(function () { video.load(); }, 10000);


	log("클릭", "다음 영상 시청", videolist[videoCnt]);
	localStorage.setItem("videoCnt", ++videoCnt % videolist.length);
	localStorage.setItem("adPrevPlayCnt", ++prevAdCnt % adlist.length);
	localStorage.setItem("adInPlayCnt", 0);
}
