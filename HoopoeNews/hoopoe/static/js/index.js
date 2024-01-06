document.addEventListener('DOMContentLoaded', (event) => {
	// Select divs
	let news_div = document.querySelector('#news_div');
	let selector = document.getElementsByName('selector')[0];
	let navbar = document.querySelector("#category-navbar");
	let navburger = document.querySelector("#navburger");
	let input = document.querySelector("#search-input");
	let profile_btn = document.querySelector('#profile_btn');

	// Handle events
	selector.addEventListener("change", (event) => {
		getCategory(selector.options[selector.selectedIndex].value);
	})
	if (profile_btn)
	{
		profile_btn.addEventListener("click", (event) => {
			window.localStorage.setItem('page_name', 'profile');
			profilePage(profile_btn.dataset.id);
		})
	}
	if (window.innerWidth <= 600)
	{
		navbar.setAttribute("style", "display: none;");
	}
	window.addEventListener("resize", (event) => {
		if (window.innerWidth <= 600)
		{
			navbar.setAttribute("class", "navbar is-mobile is-centered has-background-white-bis");
			navbar.setAttribute("style", "display: none;");
		} else {
			if (!profile_btn)
			{
				navbar.setAttribute("class", "columns navbar is-mobile is-centered has-background-white-bis");
			}
			navbar.setAttribute("style", "");
		}
	})
	window.dispatchEvent(new Event('resize'));
	// If the app is ran on a mobile show the burger
	if (navburger)
	{
		navburger.addEventListener("click", (event) => {
			if (navbar.style.display === "none")
			{
				navbar.style = "";
				navbar.setAttribute("class", "navbar box is-mobile is-centered");
			} else {
				navbar.style.display = "none"
			}
		})
	}
	
	// Get stored variables from the local storage
	let n = 1;
	if (!window.localStorage.getItem('n'))
	{
		window.localStorage.setItem('n', 1);
		let n = Number(window.localStorage.getItem('n'));
	} else {
		let n = Number(window.localStorage.getItem('n'));
	}
	// Return both page_name and n to their default values
	if (!window.localStorage.getItem('page_name'))
	{
		window.localStorage.setItem('page_name', 'top');
		let page_name = window.localStorage.getItem('page_name');
		let q = document.querySelector("#search-input").value;
		getArticles(page_name, n, q);
	} else {
		let page_name = window.localStorage.getItem('page_name');
		let q = document.querySelector("#search-input").value;
		getArticles(page_name, n, q);
	}
	// Handle the input event on the search bar
	input.addEventListener("input", (event) => {
		let page_name = window.localStorage.getItem('page_name');
		let n = window.localStorage.getItem('n');
		let q = document.querySelector("#search-input").value;
		getArticles(page_name, n, q);
	})
})

