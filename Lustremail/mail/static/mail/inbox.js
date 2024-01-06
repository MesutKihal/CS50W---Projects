document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email(''));
  // sending a mail
  let compose_form = document.querySelector('#compose-form');
  compose_form.addEventListener("submit", function (event) {
	  sendMail();
	  load_mailbox('sent');
  });
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(data) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  if (!data)
  {
	  document.querySelector('#compose-recipients').value = '';
	  document.querySelector('#compose-subject').value = '';
	  document.querySelector('#compose-body').value = '';
  } else {
	  document.querySelector('#compose-recipients').value = data.sender;
	  if (data.subject.slice(0,3) === "Re:")
	  {
		  document.querySelector('#compose-subject').value = data.subject;
	  } else {
		  document.querySelector('#compose-subject').value = "Re: " + data.subject;
	  }
	  document.querySelector('#compose-body').value = "On"+" "+ data.timestamp +" "+ data.sender +" "+"wrote:"+" "+data.body;  
  }
}
  

function load_mailbox(mailbox) {
  console.log(mailbox);
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3 class="text-light bg-dark col-2 mx-auto">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  if (mailbox === "inbox")
  {
	  let mydiv = document.querySelector('#emails-view');
	  mydiv.setAttribute("class", "container-fluid");
	  fetch("/emails/inbox", {
		headers: {
			"Content-Type": "application/json"
		},
		}).then(response => response.json()).then(data => {
			if (!data.length)
			{
				let empty = document.createElement('div');
				empty.setAttribute("class", "row justify-content-center bg-secondary text-light");
				empty.innerText = "You have no emails in your inbox";
				mydiv.append(empty);
			}
			for (var i = 0; i < data.length; i++)
			{
				let row = document.createElement('div');
				let sender = document.createElement('p');
				let content = document.createElement('a');
				let time = document.createElement('small');
				let id = data[i].id;
				content.setAttribute("id", `${data[i].id}`);
				if (data[i].read === true)
				{
					row.setAttribute("class", "row justify-content-between bg-secondary mt-2");
					sender.setAttribute("class", "col-4 text-light");
					content.setAttribute("class", "col-4 text-light");
					time.setAttribute("class", "col-2 text-light");
				} else {
					row.setAttribute("class", "row justify-content-between bg-light mt-2");
					sender.setAttribute("class", "col-4 text-dark");
					content.setAttribute("class", "col-4 text-dark");
					time.setAttribute("class", "col-2 text-dark");
				}
				
				content.addEventListener("click", function (event) {
					myMail(id, "inbox");
				});
				sender.innerText = data[i].sender;
				content.innerText = data[i].subject;
				time.innerText = data[i].timestamp;
				row.append(sender);
				row.append(content);
				row.append(time);
				mydiv.append(row);
			}

		}).catch(error => console.error('error: ', error)); 
  }
  if (mailbox === "sent") {
	  let mydiv = document.querySelector('#emails-view');
	  mydiv.setAttribute("class", "container-fluid");
	  fetch("/emails/sent", {
		headers: {
			"Content-Type": "application/json"
		},
		}).then(response => response.json()).then(data => {
			if (!data.length)
			{
				let empty = document.createElement('div');
				empty.setAttribute("class", "row justify-content-center bg-secondary text-light");
				empty.innerText = "You have not sent any email yet.";
				mydiv.append(empty);
			}
			for (var i = 0; i < data.length; i++)
			{
				let row = document.createElement('div');
				let sender = document.createElement('p');
				let content = document.createElement('a');
				let time = document.createElement('small');
				let id = data[i].id;
				content.setAttribute("id", `${data[i].id}`);
				if (data[i].read === true)
				{
					row.setAttribute("class", "row justify-content-between bg-secondary mt-2");
					sender.setAttribute("class", "col-4 text-light");
					content.setAttribute("class", "col-4 text-light");
					time.setAttribute("class", "col-2 text-light");
				} else {
					row.setAttribute("class", "row justify-content-between bg-light mt-2");
					sender.setAttribute("class", "col-4 text-dark");
					content.setAttribute("class", "col-4 text-dark");
					time.setAttribute("class", "col-2 text-dark");
				}
				
				content.addEventListener("click", function (event) {
					myMail(id, "sent");
				});
				sender.innerText = data[i].sender;
				content.innerText = data[i].subject;
				time.innerText = data[i].timestamp;
				row.append(sender);
				row.append(content);
				row.append(time);
				mydiv.append(row);
			}

		}).catch(error => console.error('error: ', error)); 	  
  }
  if (mailbox === "archive") {
	  let mydiv = document.querySelector('#emails-view');
	  mydiv.setAttribute("class", "container-fluid");
	  fetch("/emails/archive", {
		headers: {
			"Content-Type": "application/json"
		},
		}).then(response => response.json()).then(data => {
			if (!data.length)
			{
				let empty = document.createElement('div');
				empty.setAttribute("class", "row justify-content-center bg-secondary text-light");
				empty.innerText = "No emails is archived.";
				mydiv.append(empty);
			}
			for (var i = 0; i < data.length; i++)
			{
				let row = document.createElement('div');
				let sender = document.createElement('p');
				let content = document.createElement('a');
				let time = document.createElement('small');
				let id = data[i].id;
				content.setAttribute("id", `${data[i].id}`);
				if (data[i].read === true)
				{
					row.setAttribute("class", "row justify-content-between bg-secondary mt-2");
					sender.setAttribute("class", "col-4 text-light");
					content.setAttribute("class", "col-4 text-light");
					time.setAttribute("class", "col-2 text-light");
				} else {
					row.setAttribute("class", "row justify-content-between bg-light mt-2");
					sender.setAttribute("class", "col-4 text-dark");
					content.setAttribute("class", "col-4 text-dark");
					time.setAttribute("class", "col-2 text-dark");
				}
				
				content.addEventListener("click", function (event) {
					myMail(id, "archive");
				});
				sender.innerText = data[i].sender;
				content.innerText = data[i].subject;
				time.innerText = data[i].timestamp;
				row.append(sender);
				row.append(content);
				row.append(time);
				mydiv.append(row);
			}

		}).catch(error => console.error('error: ', error)); 
  }
}

