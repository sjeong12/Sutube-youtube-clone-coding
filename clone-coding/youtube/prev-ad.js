const videoSource = document.querySelector(".video-source");

videoSource.setAttribute('src', 'http://localhost:8080/src/video/video2.mp4');
video.load();

function readTextFile(filePath) {
	var result = null;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", filePath, false);
	xmlhttp.send();
	if (xmlhttp.readyState == 4 && xmlhttp.status== 200 ) {
	  result = xmlhttp.responseText;
	}
	return result;
}

let playlist = readTextFile("./data/playlist.txt").split('\n');
for (let i = 0; i < playlist.length; i++)
	console.log("line: " + playlist[i]);