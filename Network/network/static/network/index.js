document.addEventListener("DOMContentLoaded", (event) => {
	// Clear Local Storage
	window.localStorage.clear()
	// Select Divs
	let posts_div = document.querySelector("#posts");
	let posts_btn = document.querySelector("#posts_btn");
	let following_btn = document.getElementById("following_btn");
	let profile_btn = document.getElementById("profile");
	let next = document.querySelector("#next");
	let prev = document.querySelector("#prev");
	// Set the default values for n and name
	if (!window.localStorage.getItem("name"))
	{
		window.localStorage.setItem("name", "all_posts");
	}
	if (!window.localStorage.getItem("n"))
	{
		window.localStorage.setItem("n", 1);
	}
	if (!window.localStorage.getItem("id"))
	{
		if (document.querySelector("#user_id"))
		{
			window.localStorage.setItem("id", Number(document.querySelector("#user_id").innerText));
		} else {
			window.localStorage.setItem("id", 0);
		}
	}
	// If a nav button is clicked
	// 	navigate to that page.
	let n = Number(window.localStorage.getItem("n"));
	posts_btn.addEventListener("click", (event) => {
		window.localStorage.setItem("name", "all_posts");
		let name = window.localStorage.getItem("name");
		page(name, n)
	});
	if (following_btn)
	{
		following_btn.addEventListener("click", (event) => {
			window.localStorage.setItem("name", "following");
			let name = window.localStorage.getItem("name");
			page(name, n)
		});
	}

	if (profile_btn)
	{
		profile_btn.addEventListener("click", (event) => {
			let id = Number(document.querySelector("#user_id").innerText);
			window.localStorage.setItem("name", "profile");
			let name = window.localStorage.getItem("name");
			page(name, n, id);
		});
	}
	if (posts_div)
	{
		let name = window.localStorage.getItem("name");
		page(name, n);
	}
	// If the Previous button or the next button
	// 	 is clicked navigate to that page.
	if (prev)
	{
		prev.addEventListener("click", function (event) {
			let name = window.localStorage.getItem("name");
			if (name === "profile")
			{
				let id = window.localStorage.getItem("id");
				let p = Number(document.querySelector("#paginator").innerText)
				page(name, p-1, id);
			} else {
				let p = Number(document.querySelector("#paginator").innerText)
				page(name, p-1);
			}
		});
	}
	if (next)
	{
		next.addEventListener("click", function (event) {
			let name = window.localStorage.getItem("name");
			if (name === "profile")
			{
				let id = window.localStorage.getItem("id");
				let p = Number(document.querySelector("#paginator").innerText)
				page(name, p+1, id);
			} else {
				let p = Number(document.querySelector("#paginator").innerText)
				page(name, p+1);
			}
		})
	}
})