// Get and write main heading on the DOM
function getArticles(category, n, q)
{
	// If the page_name is equals to profile return values back to default
	if (category != "profile")
	{
		window.localStorage.setItem('page_name', category);
	} else {
		window.localStorage.setItem('page_name', "top");
		category = "top";
	}
	window.localStorage.setItem('n', n);
	let news_div = document.querySelector('#news_div');
	let paginator = document.querySelector('#paginator');
	let profile_div = document.querySelector('#profile_page');
	if (q === "")
	{
		q = "no-search-query";
	}
	// Clear all other pages
	document.querySelector('#article_page').innerText = "";
	profile_div.innerText = "";
	// document.querySelector("#category-navbar").style = "none";
	document.querySelector("#navburger").style = "";
	if (paginator)
	{
		paginator.style = "";
	}
	// Fetch data from api
	fetch(`articles/${category}/${n}/${q}`, {
		headers : {
			'Content-Type': 'application/javascript'
		},
		cache: 'no-store'
	}).then(response => response.json()).then(data => {
		let news_div = document.querySelector('#news_div');
		// Write content to DOM
		if (n == 1 || q != "no-search-query")
		{
			news_div.innerText = "";
		}
		for (var i = 0; i < data.length; i++)
		{
			// Create HTML elements
			let article_div = document.createElement('div');
			let title = document.createElement('a');
			let desc = document.createElement('p');
			let img = document.createElement('img');
			// The first article should be larger
			if (i == 0 && n == 1)
			{
				article_div.setAttribute('class', 'column card is-half is-auto ml-2 mb-2');
				img.setAttribute('width', '512');
				img.setAttribute('height', '512');
			} else {
				article_div.setAttribute('class', 'column card is-one-quarter ml-2 mb-2');
				img.setAttribute('width', '256');
				img.setAttribute('height', '256');
			}
			// Add settings to elements
			title.setAttribute('class', 'is-size-4 has-text-dark is-bold ml-2 mr-2');
			title.setAttribute('onclick', `articlePage('${data[i].id}')`);
			desc.setAttribute('class', 'is-size-6 has-text-grey-light');
			img.setAttribute('class', 'image is-mobile');
			article_div.dataset.id = data[i].id;
			title.innerText = data[i].title;
			if (data[i].description.length > 300)
			{
				desc.innerText = data[i].description.slice(0, 300) + "...";
			} else {
				desc.innerText = data[i].description;
			}
			if (data[i].image === "")
			{
				img.src = "static/img/noimage.jpg"
			} else {
				img.src = `${data[i].image}`;
			}
			// Add elements to the main div
			article_div.append(img);
			article_div.append(title);
			article_div.append(desc);
			news_div.append(article_div);
		}
	}).catch(error => console.log(error))
}

// Get more articles from api
function getMore ()
{
	let page_name = window.localStorage.getItem('page_name');
	let n = Number(window.localStorage.getItem('n')) + 1;
	let q = document.querySelector("#search-input").value;
	getArticles(page_name, n, q);
}

// Get articles relating to the category
function getCategory(page_name)
{
	window.localStorage.setItem('n', 1);
	let n = Number(window.localStorage.getItem('n'));
	let q = document.querySelector("#search-input").value;
	getArticles(page_name, n, q);
}

