import { showAdPreVideo } from './ad.js'
import { setControllsState } from './video-controls.js'
import { readFile } from './fileIO.js'

const videoSource = document.querySelector(".video-source");
let videolist = null;

(async function () {
	const videolistTxt = await readFile("playlist.txt");
	let videoCnt = localStorage.getItem("videoCnt");

	videolist = !videolistTxt ? [] : videolistTxt.split('\n');
	if(!videoCnt) videoCnt = 0;

	videoSource.setAttribute('src', `/data/video/${videolist[videoCnt]}`);
	localStorage.setItem("videoCnt", ++videoCnt % videolist.length);
	video.load();
})();

function getNextAd() {
	return new Promise((resolve) => {
		const lastAdSeq = localStorage.getItem("lastAdSeq");
		fetch(`/recommendedAd?lastAdSeq=${!lastAdSeq? 0 : lastAdSeq}`)
		.then(response => {
			if (response.ok) {
				resolve(response.json());
			} else {
				resolve(null);
			}
		})
		.catch(error => {
			resolve(null);
			console.error('There was a problem with the fetch operation:', error);
		});
	});
}

export async function playNextVideo() {
	const ad = await getNextAd();
	let videoCnt = localStorage.getItem("videoCnt");

	setControllsState('hidden');
	document.getElementById("playpause").setAttribute('data-state', 'play');
	videoSource.setAttribute('src', `/data/video/${videolist[videoCnt]}`);
	if (!!ad) {
		showAdPreVideo (10000, ad);
		setTimeout(function () { video.load(); }, 10000);
	} else {
		video.load();
	}

	localStorage.setItem("videoCnt", ++videoCnt % videolist.length);
	localStorage.setItem("adInPlayCnt", 0);
}
