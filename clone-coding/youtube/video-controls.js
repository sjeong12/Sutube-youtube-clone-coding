const videoSection = document.querySelector(".video-section");
const storyboard = document.querySelector(".player-storyboard");
const storyboardImage = document.getElementById("player-storyboard-image");
const storyboardTime = document.getElementById("player-storyboard-time");
const video = document.getElementById("video");
const videoScreen = document.getElementById("video-screen");
const controls = document.getElementById("video-controls");
const unmuteText = document.getElementById("alert-unmute");
const playpause = document.getElementById("playpause");
const progress = document.querySelector(".progress");
const progressBarLine = document.getElementById("progress-bar-line");
const progressBar = document.getElementById("progress-bar");
const fs = document.getElementById("fs");
const currentTime = document.getElementById("currentT");
const duration = document.getElementById("duration");

// 음소거 해제
let alertUnmute = setTimeout(function () {
	unmuteText.setAttribute('data-state', 'small');
}, 4000);
function unmute() {
	video.muted = false;
	clearTimeout(alertUnmute);
	unmuteText.setAttribute('data-state', 'hidden');
}
unmuteText.addEventListener('click', unmute);

// 비디오 컨트롤
let toastControls;
controls.addEventListener('click', function() {
	if (video.muted)
	{
		unmute();
		return ;
	}
	if (controls.getAttribute('data-state') == 'hidden')
	{
		clearTimeout(toastControls);
		controls.setAttribute('data-state', 'visible');
		progress.setAttribute('data-state', 'visible');
		if (!video.paused)
		{
			toastControls = setTimeout(function () {
				controls.setAttribute('data-state', 'hidden');
				progress.setAttribute('data-state', 'hidden');
			}, 2000);
		}
	}
	else
	{
		controls.setAttribute('data-state', 'hidden');
		progress.setAttribute('data-state', 'hidden');
	}
});

// 비디오 play/pause
var changeButtonState = function(type) {
	if (type == 'playpause') {
		if (video.paused || video.ended) {
			playpause.setAttribute('data-state', 'pause');
			clearTimeout(toastControls);
			if (controls.getAttribute('data-state') !== 'screen')
			{
				controls.setAttribute('data-state', 'visible');
				progress.setAttribute('data-state', 'visible');
			}
		}
		else playpause.setAttribute('data-state', 'play');
	}
}
video.addEventListener('play', function() {
	changeButtonState('playpause');
	currentTime.innerText = getTime(new Date(this.currentTime * 1000));
	duration.innerText = ' / ' + getTime(new Date(this.duration * 1000));
}, false);
video.addEventListener('pause', function() {
	changeButtonState('playpause');
}, false);
playpause.addEventListener('click', function(e) {
	if (video.paused || video.ended) video.play();
	else video.pause();
});

// 비디오 progress bar 조작
progressBarLine.addEventListener('mousedown', function(e) {
	function moveProgress(e) {
		let pos = (e.pageX  - progressBarLine.offsetLeft) / progressBarLine.offsetWidth;
		video.currentTime = pos * video.duration;
		let width = video.currentTime / video.duration * 100;
		progressBar.style.width = width + "%";
		if (width < 20)
			storyboard.style.left = "20%"
		else if (width > 80)
			storyboard.style.left = "80%"
		else
			storyboard.style.left = width + "%";
		storyboardImage.src = getScreenshot(video, 0.35);
		storyboardTime.innerText = getTime(new Date(video.currentTime * 1000));
	}
	function upProgress(e) {
		videoScreen.setAttribute('data-state', 'hidden');
		document.removeEventListener('mousemove', moveProgress);
		if (video.paused)
			video.play();
		storyboard.setAttribute('aria-hidden', 'true');
		progress.setAttribute('data-state', 'hidden');
		controls.setAttribute('data-state', 'hidden');
		document.removeEventListener('mouseup', upProgress);
	}

	controls.setAttribute('data-state', 'screen');
	if (!video.paused)
		video.pause();
	moveProgress(e);
	storyboard.setAttribute('aria-hidden', 'false');
	progress.setAttribute('data-state', 'visible');
	videoScreen.setAttribute('data-state', 'visible');
	videoScreen.style.backgroundImage = "url(" + getScreenshot(video, 1) + ")";
	document.addEventListener('mousemove', moveProgress);
	document.addEventListener('mouseup', upProgress);
});