function sendMail()
{
	fetch("/emails", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-store',
		body: JSON.stringify({
			recipients: document.querySelector('#compose-recipients').value,
			subject: document.querySelector('#compose-subject').value,
			body: document.querySelector('#compose-body').value
		})
		}).then(response => response.json()).then(data => console.log(data)).catch(error => console.error("Error: ", error));
}

function myMail(id, page) {
	fetch(`/emails/${id}`, {
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(response => response.json()).then(data => {
		// Clear Page
		document.querySelector('#emails-view').innerHTML = '';
		// Refill page with appropriate content
		let mydiv = document.querySelector('#emails-view');
		mydiv.setAttribute("class", "container-fluid");
		let row = document.createElement('div');
		let sender = document.createElement('div');
		let recipients = document.createElement('div');
		let subject = document.createElement('div');
		let content = document.createElement('div');
		let time = document.createElement('div');
		let reply = document.createElement('button');
		let archive = document.createElement('button');
		let id = data.id;
		content.setAttribute("id", `${data.id}`);
		row.setAttribute("class", "container justify-content-between bg-dark mt-2");
		sender.setAttribute("class", "row text-light ml-4");
		recipients.setAttribute("class", "row text-light ml-4");
		subject.setAttribute("class", "row text-light ml-4");
		content.setAttribute("class", "row text-light ml-4");
		time.setAttribute("class", "row text-light ml-4");
		reply.setAttribute("class", "btn btn-primary ml-4");
		archive.setAttribute("class", "btn btn-success ml-4");
		if (data.archived)
		{
			archive.setAttribute("class", "btn btn-danger ml-4");
			archive.innerText = "Unarchive";
		} else {
			archive.innerText = "Archive";
		}
		reply.addEventListener("click", function (event) {
			compose_email(data);
		});
		sender.innerText = "From :\t" + data.sender;
		recipients.innerText = "To :\t" + data.recipients;
		subject.innerText = "Subject :\t" + data.subject;
		content.innerText = data.body;
		reply.innerText = "Reply";
		time.innerText = "Timestamp :\t" + data.timestamp;
		row.append(sender);
		row.append(recipients);
		row.append(subject);
		row.append(time);
		if (page != "sent")
		{
			row.append(archive);
			row.append(reply);
		}
		row.append(document.createElement("hr"));
		row.append(content);
		row.append(document.createElement("hr"));
		mydiv.append(row);
		// Mark email as read
		fetch(`/emails/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-store',
		body: JSON.stringify({
			read: true
		})
		})
		// Archive or Unarchive
		archive.addEventListener("click", function (event) {
			if (data.archived)
			{
				fetch(`/emails/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
				body: JSON.stringify({
					archived: false
				})
				})
				load_mailbox("inbox");
			} else {
				fetch(`/emails/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
				body: JSON.stringify({
					archived: true
				})
				})
				load_mailbox("inbox");
			}
		});
	}).catch(error => console.error("Error: ", error));

}
