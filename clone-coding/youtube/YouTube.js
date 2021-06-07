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

openTitle.addEventListener("click", () => {
	openTitle.classList.toggle("open");
	videoContents.classList.toggle("open");
});

openComments.addEventListener("click", () => {
	infoSection.classList.toggle("open-comments");
	commentsClose.classList.toggle("open-comments");
	commentsOpen.classList.toggle("open-comments");
	nextSection.classList.toggle("open-comments");
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