const infoSection = document.querySelector(".info-section");
const nextSection = document.querySelector(".next-video-section");
const commentsClose = document.querySelector(".comments-close");
const commentsOpen = document.querySelector(".comments-open");
const openComments = document.querySelector(".open-comments");
const closeComments = document.querySelector(".close-comments");

const simpleText = document.querySelector(".simple-textarea");
const textarea = document.querySelector(".textarea");
const closeTextarea = document.querySelector(".comments-buttons");

const openTitle = document.querySelector(".open-title");
const videoContents = document.querySelector(".video-contents");


for (let i = 0; i < 20; i++) {
	let comment = document.createElement('li');

	comment.className = 'comments-item';
	comment.innerHTML = '<div class="comment">\
		<div class="channel-img"><img src="src/img/profile.png" alt="채널 이동"></div>\
		<div class="comment-text">\
			<div id="channel-title">채널 이름</div>\
			<div id="comment-content">이 곳에 댓글 내용이 적힙니다.</div>\
			<div id="comment-info"> 30분 전 • \
				<a href="#"><i class="fas fa-thumbs-up"></i><span>123</span></a>\
				<a href="#"><i class="fas fa-thumbs-down"></i></a>\
				<a href="#"><i class="fas fa-comment-dots"></i><span>1</span></a>\
			</div>\
		</div>\
		<a href="#"><i class="fas fa-ellipsis-v"></i></a>\
	</div>\
	<button class="open-reply">답글 더보기</button>';
	document.querySelector(".comments-list").append(comment);
}

for (let i = 0; i < 30; i++) {
	let nextVideo = document.createElement('li');

	nextVideo.className = 'next-video-item';
	nextVideo.innerHTML = '<div class="next-video-thumbnail">\
	<img src="src/img/thumbnail1.jpg" alt="영상 보기"></div>\
	<div class="next-video-meta">\
		<div class="next-video-info">\
			<div class="next-video-channel-img"><img src="src/img/profile.png" alt="채널 이동"></div>\
			<div class="title">\
				<div class="next-video-title">\
					Lorem ipsum dolor sit amet, consectetur adipiscing elit,\
					sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\
				</div>\
				<div class="channel-title">채널 이름 • 조회수 12만회</div>\
			</div>\
			<a href="#"><i class="fas fa-ellipsis-v"></i></a>\
		</div>\
	</div>';
	document.querySelector(".next-video-list").append(nextVideo);
}

openTitle.addEventListener("click", () => {
	openTitle.classList.toggle("open");
	videoContents.classList.toggle("open");
});

openComments.addEventListener("click", () => {
	infoSection.classList.add("open-comments");
	commentsClose.classList.add("open-comments");
	commentsOpen.classList.add("open-comments");
	nextSection.classList.add("open-comments");
});
closeComments.addEventListener("click", () => {
	infoSection.classList.remove("open-comments");
	commentsClose.classList.remove("open-comments");
	commentsOpen.classList.remove("open-comments");
	nextSection.classList.remove("open-comments");
});

simpleText.addEventListener("click", () => {
	simpleText.classList.toggle("active-textarea");
	textarea.classList.toggle("active-textarea");
	closeTextarea.classList.toggle("active-textarea");
	textarea.focus();
});
closeTextarea.addEventListener("click", () => {
	simpleText.classList.remove("active-textarea");
	textarea.classList.remove("active-textarea");
	closeTextarea.classList.remove("active-textarea");
});