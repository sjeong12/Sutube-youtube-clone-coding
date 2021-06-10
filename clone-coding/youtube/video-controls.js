const videoSection = document.querySelector(".video-section");
const video = document.querySelector("#video");
const controls = document.querySelector("#video-controls");
const playpause = document.querySelector("#playpause");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector("#progress-bar");
const fs = document.querySelector("#fs");
const currentTime = document.querySelector("#currentT");
const duration = document.querySelector("#duration");

controls.setAttribute('data-state', 'visible');

var changeButtonState = function(type) {
	if (type == 'playpause') {
	   if (video.paused || video.ended) {
		  playpause.setAttribute('data-state', 'pause');
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

progress.addEventListener('click', function(e) {
	var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
	video.currentTime = pos * video.duration;
});

video.addEventListener("timeupdate", function(e) {
	currentTime.innerText = getTime(new Date(this.currentTime * 1000));
	progressBar.style.width = this.currentTime / this.duration * 100 + "%";
});

video.addEventListener("webkitfullscreenchange", function(e) {
	var isFullscreenNow = document.webkitFullscreenElement !== null
	alert('Fullscreen ' + isFullscreenNow)
});

fs.addEventListener("click", function(e) {
	if (isFullScreen()) {
		if (document.exitFullscreen) document.exitFullscreen();
		else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
		else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
		else if (document.msExitFullscreen) document.msExitFullscreen();
		setFullscreenData(false);
	}
	else {
		if (videoSection.requestFullscreen) videoSection.requestFullscreen();
		else if (videoSection.mozRequestFullScreen) videoSection.mozRequestFullScreen();
		else if (videoSection.webkitRequestFullScreen) videoSection.webkitRequestFullScreen();
		else if (videoSection.msRequestFullscreen) videoSection.msRequestFullscreen();
		setFullscreenData(true);
	}
});

function isFullScreen() {
	return !!(document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}

function setFullscreenData(state) {
	videoSection.setAttribute('data-fullscreen', !!state);
}

function getTime(time) {
	let minute = ("0" + time.getMinutes()).slice(-2);
	let second = ("0" + time.getSeconds()).slice(-2);
	return (minute + ':' + second);
}