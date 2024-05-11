import { playNextVideo } from './playlist.js';
import { showAdInVideo } from './ad.js';

const video = document.getElementById("video");
const videoScreen = document.getElementById("video-screen");
const videoSection = document.querySelector(".video-section");
const duration = document.getElementById("duration");
const currentTime = document.getElementById("currentT");
const controls = document.getElementById("video-controls");
const unmuteText = document.getElementById("alert-unmute");
const progress = document.querySelector(".progress");
const progressBar = document.getElementById("progress-bar");
const progressBarLine = document.getElementById("progress-bar-line");
const storyboard = document.querySelector(".player-storyboard");
const storyboardImage = document.getElementById("player-storyboard-image");
const storyboardTime = document.getElementById("player-storyboard-time");

// 음소거 해제
let alertUnmute = setTimeout(()=> {unmuteText.setAttribute('data-state', 'small');}, 4000);
function unmute() {
	video.muted = false;
	clearTimeout(alertUnmute);
	unmuteText.setAttribute('data-state', 'hidden');
}
unmuteText.addEventListener('click', unmute);

controls.addEventListener('click', function(e) {
	if (video.muted)
	{
		unmute();
		return ;
	}
	let target = e.target;
	while (!target.classList.contains('controls-btn'))
	{
		target = target.parentNode;
		if (target.className == 'video-section')
		{
			target = null;
			showControlsEvent();
			return;
		}
	}
	setControllsState('hidden');
	switch (target.id) {
		case 'backward':
			backwardEvent();
			return;
		case 'forward':
			forwardeEvent();
			return;
		case 'playpause':
			playpauseEvent(target);
			return;
		case 'fs':
			fullscreenEvent(target);
			return;
	}
	return;
});

// 컨트롤러/프로그레스바 상태 관리
export function setControllsState(state) {
	switch (state) {
		case 'visible':
			controls.setAttribute('data-state', 'visible');
			progress.setAttribute('data-state', 'visible');
			return;
		case 'hidden':
			controls.setAttribute('data-state', 'hidden');
			progress.setAttribute('data-state', 'hidden');
			return;
		case 'screen':
			controls.setAttribute('data-state', 'screen');
			return;
	}
}

// 비디오 컨트롤러 보기
let toastControls;
function showControlsEvent() {
	if (controls.getAttribute('data-state') !== 'hidden')
	{
		setControllsState('hidden');
		return;
	}
	clearTimeout(toastControls);
	setControllsState('visible');
	if (!video.paused)
		toastControls = setTimeout(()=> { setControllsState('hidden'); }, 2000);
	return;
}
// 이전 영상
function backwardEvent() {
	localStorage.setItem("videoCnt", localStorage.getItem("videoCnt") - 2);
	video.pause();
	playNextVideo();
	return;
}
// 다음 영상
function forwardeEvent() {
	video.pause();
	playNextVideo();
	return;
}
// 재생/정지
function playpauseEvent(target) {
	if (video.paused) {
		target.setAttribute('data-state', 'play');
		video.play();
		return;
	}
	clearTimeout(toastControls);
	target.setAttribute('data-state', 'pause');
	if (controls.getAttribute('data-state') == 'hidden')
		setControllsState('visible');
	video.pause();
	return;
}
// 전체화면
function fullscreenEvent(target) {
	if (isFullScreen()) {
		if (document.exitFullscreen) document.exitFullscreen();
		else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
		else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
		else if (document.msExitFullscreen) document.msExitFullscreen();
		document.body.setAttribute('data-fullscreen', false);
		if (target.getAttribute('data-state') == 'fullscreen')
			target.setAttribute('data-state', 'unfullscreen');
		else
			target.setAttribute('data-state', 'fullscreen');
	}
	else {
		if (videoSection.requestFullscreen) videoSection.requestFullscreen();
		else if (videoSection.mozRequestFullScreen) videoSection.mozRequestFullScreen();
		else if (videoSection.webkitRequestFullScreen) document.body.webkitRequestFullScreen();
		else if (videoSection.msRequestFullscreen) videoSection.msRequestFullscreen();
		document.body.setAttribute('data-fullscreen', true);
		if (target.getAttribute('data-state') == 'fullscreen')
			target.setAttribute('data-state', 'unfullscreen');
		else
			target.setAttribute('data-state', 'fullscreen');
	}
	return;
}
function isFullScreen() {
	return !!(document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}

// 비디오 재생/정지 이벤트
video.addEventListener('play', function() {
	currentTime.innerText = getTime(this.currentTime);
	duration.innerText = ' / ' + getTime(this.duration);
}, false);
video.addEventListener('pause', function() {
	if (video.ended) playNextVideo();
}, false);

// 비디오 재생중 - progress bar 시간 연동
video.addEventListener("timeupdate", function(e) {
	currentTime.innerText = getTime(this.currentTime);
	progressBar.style.width = this.currentTime / this.duration * 100 + "%";

	showAdInVideo(this.currentTime, this.duration);
});

//비디오 progress bar 조작
progressBarLine.addEventListener('mousedown', function(e) {
	clearTimeout(toastControls);
	moveProgress(e);
	setControllsState('screen');
	toggleProgressEventListener(true);
	toggleVideoPlay(false);
	toggleVideoScreen(true);
	progress.setAttribute('data-state', 'visible');
});
//계산
function computeVideoCurrentTime(pageX, duration) {
	return ((pageX  - progressBarLine.offsetLeft) / progressBarLine.offsetWidth) * duration;
}
function computeVideoProgressWidth(currentTime, duration) {
	return currentTime / duration * 100;
}
// 액션
function moveProgress(e) {
	const currentTime = computeVideoCurrentTime(e.pageX, video.duration);
	const width = computeVideoProgressWidth(currentTime, video.duration) + "%";

	video.currentTime = currentTime;
	progressBar.style.width = width;
	storyboard.style.left = width;
	storyboardImage.src = getScreenshot(video, 0.35);
	storyboardTime.innerText = getTime(video.currentTime);
	storyboard.setAttribute('aria-hidden', 'false');
}
function upProgress() {
	setControllsState('hidden');
	toggleProgressEventListener(false);
	toggleVideoPlay(true);
	toggleVideoScreen(false);
	storyboard.setAttribute('aria-hidden', 'true');
}
function toggleProgressEventListener(isOn) {
	if (isOn) {
		document.addEventListener('mousemove', moveProgress);
		document.addEventListener('mouseup', upProgress);
	} else {
		document.removeEventListener('mousemove', moveProgress);
		document.removeEventListener('mouseup', upProgress);
	}
}
function toggleVideoScreen(isOn) {
	if (isOn) {
		videoScreen.style.backgroundImage = "url(" + getScreenshot(video, 1) + ")";
		videoScreen.setAttribute('data-state', 'visible');
	} else {
		videoScreen.setAttribute('data-state', 'hidden');
	}
}
function toggleVideoPlay(isOn) {
	if (isOn && video.paused) {
		video.play();
		document.getElementById("playpause").setAttribute('data-state', 'play');
	} else if (!isOn && !video.paused) {
		video.pause();
	}
}

// progress bar 스토리보드 이미지 생성
function getScreenshot(video, scale) {
	scale = scale || 1;

	const canvas = document.createElement("canvas");
	// 계산
	canvas.width = video.clientWidth * scale;
	canvas.height = video.clientHeight * scale;
	//액션
	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
	return canvas.toDataURL();
}

function getTime(currentTime) {
	const time = new Date(currentTime * 1000);
	const minute = ("0" + time.getMinutes()).slice(-2);
	const second = ("0" + time.getSeconds()).slice(-2);
	return (minute + ':' + second);
}