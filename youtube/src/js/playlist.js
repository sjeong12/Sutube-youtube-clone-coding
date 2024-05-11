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


	videolist = !videolistTxt ? [] : videolistTxt.split('\n');
	adlist = !adlistTxt ? [] : adlistTxt.split('\n');
	if(!localStorage.getItem('videoCnt')) localStorage.setItem("videoCnt", 1);
	if(!localStorage.getItem('adPrevPlayCnt')) localStorage.setItem("adPrevPlayCnt", 0);

	videoSource.setAttribute('src', `/data/video/${videolist[0]}`);
	video.load();
})();

export function playNextVideo() {
	let videoCnt = localStorage.getItem("videoCnt");
	let prevAdCnt = localStorage.getItem("adPrevPlayCnt");

	if (videoCnt >= videolist.length)
		videoCnt = 0;
	else if (videoCnt < 0)
		videoCnt = videolist.length + parseInt(videoCnt);

	setControllsState('hidden');
	document.getElementById("playpause").setAttribute('data-state', 'play');
	videoSource.setAttribute('src', `/data/video/${videolist[videoCnt]}`);
	if (prevAdCnt < adlist.length)
		showAdPreVideo (10000, adlist[prevAdCnt]);
	setTimeout(function () { video.load(); }, 10000);


	log("클릭", "다음 영상 시청", videolist[videoCnt]);
	localStorage.setItem("videoCnt", ++videoCnt);
	localStorage.setItem("adPrevPlayCnt", ++prevAdCnt);
	localStorage.setItem("adInPlayCnt", 0);
}
