const up = document.querySelector(".video-up");
const down = document.querySelector(".video-down");

up.addEventListener("click", () => {
	up.classList.toggle("click");
});

down.addEventListener("click", () => {
	down.classList.toggle("click");
});