// Customize the article page
function articlePage(id)
{
	fetch(`article/${id}`, {
		headers: {
			"Content-Type": "application/javascript",
		},
		cache: "no-store"
	}).then(response => response.json()).then(data => {
		// Select main divs
		let article_page = document.querySelector('#article_page');
		let paginator = document.querySelector('#paginator');
		let profile_div = document.querySelector('#profile_page');
		// Clear other divs
		document.querySelector('#news_div').innerText = "";
		profile_div.innerText = "";
		document.querySelector("#category-navbar").style = "";
		document.querySelector("#navburger").style = "";
		if (paginator)
		{
			paginator.style.display = "none";
		}
		// Create HTML elements
		let row = document.createElement('div');
		let img = document.createElement('img');
		let title = document.createElement('p');
		let creator = document.createElement('p');
		let desc = document.createElement('p');
		let content = document.createElement('p');
		let video = document.createElement('video');
		let country = document.createElement('p');
		let pubDate = document.createElement('p');
		let source = document.createElement('source');
		let details = document.createElement('div');
		let interact = document.createElement('div');
		let isave = document.createElement('img');
		let comment = document.createElement('input');
		let save_div = document.createElement('div'); 
		let comments = document.createElement('div');
		let post = document.createElement('button');
		
		// Add styling to HTML Elements
		row.setAttribute('class', 'box is-mobile is-centered');
		comments.setAttribute('class', 'block');
		img.setAttribute('class', 'image');
		img.width = 1024;
		img.height = 768;
		title.setAttribute('class', 'is-size-4 is-bold');
		desc.setAttribute('class', 'is-size-6 has-text-grey is-italic mt-2 mb-2');
		content.setAttribute('class', 'is-size-6 has-text-grey-dark mb-4');
		content.setAttribute('style', 'font-family: verdana;')
		details.setAttribute('class', 'columns');
		pubDate.setAttribute('class', 'column is-one-third has-text-grey-light is-italic');
		creator.setAttribute('class', 'column is-two-thirds has-text-grey-light is-italic');
		interact.setAttribute('class', 'columns is-mobile is-centered');
		save_div.setAttribute('class', 'column is-2');
		post.setAttribute('class', 'button column is-2 is-rounded has-background-info has-text-white ml-2 mt-5');
		isave.setAttribute('id', 'isave');
		isave.dataset.id = data.id;
		if (data.isSaved == true)
		{
			isave.src = "static/img/saved.png";
		} else {
			isave.src = "static/img/unsaved.png";
		}
		// Handle the saving event
		isave.onclick = (event) => {
			if (isave.src.slice(-11,) === "unsaved.png")
			{
				isave.src = isave.src.slice(0,-11) + "saved.png";
				saveArticle(isave.dataset.id);
			} else if (isave.src.slice(-9,) === "saved.png")
			{
				isave.src = isave.src.slice(0,-9) + "unsaved.png";
				unsaveArticle(isave.dataset.id);
			}
		}
		isave.width = 64;
		isave.height = 64;
		post.innerText = "Comment";
		comment.setAttribute('class', 'column is-6 input is-rounded is-link mt-5');
		comment.setAttribute('placeholder', 'Comment your thoughts here');
		// Handle the comment event
		post.onclick = (event) => {
			commentOn(isave.dataset.id, comment.value);
			document.querySelector('#article_page').innerText = "";
			window.setTimeout(() => {
				articlePage(isave.dataset.id);
			}, 2000)
			
		}
		// Add data to HTML Elements
		if (data.image === "")
		{
			img.src = "static/img/noimage.jpg";
		} else {
			img.src = data.image;
		}
		title.innerText = data.title;
		desc.innerText = data.description;
		content.innerText = data.content;
		if (data.creator != "")
		{
			creator.innerText = "Published By: " + data.creator + " - " + data.country;
		}
		pubDate.innerText = data.pubDate;
		// If the user is logged show the save and comment panel
		if (data.isLogged)
		{
			save_div.append(isave);
			interact.append(save_div);
			interact.append(comment);
			interact.append(post);
		}
		row.append(img);
		row.append(title);
		details.append(creator);
		details.append(pubDate);
		row.append(details);
		row.append(desc);
		row.append(content);
		row.append(interact);
		// If a video exists add it
		if (data.video != "")
		{
			video.controls = true;
			source.src = data.video;
			video.appendChild(source);
			row.append(video);
		}
		// Write comments to the DOM
		for (var i = 0; i < data.comments.length; i++)
		{
			let container = document.createElement('div');
			let user = document.createElement('p');
			let content = document.createElement('p');
			container.setAttribute('class', 'box row is-mobile is-centered has-background-white-bis');
			user.innerText = data.comments[i].user;
			user.setAttribute('class', 'is-size-5 has-text-info');
			content.innerText = data.comments[i].content;
			content.setAttribute('class', 'is-size-6 has-text-dark');
			container.append(user);
			container.append(content);
			comments.append(container);
		}
		article_page.append(row);
		article_page.append(comments);
	})
}