function page(name, n, id)
{
	// The all posts page
	if (name === "all_posts")
	{
		// if the user is not logged redirect to all posts page
		if (window.location.href.slice(-5) === "login" || window.location.href.slice(-8) === "register")
		{
			window.location.replace("/");
			return;
		}
		// Select Divs
		let posts_div = document.querySelector("#posts");
		let following_div = document.querySelector("#following");
		let new_div = document.querySelector("#new");
		let control_div = document.querySelector("#control-new");
		// If the New Post button is clicked display the new post form
		if (new_div)
		{
			new_div.style.display = "none";
		}
		if (control_div)
		{
			control_div.style.display = "block";
		}
		if (posts_div.style.display === "block" && n === 1)
		{
			let creator = document.querySelector("#creator");
			if (creator)
			{
				creator.addEventListener("click", (event) => {
					document.querySelector("#new").style.display = "block";
					document.querySelector("#control-new").style.display = "none";
				})
			}
		}
		let new_form = document.querySelector("#new");
		if (new_form)
		{
			new_form.addEventListener("submit", (event) => {
				create_post();
				page("all_posts", n);
			})
		}
		// Hide other pages while displaying this page
		posts_div.style.display = "block";
		following_div.style.display = "none";
		document.querySelector("#profile-div").style.display = "none";
		document.querySelector("#user_details").style.display = "none";
		document.querySelector("#profile-div").innerHTML = "";
		following_div.innerHTML = "";
		
		// Get posts from API
		fetch(`posts/${name}/${n}/1`, {
			headers: {
				"Content-Type": "application/json"
			}
		}).then(response => response.json().then(data => {
			// if (!window.localStorage.getItem("ApiData_1"))
			// {
				// window.localStorage.setItem("ApiData_1", JSON.stringify(data));
			// }
			
			// const ApiData_1 = JSON.parse(window.localStorage.getItem("ApiData_1"));
			const ApiData_1 = data;
			
			document.querySelector("#paginator").innerText = n;
			// Show PREV and NEXT button if the pages exist
			if (ApiData_1[ApiData_1.length - 1].hasNext)
			{
				document.querySelector("#next").style.display = "block";
			} else {
				document.querySelector("#next").style.display = "none";
			}
			if (ApiData_1[ApiData_1.length - 1].hasPrev)
			{
				document.querySelector("#prev").style.display = "block";
			} else {
				document.querySelector("#prev").style.display = "none";
			}
			// Clear all posts page div
			if (posts_div.innerText != "")
			{
				posts_div.innerHTML = "";
			}
			
			if (posts_div.innerText === "")
			{
				for (var i = 0; i < ApiData_1.length - 1; i++)
				{
					// Create HTML element
					let usr = document.createElement("a");
					let edit_btn = `<button id="editBtn${ApiData_1[i].post_id}" class="btn btn-outline-info ml-4 mr-2" onclick="edit_view(${ApiData_1[i].post_id})">Edit</button>`
					let content = document.createElement("p");
					let container = document.createElement("div");
					let row = document.createElement("div");
					let time = document.createElement("div");
					let img = document.createElement("img");
					let info = document.createElement("p");
					
					container.setAttribute("class", "container mx-auto bg-dark mt-2");
					container.setAttribute("id", `post${ApiData_1[i].post_id}`);
					usr.setAttribute("class", "row text-primary mt-2 mb-2 ml-4 mr-4");
					row.setAttribute("id", `row${ApiData_1[i].post_id}`);
					content.setAttribute("class", "row text-light mt-2 mb-2 ml-4 mr-4");
					content.setAttribute("id", `content${ApiData_1[i].post_id}`);
					img.setAttribute("src", "");
					info.setAttribute("class", "row justify-content-around mt-2 mb-2 ml-2 mr-2");
					time.setAttribute("class", "row mt-2 mb-2 ml-4 mr-4");
					row.setAttribute("class", "container");
					// Write posts on the DOM
					
					usr.innerText = ApiData_1[i].username;
					usr.setAttribute("onclick", `window.localStorage.setItem('name', 'profile');page('profile', 1, ${ApiData_1[i].user_id});`)
					
					// if (ApiData_1[i].isUser)
					// {
						// usr.insertAdjacentHTML('beforeend', edit_btn);
					// }
					content.innerText = ApiData_1[i].content;
					time.insertAdjacentHTML('beforeend', `<small class="text-warning">${ApiData_1[i].created_at}</small>`);
					if (ApiData_1[i].isLogged)
					{
						if (ApiData_1[i].LikedByMe)
						{
							info.insertAdjacentHTML('beforeend', `<a class="btn btn-dark mb-2" onclick="like('${name}${i}', ${ApiData_1[i].post_id})"><img id="${name}${i}" height="16" width="16" src="static/network/heart.png"></img></a>`);
						} else {
							info.insertAdjacentHTML('beforeend', `<a class="btn btn-dark mb-2" onclick="like('${name}${i}', ${ApiData_1[i].post_id})"><img id="${name}${i}" height="16" width="16" src="static/network/dark.png"></img></a>`);
						}
					} else {
						info.insertAdjacentHTML('beforeend', `<a class="btn btn-dark mb-2" onclick="window.location.replace('/login')"><img id="${name}${i}" height="16" width="16" src="static/network/dark.png"></img></a>`);
					}
					info.insertAdjacentHTML('beforeend', `<small class="col-2 text-light">${ApiData_1[i].likes} Like(s)</small>`);
					row.append(usr);
					if (ApiData_1[i].isUser)
					{
						row.insertAdjacentHTML('beforeend', edit_btn);
					}
					row.append(time);
					row.append(content);
					row.append(document.createElement("hr"));
					row.append(info);
					container.append(row);
					posts_div.append(container);
				}
			}
		})).catch(error => console.log(error));
	}
	if (name === "following")
	{
		document.querySelector("#posts").style.display = "none";
		document.querySelector("#following").style.display = "block";
		document.querySelector("#profile-div").style.display = "none";
		document.querySelector("#new").style.display = "none";
		document.querySelector("#control-new").style.display = "none";
		document.querySelector("#user_details").style.display = "none";
		document.querySelector("#profile-div").innerHTML = "";
		document.querySelector("#following").innerHTML = "";
		
		fetch(`posts/${name}/${n}/1`, {
			headers: {
				"Content-Type": "application/json"
			}
		}).then(response => response.json()).then(data => {
			// if (!window.localStorage.getItem("following_posts"))
			// {
				// window.localStorage.setItem("following_posts", JSON.stringify(data));
			// }
			// let following_posts = JSON.parse(window.localStorage.getItem("following_posts"));
			const following_posts = data;
			
			let following_div = document.querySelector("#following");
			document.querySelector("#paginator").innerText = n;
			// Show PREV and NEXT button if the pages exist
			if (following_posts[following_posts.length - 1].hasNext)
			{
				document.querySelector("#next").style.display = "block";
			} else {
				document.querySelector("#next").style.display = "none";
			}
			if (following_posts[following_posts.length - 1].hasPrev)
			{
				document.querySelector("#prev").style.display = "block";
			} else {
				document.querySelector("#prev").style.display = "none";
			}
			// Clear the following page div
			if (following_div.innerText != "New Post" && following_div.innerText != "")
			{
				following_div.innerHTML = "";
			}
			if (following_div.innerText === "")
			{
				for (var i = 0; i < following_posts.length - 1; i++)
				{
					// Create HTML elements
				
					let usr = document.createElement("div");
					let content = document.createElement("p");
					let container = document.createElement("div");
					let img = document.createElement("img");
					let info = document.createElement("p");
					let time = document.createElement("div");
					
					container.setAttribute("class", "container mx-auto bg-dark mt-2");
					usr.setAttribute("class", "row text-primary mt-2 mb-2 ml-4 mr-4");
					content.setAttribute("class", "row text-light mt-2 mb-2 ml-4 mr-4");
					img.setAttribute("src", "");
					info.setAttribute("class", "row justify-content-around mt-2 mb-2 ml-2 mr-2");
					time.setAttribute("class", "row mt-2 mb-2 ml-4 mr-4");
					// Write posts on the DOM
					
					usr.innerText = following_posts[i].username;
					usr.setAttribute("onclick", `window.localStorage.setItem('name', 'profile');page('profile', 1, ${following_posts[i].user_id});`)
					content.innerText = following_posts[i].content;
					if (following_posts[i].isLogged)
					{
						if (following_posts[i].LikedByMe)
						{
							info.insertAdjacentHTML('beforeend', `<a class="btn btn-dark mb-2" onclick="like('${name}${i}', ${following_posts[i].post_id})"><img id="${name}${i}" height="16" width="16" src="static/network/heart.png"></img></a>`);
						} else {
							info.insertAdjacentHTML('beforeend', `<a class="btn btn-dark mb-2" onclick="like('${name}${i}', ${following_posts[i].post_id})"><img id="${name}${i}" height="16" width="16" src="static/network/dark.png"></img></a>`);
						}
					} else {
						info.insertAdjacentHTML('beforeend', `<a class="btn btn-dark mb-2" onclick="window.location.replace('/login')"><img id="like_img${i}" height="16" width="16" src="static/network/dark.png"></img></a>`);
					}
					time.insertAdjacentHTML('beforeend', `<small class="text-warning">${following_posts[i].created_at}</small>`);
					info.insertAdjacentHTML('beforeend', `<small class="col-2 text-light">${following_posts[i].likes} Like(s)</small>`);
					container.append(usr);
					container.append(time);
					container.append(content);
					container.append(document.createElement("hr"));
					container.append(info);
					
					following_div.append(container);
				}
			}
		}).catch(error => console.log(error));
	}
	if (name === "profile")
	{
		let profile_div = document.querySelector("#profile-div");
		let posts_div = document.querySelector("#posts");
		let following_div = document.querySelector("#following");
		let details = document.createElement("p");
		let user_details = document.querySelector("#user_details");
		let username = document.createElement("p");
		let following_label = document.createElement("p");
		let followers_label = document.createElement("p");
		let follow = document.createElement("div");
		window.localStorage.setItem("id", Number(id));
		
		details.setAttribute("class", "row justify-content-center");
		follow.setAttribute("class", "row justify-content-center");
		username.setAttribute("class", "h3 text-primary col-4");
		following_label.setAttribute("class", "h3 text-warning col-4");
		followers_label.setAttribute("class", "h3 text-warning col-4");
		following_div.style.display = "none";
		posts_div.style.display = "none";
		profile_div.style.display = "block";
		document.querySelector("#new").style.display = "none";
		document.querySelector("#control-new").style.display = "none";
		user_details.style.display = "block";
		user_details.innerHTML = "";
		profile_div.innerHTML = "";
		fetch(`posts/${name}/${n}/${id}`, {
			headers: {
				"Content-Type": "application/json"
			},
			cache: "no-store",
		}).then(response => response.json()).then(data => {
			let profile_posts = data;
			
			document.querySelector("#paginator").innerText = n;
			// Show PREV and NEXT button if the pages exist
			if (profile_posts[profile_posts.length - 1].hasNext)
			{
				document.querySelector("#next").style.display = "block";
			} else {
				document.querySelector("#next").style.display = "none";
			}
			if (profile_posts[profile_posts.length - 1].hasPrev)
			{
				document.querySelector("#prev").style.display = "block";
			} else {
				document.querySelector("#prev").style.display = "none";
			}
			// Clear the following page div
			if (profile_div.innerText != "")
			{
				profile_div.innerHTML = "";
			}
			username.innerText = `@${profile_posts[profile_posts.length - 1].user}`;
			following_label.innerText = `Following: ${profile_posts[profile_posts.length - 1].following}`;
			followers_label.innerText = `Followers: ${profile_posts[profile_posts.length - 1].followers}`;
			let follow_btn = `<button id="${profile_posts[profile_posts.length - 1].id}" onclick="follow_user(${profile_posts[profile_posts.length - 1].id})" class="btn btn-outline-primary col-4 mb-2">Follow</button>`
			let unfollow_btn = `<button id="${profile_posts[profile_posts.length - 1].id}" onclick="unfollow_user(${profile_posts[profile_posts.length - 1].id})" class="btn btn-outline-danger col-4 mb-2">Unfollow</button>`
			if (profile_posts[profile_posts.length - 1].isFollowed === true)
			{
				follow.insertAdjacentHTML("beforeend", unfollow_btn);
			} else if (profile_posts[profile_posts.length - 1].isFollowed === false){
				follow.insertAdjacentHTML("beforeend", follow_btn);
			}
			if (user_details.innerText === "")
			{
				details.append(following_label);
				details.append(username);
				details.append(followers_label);
				user_details.append(details);
				user_details.append(follow);
			}
			if (profile_div.innerText === "")
			{
				for (var i = 0; i < profile_posts.length - 1; i++)
				{
					// Create HTML elements
				
					let usr = document.createElement("div");
					let content = document.createElement("p");
					let container = document.createElement("div");
					let img = document.createElement("img");
					let info = document.createElement("p");
					let time = document.createElement("div");
					
					container.setAttribute("class", "container mx-auto bg-dark mt-2");
					usr.setAttribute("class", "row text-primary mt-2 mb-2 ml-4 mr-4");
					content.setAttribute("class", "row text-light mt-2 mb-2 ml-4 mr-4");
					img.setAttribute("src", "");
					info.setAttribute("class", "row justify-content-around mt-2 mb-2 ml-2 mr-2");
					time.setAttribute("class", "row mt-2 mb-2 ml-4 mr-4");
					// Write posts on the DOM
					
					usr.innerText = profile_posts[i].username;
					usr.setAttribute("onclick", `window.localStorage.setItem('name', 'profile');page('profile', 1, ${profile_posts[i].user_id});`)
					content.innerText = profile_posts[i].content;
					if (profile_posts[i].isLogged)
					{
						if (profile_posts[i].LikedByMe)
						{
							info.insertAdjacentHTML('beforeend', `<a class="btn btn-dark mb-2" onclick="like('${name}${i}', ${profile_posts[i].post_id})"><img id="${name}${i}" height="16" width="16" src="static/network/heart.png"></img></a>`);
						} else {
							info.insertAdjacentHTML('beforeend', `<a class="btn btn-dark mb-2" onclick="like('${name}${i}', ${profile_posts[i].post_id})"><img id="${name}${i}" height="16" width="16" src="static/network/dark.png"></img></a>`);
						}
					} else {
						info.insertAdjacentHTML('beforeend', `<a class="btn btn-dark mb-2" onclick="window.location.replace('/login')"><img id="like_img${i}" height="16" width="16" src="static/network/dark.png"></img></a>`);
					}
					time.insertAdjacentHTML('beforeend', `<small class="text-warning">${profile_posts[i].created_at}</small>`);
					info.insertAdjacentHTML('beforeend', `<small class="col-2 text-light">${profile_posts[i].likes} Like(s)</small>`);
					container.append(usr);
					container.append(time);
					container.append(content);
					container.append(document.createElement("hr"));
					container.append(info);
					
					profile_div.append(container);
				}
			}
		}).catch(error => console.log(error))

	}
}

