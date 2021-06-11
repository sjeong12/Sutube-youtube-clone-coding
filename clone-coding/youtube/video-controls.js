const videoSection = document.querySelector(".video-section");
const video = document.querySelector("#video");
const controls = document.querySelector("#video-controls");
const playpause = document.querySelector("#playpause");
const progressBarLine = document.querySelector("#progress-bar-line");
const progressBar = document.querySelector("#progress-bar");
const fs = document.querySelector("#fs");
const currentTime = document.querySelector("#currentT");
const duration = document.querySelector("#duration");

let toastControls;
controls.addEventListener('click', function(e) {
	if (controls.getAttribute('data-state') == 'hidden')
	{
		controls.setAttribute('data-state', 'visible');
		if (!video.paused)
		{
			clearTimeout(toastControls);
			toastControls = setTimeout(function () {
				controls.setAttribute('data-state', 'hidden');
			}, 2000);
		}
	}
	else
		controls.setAttribute('data-state', 'hidden');
});

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

progressBarLine.addEventListener('mousedown', function(e) {
	let currentTime;

	function moveAt(e) {
		let pos = (e.pageX  - (progressBarLine.offsetLeft + progressBarLine.offsetParent.offsetLeft)) / progressBarLine.offsetWidth;
		currentTime = pos * video.duration;
		progressBar.style.width = currentTime / video.duration * 100 + "%";
		return currentTime;
	}
	moveAt(e);
	document.addEventListener('mousemove', moveAt);
	document.addEventListener('mouseup', function(e) {
		video.currentTime = currentTime;
		document.removeEventListener('mousemove', moveAt);
	});
});

// progressBarLine.addEventListener('click', function(e) {
// 	let pos = (e.pageX  - (progressBarLine.offsetLeft + progressBarLine.offsetParent.offsetLeft)) / progressBarLine.offsetWidth;
//  	video.currentTime = pos * video.duration;
// });

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
	}
	else {
		if (videoSection.requestFullscreen) videoSection.requestFullscreen();
		else if (videoSection.mozRequestFullScreen) videoSection.mozRequestFullScreen();
		else if (videoSection.webkitRequestFullScreen) document.body.webkitRequestFullScreen();
		else if (videoSection.msRequestFullscreen) videoSection.msRequestFullscreen();
		setFullscreenData(true);
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