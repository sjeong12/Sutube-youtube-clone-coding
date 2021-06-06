const titleArea = document.querySelector(".title-area");
const videoButtons = document.querySelector(".video-buttons");
const channelArea = document.querySelector(".channel-area");
const nextVideo = document.querySelector(".next-video");
const commentsClose = document.querySelector(".comments-close");
const commentsOpen = document.querySelector(".comments-open");
const openTitle = document.querySelector("#open-title");
const openComments = document.querySelector(".open-comments");
const closeComments = document.querySelector(".close-comments");

const simpleText = document.querySelector(".simple-textarea");
const textarea = document.querySelector(".textarea");
const closeTextarea = document.querySelector(".comments-buttons");

openTitle.addEventListener("click", () => {
});

openComments.addEventListener("click", () => {
	titleArea.classList.toggle("open-comments");
	videoButtons.classList.toggle("open-comments");
	channelArea.classList.toggle("open-comments");
	commentsClose.classList.toggle("open-comments");
	commentsOpen.classList.toggle("open-comments");
	nextVideo.classList.toggle("open-comments");
});
closeComments.addEventListener("click", () => {
	titleArea.classList.remove("open-comments");
	videoButtons.classList.remove("open-comments");
	channelArea.classList.remove("open-comments");
	commentsClose.classList.remove("open-comments");
	commentsOpen.classList.remove("open-comments");
	nextVideo.classList.remove("open-comments");
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