function create_post() 
{
	fetch("create/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		cache: "no-store",
		body: JSON.stringify({
			content: document.querySelector("#content").value,
		})
	}).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error))
}

function follow_user(user_id)
{
	fetch(`users/${user_id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		cache: "no-store",
		body: JSON.stringify({
			action: "Follow",
		})
	}).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error))
	window.location.reload()
}

function unfollow_user(user_id)
{
	fetch(`users/${user_id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		cache: "no-store",
		body: JSON.stringify({
			action: "Unfollow",
		})
	}).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error))
	window.location.reload()
}

function like(i, id)
{
	let img = document.querySelector(`#${i}`);

	if (img.src.slice(-8) === 'dark.png')
	{
		img.src = "static/network/heart.png"
		fetch(`like/${id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-store",
			body: JSON.stringify({
				action: "Like"
			})
		}).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error))
	} else {
		img.src = "static/network/dark.png"
		fetch(`like/${id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-store",
			body: JSON.stringify({
				action: "Unlike"
			})
		}).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error))
	}
}

function edit_view(id)
{
	let post_div = document.querySelector(`#post${id}`);
	let row_div = document.querySelector(`#row${id}`);
	let content = document.querySelector(`#content${id}`);
	if (document.querySelector(`#editContent${id}`))
	{
		row_div.style.display = "none";
		document.querySelector(`#editContent${id}`).style.display = "block";
	} else {
		let row = document.createElement("div");
		row.setAttribute("class", "container");
		row.setAttribute("id", `editContent${id}`);
		row.insertAdjacentHTML('beforeend', `<div class="row justify-content-center"><textarea id="editedContent${id}" row="5" class="bg-dark col-12 ml-2 mr-2 mt-2 mb-2 text-light">${content.innerText}</textarea></div>`);
		row.insertAdjacentHTML('beforeend', `<div class="row justify-content-center"><button class="col-4 btn btn-primary mb-2" onclick="edit_post(${id})">submit</button></div>`);
		row_div.style.display = "none";
		post_div.append(row);
	}
}

function edit_post(id)
{
	let editedContent = document.querySelector(`#editedContent${id}`);
	fetch(`edit/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		cache: "no-store",
		body: JSON.stringify({
			content: editedContent.value
		})
	}).then(response => response.json()).then(data => {
		let content = data.content;
		document.querySelector(`#content${id}`).innerText = content;
		document.querySelector(`#editContent${id}`).style.display = "none";
		document.querySelector(`#row${id}`).style.display = "block";
	}).catch(error => console.log(error))
}