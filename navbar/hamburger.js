const hamburger = document.querySelector(".hamburger");
const category = document.querySelector(".category");
const sns = document.querySelector(".sns");

hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("effect");
	hamburger.classList.remove("default");
	category.classList.toggle("open");
	sns.classList.toggle("open");
});