// progress bar 스토리보드 이미지 생성
function getScreenshot(video, scale) {
	scale = scale || 1;

	const canvas = document.createElement("canvas");
	canvas.width = video.clientWidth * scale;
	canvas.height = video.clientHeight * scale;
	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
	//image.crossOrigin = 'Anonymous';
	return canvas.toDataURL();
}

// 비디오와 progress bar 시간 연동
let isAlreadyShown = 0;
video.addEventListener("timeupdate", function(e) {
	currentTime.innerText = getTime(new Date(this.currentTime * 1000));
	progressBar.style.width = this.currentTime / this.duration * 100 + "%";

	showAdInVideo(this.currentTime, this.duration);
});
function getTime(time) {
	let minute = ("0" + time.getMinutes()).slice(-2);
	let second = ("0" + time.getSeconds()).slice(-2);
	return (minute + ':' + second);
}
//광고 보여주기
function showAdInVideo(current, duration) {
	const totalAdNum = 5;
	const shortAdTime = 5000;
	const longAdTime = 10000;

	for (let num = 1; num <= totalAdNum; num++)
	{
		if (isAlreadyShown < num && current > (duration - longAdTime/1000) * num/5)
		{
			isAlreadyShown++;
			let ad;
			let time;
			if (num % 2 == 0)
			{
				time = shortAdTime;
				ad = getNewAdUnderVideo();
			}
			else if (isAlreadyShown == 5)
			{
				time = longAdTime;
				ad = getNewAd("wide");
			}
			else {
				time = shortAdTime;
				ad = getNewAd("small");
			}
			ad.setAttribute('data-state', 'visible');
			setTimeout(function () {
				//ad.setAttribute('data-state', 'hidden');
				ad.parentNode.removeChild(ad);
			}, time);
		}
	}
}
//광고 생성
let isLeftAd = true;
function getNewAd(type) {
	let ad = document.createElement('div');
	let close = document.createElement('button');

	ad.className = 'ad-in-video ' + type + "-ad";
	ad.setAttribute('data-state', 'hidden');
	if (type == "small")
	{
		ad.style.top = "20px";
		if (isLeftAd)
			ad.style.left = "20px";
		else
			ad.style.right = "20px";
		isLeftAd = !isLeftAd;
	}
	else if (type == "wide")
	{
		ad.style.bottom = "20px";
		isLeftAd = true;
	}
	close.className = 'close-ad-button';
	close.innerHTML = '&times;';
	close.addEventListener("click", function() {
		// ad.setAttribute('data-state', 'hidden');
		ad.parentNode.removeChild(ad);
	});
	videoSection.append(ad);
	ad.append(close);
	return ad;
}
function getNewAdUnderVideo() {
	let ad = document.createElement('div');
	let close = document.createElement('button');

	ad.className = "ad-under-video";
	ad.setAttribute('data-state', 'hidden');
	close.className = 'close-ad-button';
	close.innerHTML = '&times;';
	close.addEventListener("click", function() {
		// ad.setAttribute('data-state', 'hidden');
		ad.parentNode.removeChild(ad);
	});
	document.querySelector(".info-section").append(ad);
	ad.append(close);
	return ad;
}

// 전체화면
fs.addEventListener("click", function(e) {
	if (isFullScreen()) {
		if (document.exitFullscreen) document.exitFullscreen();
		else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
		else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
		else if (document.msExitFullscreen) document.msExitFullscreen();
		setFullscreenData(false);
		if (fs.getAttribute('data-state') == 'fullscreen')
			fs.setAttribute('data-state', 'unfullscreen');
		else
			fs.setAttribute('data-state', 'fullscreen');
	}
	else {
		if (videoSection.requestFullscreen) videoSection.requestFullscreen();
		else if (videoSection.mozRequestFullScreen) videoSection.mozRequestFullScreen();
		else if (videoSection.webkitRequestFullScreen) document.body.webkitRequestFullScreen();
		else if (videoSection.msRequestFullscreen) videoSection.msRequestFullscreen();
		setFullscreenData(true);
		if (fs.getAttribute('data-state') == 'fullscreen')
			fs.setAttribute('data-state', 'unfullscreen');
		else
			fs.setAttribute('data-state', 'fullscreen');
	}
});
function isFullScreen() {
	return !!(document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}
function setFullscreenData(state) {
	document.body.setAttribute('data-fullscreen', !!state);
}