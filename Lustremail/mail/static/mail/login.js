
document.addEventListener("DOMContentLoaded", function (event) {
	let mailEntry = document.querySelector("#email");
	let passEntry = document.querySelector("#pass");
	let toggle = document.querySelector("#pass-toggle");
	let img = document.querySelector("#toggle-img");

	// document.addEventListener("input", function (event) {
		// console.log("Typing....");
	// })
	
	toggle.addEventListener("click", function (event) {
		if (img.src.slice(-8) === "moon.png")
		{
			img.src = "static/mail/sunny.png";
			passEntry.type = "text";
		} else if (img.src.slice(-9) === "sunny.png") {
			img.src = "static/mail/moon.png";
			passEntry.type = "password";
		}
	});
})
