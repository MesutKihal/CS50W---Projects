from django.shortcuts import render, redirect
from .forms import CreateEntry, EditEntry
from django.contrib import messages
from . import util
import re
import random as rm

app_name = "encyclopedia"

def entry(request, title):
    content = util.get_entry(title)
    if type(content) is str:
        # Patterns
        h1 = re.compile(r'^#\s+[a-zA-Z0-9]+')
        h2 = re.compile(r'#{2}\s+[a-zA-Z0-9]+')
        inner = re.compile(r'\[{1}[a-zA-Z0-9]+\]{1}')
        href = re.compile(r'\({1}[\S]+\){1}')
        a = re.compile(r'\[{1}[a-zA-Z0-9]+\]{1}\({1}[\S]+\){1}\s{1}')
        italic = re.compile(r'\*{2}[^*\n]+\*{2}')
        bold = re.compile(r'\*{1}[^*\n]+\*{1}')
        li = re.compile(r'\*[^*\n]+')
        # Matches
        aas = re.findall(a, content)
        hrefs = list(re.findall(href, content))
        inners = list(re.findall(inner, content))
        h1s = list(re.findall(h1, content))
        h2s = list(re.findall(h2, content))
        italics = list(re.findall(italic, content))
        bolds = list(re.findall(bold, content))
        lists = list(re.findall(li, content))
        # Replace with the proper HTML
        for match in h2s:
            content = content.replace(match, f"<h2 style=\"font-weight: bold;\">{match[2:]}</h2>")
            
        for match in h1s:
            content = content.replace(match, f"<h1 style=\"font-weight: bold;\">{match[2:]}</h1>")
        i = 0
        for match in aas:
            href = hrefs[i][1:-1]
            inner = inners[i][1:-1]
            content = content.replace(match, f"<a href=\"{href}\">{inner}</a>")
            i += 1
            
        for match in italics:
            content = content.replace(match, f"<p style=\"display:inline;font-style:italic;\">{match[2:-2]}</p>")
            
        for match in bolds:
            content = content.replace(match, f"<p style=\"display:inline;font-weight:bold;\">{match[2:-2]}</p>")
        i = 0
        for match in lists:
            if i == 0:
                content = content.replace(match, f"<ul><li>{match[2:]}</li>")
            elif i == len(lists) - 1:
                content = content.replace(match, f"<li>{match[2:]}</li></ul>")
            else:
                content = content.replace(match, f"<li>{match[2:]}</li>")
            i += 1
        
    else:
        content = ""
    return render(request, "encyclopedia/entry.html", {
        "content": content,
        "title": title,
   })

def new(request):
    if request.method == "POST":
        form = CreateEntry(request.POST)
        if form.is_valid():
            title = form.cleaned_data['title']
            markdown = form.cleaned_data['markdown']
            if util.get_entry(title):
                messages.error(request, "Entry already exists")
            else:
                util.save_entry(title, markdown)
                messages.success(request, "Entry created successfully")
        return entry(request, title)
    else:
        form = CreateEntry()
    return render(request, "encyclopedia/new.html", {"form": form})

def edit(request, title):
    form_title = request.GET.get("form-title", "")
    form_markdown = request.GET.get("form-markdown", "")
    markdown = util.get_entry(title)
    if form_title and form_markdown:
        util.save_entry(form_title, form_markdown)
        messages.success(request, "Entry edited successfully")
        return entry(request, form_title)

    return render(request, "encyclopedia/edit.html", {"title": title,
                                                "markdown": markdown})

def index(request):
    q = request.GET.get("q", "")
    entries = util.list_entries()
    if q:
        if q in entries:
            return entry(request, q)
        else:
            entries = list(sorted([entry for entry in entries if q in entry]))
    return render(request, "encyclopedia/index.html", {
        "entries": entries,
    })
    

def random(request):
    title = rm.choice(util.list_entries())
    return entry(request, title)