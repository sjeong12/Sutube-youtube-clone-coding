const videoSection = document.querySelector(".video-section");
const storyboard = document.querySelector(".player-storyboard");
const storyboardImage = document.getElementById("player-storyboard-image");
const storyboardTime = document.getElementById("player-storyboard-time");
const video = document.getElementById("video");
const videoScreen = document.getElementById("video-screen");
const controls = document.getElementById("video-controls");
const playpause = document.getElementById("playpause");
const progress = document.querySelector(".progress");
const progressBarLine = document.getElementById("progress-bar-line");
const progressBar = document.getElementById("progress-bar");
const fs = document.getElementById("fs");
const currentTime = document.getElementById("currentT");
const duration = document.getElementById("duration");

let toastControls;
controls.addEventListener('click', function(e) {
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
		else {
			playpause.setAttribute('data-state', 'play');
	   }
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

progressBarLine.addEventListener('mousedown', function(e) {
	function moveProgress(e) {
		// let pos = (e.pageX  - (progressBarLine.offsetLeft + progressBarLine.offsetParent.offsetLeft)) / progressBarLine.offsetWidth;
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

function getScreenshot(video, scale) {
	scale = scale || 1;

	const canvas = document.createElement("canvas");
	canvas.width = video.clientWidth * scale;
	canvas.height = video.clientHeight * scale;
	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
	//image.crossOrigin = 'Anonymous';
	return canvas.toDataURL();
}

video.addEventListener("timeupdate", function(e) {
	currentTime.innerText = getTime(new Date(this.currentTime * 1000));
	progressBar.style.width = this.currentTime / this.duration * 100 + "%";
});

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

function getTime(time) {
	let minute = ("0" + time.getMinutes()).slice(-2);
	let second = ("0" + time.getSeconds()).slice(-2);
	return (minute + ':' + second);
}