// Customize the profile page
function profilePage(id)
{
	// Select divs
	let news_div = document.querySelector("#news_div");
	let article_div = document.querySelector("#article_page");
	let paginator = document.querySelector("#paginator");
	let profile_div = document.querySelector("#profile_page");
	// Create HTML elements
	let title_div = document.createElement('div');
	let edit_profile = document.createElement('div');
	let saved_articles = document.createElement('div');
	
	// Clear divs
	news_div.innerText = "";
	article_div.innerText = "";
	paginator.style.display = "none";
	profile_div.innerText = "";
	// Add styling to HTML elements
	title_div.setAttribute("class", "block");
	edit_profile.setAttribute("class", "block");
	saved_articles.setAttribute("class", "columns is-mobile is-centered");
	saved_articles.style = "flex-wrap: wrap;"
	document.querySelector("#category-navbar").style.display = "none";
	document.querySelector("#navburger").style.display = "none";
	// Add the title label
	let title_lbl = document.createElement('h1');
	title_lbl.setAttribute('class', 'columns is-mobile is-centered is-size-1 has-text-info');
	title_lbl.innerText = "Profile";
	title_div.append(title_lbl);
	profile_div.append(title_div);
	fetch(`profile/${id}`, {
		headers: {
			"Content-Type": "application/javascript"
		},
		cache: "no-store"
	}).then(response => response.json()).then(data => {
		for (var i = 0; i < 2; i++)
		{
			// Create HTML elements
			let div = document.createElement('div');
			let lbl = document.createElement('label');
			let input = document.createElement('label');
			// Set class for these elements
			div.setAttribute('class', 'columns is-mobile is-centered');
			lbl.setAttribute('class', 'label column is-one-fifth has-text-info mr-2');
			input.setAttribute('class', 'label column is-one-quarter is-size-6 has-text-dark mt-2');
			// Add content to elements
			lbl.innerText = data[i][0];
			input.innerText = data[i][1];
			// Append elements
			div.append(lbl);
			div.append(input);
			edit_profile.append(div);
		}
		// Add the second title label
		let title_lbl_2 = document.createElement('h1');
		title_lbl_2.setAttribute('class', 'columns is-mobile is-centered is-size-3 has-text-info');
		title_lbl_2.innerText = "Saved Articles";
		for (var i = 0; i < data[3].length; i++)
		{
			// Create HTML elements
			let article_div = document.createElement('div');
			let title = document.createElement('a');
			let desc = document.createElement('p');
			let img = document.createElement('img');
			// Add styling to elements
			article_div.setAttribute('class', 'column card is-one-quarter ml-2 mb-2');
			img.setAttribute('width', '256');
			img.setAttribute('height', '256');
			title.setAttribute('class', 'is-size-4 has-text-dark is-bold ml-2 mr-2');
			title.setAttribute('onclick', `articlePage('${data[3][i].id}')`);
			desc.setAttribute('class', 'is-size-6 has-text-grey-light');
			img.setAttribute('class', 'image is-mobile');
			
			article_div.dataset.id = data[3][i].id;
			title.innerText = data[3][i].title;
			if (data[3][i].description.length > 300)
			{
				desc.innerText = data[3][i].description.slice(0, 300) + "...";
			} else {
				desc.innerText = data[3][i].description;
			}
			if (data[3][i].image === "")
			{
				img.src = "static/img/noimage.jpg"
			} else {
				img.src = `${data[3][i].image}`;
			}
			// Add elements to the article div
			article_div.append(img);
			article_div.append(title);
			article_div.append(desc);
			saved_articles.append(article_div);
		}
		// Add elements to the main div
		profile_div.append(edit_profile);
		profile_div.append(title_lbl_2);
		profile_div.append(saved_articles);
	}).catch(error => console.log(error))
}

// Send a request to save the article
function saveArticle(id)
{
	fetch("save_article/", {
		method: "POST",
		headers: {
			"Content-Type": "application/javascript",
		},
		cache: "no-store",
		body: JSON.stringify({
			article_id: id,
			action: 'save',
		})
	}).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error))
}
// Send a request to unsave the article
function unsaveArticle(id)
{
	fetch("save_article/", {
		method: "POST",
		headers: {
			"Content-Type": "application/javascript",
		},
		cache: "no-store",
		body: JSON.stringify({
			article_id: id,
			action: 'unsave',
		})
	}).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error))
}
// Send a request to comment on the article
function commentOn(id, content)
{
	fetch('comment_article/', {
		method: "POST",
		headers: {
			"Content-Type": "application/javascript",
		},
		body: JSON.stringify({
			article_id: id,
			comment: content,
		})
	}).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error))
}