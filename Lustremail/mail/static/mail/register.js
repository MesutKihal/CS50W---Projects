
document.addEventListener("input", function (event) {
	// Email Validation
	const mailPattern = /^[\p{L},.0-9\s-]+$/u;
	let valid1 = document.querySelector("#validator1");
	let mail = document.querySelector("#email").value;
	if (mail.match(mailPattern))
	{
		valid1.innerText = "✓ Valid Username";
		valid1.setAttribute("class", "badge badge-success");
	} else if (!mail.match(mailPattern) && mail != "") {
		valid1.innerText = "X Non Valid Username";
		valid1.setAttribute("class", "badge badge-danger");
	} else {
		valid1.innerText = "";
		valid1.setAttribute("class", "");
	}
	// Password Validation
	const passPattern = /^[\S]{8,64}$/u;
	const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;
	const mediumPattern = /^(?=.*\d)[A-Za-z\d]{8,64}$/
	let valid2 = document.querySelector("#validator2");
	let pass = document.querySelector("#pass").value;
	if (pass.match(passPattern))
	{
		if (pass.match(strongPattern))
		{
			valid2.innerText = "✓ Strong";
			valid2.setAttribute("class", "badge badge-success");
		} else if(pass.match(mediumPattern)){
			valid2.innerText = "- Medium";
			valid2.setAttribute("class", "badge badge-warning");
		} else {
			valid2.innerText = "x Weak";
			valid2.setAttribute("class", "badge badge-danger");
		}
	} else if (pass === "") {
		valid2.innerText = "";
		valid2.setAttribute("class", "");
	} else {
		valid2.innerText = "Password should at least have 8 character and not have whitespaces";
		valid2.setAttribute("class", "badge badge-secondary");
	}
	// Confirmation
	let valid3 = document.querySelector("#validator3");
	let conFirm = document.querySelector("#confirm").value;
	if (pass == conFirm)
	{
		valid3.innerText = "✓ Passwords match";
		valid3.setAttribute("class", "badge badge-success");
	} else {
		valid3.innerText = "x Passwords don't match";
		valid3.setAttribute("class", "badge badge-danger");
	}
})

document.addEventListener("DOMContentLoaded", function (event){
	// Hide and Show Text
	let toggle = document.querySelector("#pass-toggle");
	let img = document.querySelector("#toggle-img");
	let passEntry = document.querySelector("#pass");
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
});